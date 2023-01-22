import { StackProps, Stack, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseEnvs, baseEnvs, getServiceName } from "../config/environment";
import {
  HttpApi,
  HttpApiProps,
  CorsHttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import {
  Code,
  Function,
  ILayerVersion,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  HttpMethod,
  Rule,
  RuleTargetInput,
  Schedule,
} from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class CdkStack extends Stack {
  private api?: HttpApi;
  private envs: BaseEnvs;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.envs = baseEnvs();
    this.configureApiGateway();
    this.configureLaravelProject();
  }

  private configureLaravelProject() {
    // Deploy lambda for HTTP requests
    const lambdaLaravelFunctionName = this.getResourceName("Laravel");
    const lamdaLaravelFunction = this.createLambdaFunction({
      lambdaName: this.getResourceName("Laravel"),
      handler: "public/index.php",
      timeout: 20,
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "php-74-fpm",
          "arn:aws:lambda:eu-central-1:209497400698:layer:php-74-fpm:66"
        ),
      ],
    });

    ["/", "/{any+}"].forEach((path) => {
      this.api?.addRoutes({
        path,
        methods: [
          HttpMethod.GET,
          HttpMethod.PATCH,
          HttpMethod.PUT,
          HttpMethod.DELETE,
          HttpMethod.OPTIONS,
        ],
        integration: new HttpLambdaIntegration(
          lambdaLaravelFunctionName,
          lamdaLaravelFunction
        ),
      });
    });

    // Deploy lambda for Cron
    const lambdaName = this.getResourceName("Artisan");
    const lambdaFunction = this.createLambdaFunction({
      lambdaName: lambdaName,
      handler: "artisan-for-lambda.php",
      timeout: 60,
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "php-74",
          "arn:aws:lambda:eu-central-1:209497400698:layer:php-74:66"
        ),
      ],
    });

    [
      {
        command: "hello:world",
        cron: {
          minute: "0",
          hour: "0",
          day: "*",
          month: "*",
          year: "*",
        },
      },
    ].forEach(({ cron, command }) => {
      new Rule(this, `${lambdaName}-Rule`, {
        schedule: Schedule.cron(cron),
        targets: [
          new LambdaFunction(lambdaFunction, {
            event: RuleTargetInput.fromText(command),
          }),
        ],
      });
    });
  }

  /**
   * Configure api gateway
   * @returns
   */
  private configureApiGateway(): void {
    const apiGatewayName = this.getResourceName("Api");

    const apiProps: HttpApiProps = {
      apiName: apiGatewayName,
      description: `API for ${getServiceName()}`,
      corsPreflight: {
        allowOrigins: ["*"],
        allowHeaders: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
      },
    };

    this.api = new HttpApi(this, apiGatewayName, apiProps);
  }

  /**
   * Create lambda function
   * @param param0
   * @returns
   */
  private createLambdaFunction({
    handler,
    lambdaName,
    timeout,
    layers,
  }: {
    handler: string;
    lambdaName: string;
    timeout: number;
    layers: ILayerVersion[];
  }): Function {
    const lambdaFunction = new Function(this, lambdaName, {
      functionName: lambdaName,
      runtime: Runtime.PROVIDED_AL2,
      memorySize: 2048,
      code: Code.fromAsset("build/laravel/"),
      handler,
      reservedConcurrentExecutions: 1,
      timeout: Duration.seconds(timeout),
      environment: {
        ...this.envs,
      },
      layers,
    });

    return lambdaFunction;
  }

  private getResourceName(postfix: string): string {
    return `${getServiceName()}-${postfix}`;
  }
}

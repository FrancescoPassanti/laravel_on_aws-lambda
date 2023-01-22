#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";
import { getAccount, getRegion, getServiceName } from "../config/environment";

const app = new cdk.App();
new CdkStack(app, getServiceName(), {
  description: "Laravel On Lambda",
  env: {
    region: getRegion(),
    account: getAccount(),
  },
});

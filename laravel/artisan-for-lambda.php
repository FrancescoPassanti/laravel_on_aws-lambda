<?php

require __DIR__ . '/vendor/autoload.php';


/* 
It contains the same code as the artisan file but is wrapped in a function.
This file is being used as a handler for the Lambda function in the cdk-stack.ts file.

The suggested way to trigger an artisan command is documented on this page https://bref.sh/docs/runtimes/console.html but after the deployment,
the function didn't run once but countless times till the function timeout occurred.

*/
return function ($event) {
    $app = require_once __DIR__ . '/bootstrap/app.php';

    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    $status = $kernel->handle(
        $input = new Symfony\Component\Console\Input\ArgvInput(['artisan', $event]),
        new Symfony\Component\Console\Output\ConsoleOutput
    );

    $kernel->terminate($input, $status);

    return $status;
};

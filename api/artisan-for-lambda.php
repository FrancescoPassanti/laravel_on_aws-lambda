<?php

require __DIR__ . '/vendor/autoload.php';


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

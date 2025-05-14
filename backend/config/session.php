<?php

use Illuminate\Support\Str;

return [

    'driver' => env('SESSION_DRIVER', 'database'),

    'lifetime' => 120,

    'expire_on_close' => false,

    'encrypt' => false,

    'files' => storage_path('framework/sessions'),

    'connection' => env('SESSION_CONNECTION'),

    'table' => 'sessions',

    'store' => env('SESSION_STORE'),

    'lottery' => [2, 100],

    'cookie' => 'laravel_session',

    'path' => '/',

    'domain' => env('SESSION_DOMAIN', null),

    // 'secure' => env('SESSION_SECURE_COOKIE'),
    'secure' => false,

    'http_only' => true,

    'same_site' => 'lax',

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

];

<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'], // Add all routes that need CORS

    'allowed_methods' => ['*'], // Allow all HTTP methods

    'allowed_origins' => ['http://localhost:5173'], // React dev server (adjust as needed)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

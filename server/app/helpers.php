<?php

use App\Http\Middleware\RolePermissionMiddleware;

if (!function_exists('hasPermission')) {
    function hasPermission($slug)
    {
        return RolePermissionMiddleware::checkPermission($slug);
    }
}

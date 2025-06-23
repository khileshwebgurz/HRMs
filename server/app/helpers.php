<?php

use App\Http\Middleware\RolePermissionMiddleware;

if (!function_exists('hasPermission')) {
    function hasPermission($permissionId)
    {
        return RolePermissionMiddleware::checkPermissionById($permissionId);
    }
}

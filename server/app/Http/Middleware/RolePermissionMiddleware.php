<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\Roles;

class RolePermissionMiddleware
{
    public static function checkPermissionById($permissionId)
    {
        $user = Auth::guard('api')->user();

        if (!$user) return false;

        $role = Roles::find($user->user_role);

        if (!$role || empty($role->permissions)) return false;

        $permissionIds = json_decode($role->permissions, true);

        return is_array($permissionIds) && in_array($permissionId, $permissionIds);
    }

    public function handle($request, Closure $next, $permissionId)
    {
        if (!self::checkPermissionById($permissionId)) {
            return response()->json(['message' => 'Permission denied'], 403);
        }

        return $next($request);
    }
}

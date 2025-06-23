<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Roles;
use App\Models\Permissions;
use Illuminate\Support\Facades\Log;

class RolePermissionMiddleware
{
    // Route middleware (optional, not used here)
    public function handle(Request $request, Closure $next, $permissionSlug)
    {
        if (!self::checkPermission($permissionSlug)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }

    // Static method for controller use
    public static function checkPermission($permissionSlug)
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            return false;
        }

        $role = Roles::find($user->user_role);

        if (!$role) {
            return false;
        }

        $permissionIds = json_decode($role->permissions ?? '[]', true);

        $slugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();
           

        return in_array($permissionSlug, $slugs);
    }
}

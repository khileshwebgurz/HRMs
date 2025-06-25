<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use App\Models\Roles;

trait PermissionTrait
{
    public function getUserPermissionIds()
    {
        $user = Auth::guard('api')->user();
        if (!$user) return null;

        $role = Roles::find($user->user_role);
        if (!$role) return null;

        $permissionIds = json_decode($role->permissions ?? '[]', true);
        return is_array($permissionIds) ? $permissionIds : [];
    }

    public function userHasPermission($permissionId)
    {
        $permissionIds = $this->getUserPermissionIds();
        if (is_null($permissionIds)) return false;

        $permissionIds = array_map('intval', $permissionIds);

        if (is_array($permissionId)) {
            foreach ($permissionId as $id) {
                if (in_array((int)$id, $permissionIds)) {
                    return true;
                }
            }
            return false;
        }

        return in_array((int)$permissionId, $permissionIds);
    }

    public function permissionDeniedResponse($message = 'Permission not granted for this user')
    {
        return response()->json([
            'status' => 403,
            'message' => $message,
            'error' => 'Access Denied'
        ], 403);
    }
}
<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/employee/user', function (Request $request) {
        $user = $request->user();

        $role = Roles::find($user->user_role);
        $permissionIds = explode(',', trim($role->permissions, '[]'));
        $permissionSlugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $role->name ?? null,
            'permissions' => $permissionSlugs
        ]);
    });
});

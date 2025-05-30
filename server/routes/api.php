<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use App\Http\Controllers\Employee\EmployeeController;

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

    /* common route*/
    Route::get('/company-profile', [EmployeeController::class, 'CompanyProfileView']);

     /* emp-routes */
     Route::get('/employees', [EmployeeController::class, 'directory']);
     Route::get('/employee/profile/{tab}', [EmployeeController::class, 'empProfile']);
    //  Route::get('/employee/profile/view/{tab}', [ProfileController:class, 'viewprofile'])
});
<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use App\Http\Controllers\Employee\EmployeeController;
use App\Http\Controllers\Employee\LeavesController;
use App\Http\Controllers\Employee\NotificationController;
use App\Http\Controllers\Employee\TeamController;

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
    Route::get('/employee/leaves', [LeavesController::class, 'index']);

    Route::get('/employee/leaves/details', [LeavesController::class, 'leavesDetailAllEmp']);
    Route::post('/employee/leaves/applyLeave', [LeavesController::class, 'applyLeave']);
    Route::get('/employee/approve-leave-request/{leave_id}', [LeavesController::class, 'approveLeaveRequest'])->name('approveLeaveRequest');
    Route::get('/employee/view-leave-request/{leave_id}', [LeavesController::class, 'viewLeaveRequest'])->name('viewLeaveRequest');
    Route::get('/employee/reject-leave-request/{leave_id}', [LeavesController::class, 'rejectLeaveRequest'])->name('rejectLeaveRequest');

    // for notifications
    Route::get('/employee/leaves', [LeavesController::class,'leavesDetailAllEmp'])->name('em-leaves');
    // Route::get('/employee/candidate-test/{test_id}', 'UserController@viewCandidateTest')->name('viewCandidateTest');
    Route::get('/employee/notification',[NotificationController::class,'realTimeNotificationByCurrentUser']);

   Route::get('/employee/getTeamTree',[TeamController::class,'getTeamTree']);
});

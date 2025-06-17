<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use App\Http\Controllers\Employee\EmployeeController;
use App\Http\Controllers\Leaves\LeavesController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\UserController;

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
            'role' => $role->role_name ?? null,
            'role_id' => $role->id ?? null,
            'user_role' => $user->user_role,
            'permissions' => $permissionSlugs
        ]);
    });

    /* common route*/
    Route::get('/company-profile', [EmployeeController::class, 'CompanyProfileView']);

    // Route::middleware(['auth:api', 'role:1'])->group(function () {
    //     Route::get('/company-profile', [EmployeeController::class, 'CompanyProfileView']);
    // });

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
    Route::get('/employee/leaves', [LeavesController::class, 'leavesDetailAllEmp'])->name('em-leaves');
    // Route::get('/employee/candidate-test/{test_id}', 'UserController@viewCandidateTest')->name('viewCandidateTest');
    Route::get('/employee/notification', [NotificationController::class, 'realTimeNotificationByCurrentUser']);
   

    // team chart route
    Route::get('/employee/getTeamTree', [TeamController::class, 'getTeamTree']);

    //    for leave logs to the manager
    Route::get('/leave-logs', [LeavesController::class, 'logs'])->name('logs');
    Route::post('/get-decline-request', [LeavesController::class, 'decline'])->name('decline');
    Route::post('/get-approval-request', [LeavesController::class, 'approveRequest'])->name('approveRequest');
    

    //    attendance log
    Route::get('/attendance-logs', [AttendanceController::class, 'attendanceLog']);

    // calendar log
    Route::get('/calender', [AccountController::class,'calender']);

    // candidate excel file download
    Route::get('/get-excel',[UserController::class,'exportCandidates']);


});





// Another backup

Route::middleware(['auth:api', 'role:1'])->group(function () {
    Route::get('/admin-data', [AdminController::class, 'index']); // Only Admins
});

Route::middleware(['auth:api', 'role:2'])->group(function () {
    Route::get('/recruiter-data', [RecruiterController::class, 'index']); // Only Recruiters
});

Route::middleware(['auth:api', 'role:1,2'])->group(function () {
    Route::get('/admin-or-recruiter', [SomeController::class, 'index']);
});
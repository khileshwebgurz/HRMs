<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Employee\EmployeeController;
use App\Http\Controllers\Leaves\LeavesController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\Employee\AttendanceLogController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TrackerController;

//  Public (Unauthenticated) Routes
Route::post('/login', [AuthController::class, 'login']);

//  Protected (Authenticated) Routes
Route::middleware(['auth:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'dashboard']);
  

    // Get logged-in user
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

    // Shared routes for all authenticated users

    Route:: get('/candidates', [TrackerController::class, 'allCandidates']);
    Route::post('/add', [TrackerController::class, 'addCandidatePost']);
    Route::post('/check', [TrackerController::class, 'checkCandidate']);
    Route::put('/edit/{candidate_id}', [TrackerController::class, 'editCandidatePost']);
    Route::delete('/delete/{candidate_id}', [TrackerController::class, 'deleteCandidate']);
    Route::get('/send-email/{candidate_id}', [TrackerController::class, 'sendEmailCandidateProfile']);
    Route::get('/mail-to-hr', [TrackerController::class, 'mailToHr']);




    Route::get('/candidate/profile/{profile_id}', [UserController::class, 'candidateProfileView']);



    Route::get('/leave-logs', [LeavesController::class, 'logs'])->name('logs');
    Route::get('/employees', [EmployeeController::class, 'directory']);
    Route::get('/employee/profile/{tab}', [EmployeeController::class, 'empProfile']);
    Route::get('/employee/leaves', [LeavesController::class, 'index']);
    Route::get('/employee/leaves/details', [LeavesController::class, 'leavesDetailAllEmp']);
    Route::get('/employee/leaves/empLeavelog', [LeavesController::class, 'employeeLogs']);
    Route::post('/employee/leaves/delete', [LeavesController::class, 'deleteLeave']);
    Route::post('/employee/leaves/delete-post', [LeavesController::class, 'deleteLeavePost'])->name('em-leave-delete-post');

    Route::post('/employee/leaves/applyLeave', [LeavesController::class, 'applyLeave']);
    Route::get('/employee/getTeamTree', [TeamController::class, 'getTeamTree']);
    Route::get('/employee/attendance', [AccountController::class, 'monthlyAttendance']);
    Route::get('/calender', [AccountController::class, 'calender']);
    Route::get('/company-profile', [EmployeeController::class, 'CompanyProfileView']);
    Route::get('/employee/notification', [NotificationController::class, 'realTimeNotificationByCurrentUser']);
    Route::post('/change-password', [AccountController:: class ,'editProfile'])->name('em-edit-profile');

    // ticket
    Route::get('/ticketViewByEmployee',[TicketController::class,'ticketViewByEmployee']);
    Route::post('/addTicket',[TicketController::class,'addTicket']);

    // Event notification 
    // Route::get('/birthday', [EventController::class ,'birthdayMail'])->name('birthdayMail');

    // AttendanceLogController
    // Route::post('/clock-in', [AttendanceLogController::class, 'clockIn']);

    
    //roles
    Route::get('/permissions', [RoleController::class, 'getPermissions']);
    Route::get('/roles/{id}', [RoleController::class, 'getRole']);
    Route::get('/roles', [RoleController::class, 'allRoles']);
    Route::post('/roles/add', [RoleController::class, 'addRolePost']);
    Route::delete('/roles/{id}', [RoleController::class, 'deleteRole']);
    Route::get('/roles/{id}', [RoleController::class, 'getRoleById']);
    Route::put('/roles/{id}', [RoleController::class, 'updateRole']);

    // Permissions

    Route::get('/roles/{role_id}/permissions', [RoleController::class, 'getAssignedPermissions'])->name('api.roles.get_permissions');
    Route::post('/roles/assign-permissions', [RoleController::class, 'assignPermissionPost'])->name('api.roles.assign_permissions');
    Route::get('/roles/{role_id}/field-permissions', [RoleController::class, 'getFieldPermissions']);
    Route::post('/roles/{role_id}/field-permissions/update', [RoleController::class, 'updateFieldPermission']);

     //  Admin-only routes
    Route::middleware('role:1')->group(function () {
        Route::get('/employee/approve-leave-request/{leave_id}', [LeavesController::class, 'approveLeaveRequest'])->name('approveLeaveRequest');
        Route::get('/employee/view-leave-request/{leave_id}', [LeavesController::class, 'viewLeaveRequest'])->name('viewLeaveRequest');
        Route::get('/employee/reject-leave-request/{leave_id}', [LeavesController::class, 'rejectLeaveRequest'])->name('rejectLeaveRequest');
        
        Route::post('/get-decline-request', [LeavesController::class, 'decline'])->name('decline');
        Route::post('/get-approval-request', [LeavesController::class, 'approveRequest'])->name('approveRequest');

        Route::get('/get-excel', [UserController::class, 'exportCandidates']);

        // helpdesk search
        Route::get('/helpdesk-search', [SettingController::class,'helpdesk_search'])->name('em-helpdesk-search');
    });

    //  Employee-only routes (for future)
    Route::middleware('role:2')->group(function () {
        // Add employee-specific routes if needed
        
    });

    // IT support
    Route::middleware('role:3')->group(function () {
        Route::get('/helpdesk-search', [SettingController::class,'helpdesk_search'])->name('em-helpdesk-search');
    });


    
  
});

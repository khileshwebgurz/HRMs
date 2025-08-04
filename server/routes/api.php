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
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\API\ForgotPasswordController;

use App\Http\Controllers\Employee\OnboardProcessController;

//  Public (Unauthenticated) Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/employee/token/validate/{type}/{token}', [UserController::class, 'validateEmployeeToken'])
    ->where('type', 'accept|declined')
    ->name('employee.token.validate');

Route::post('/employee/token/set-password/{token}', [UserController::class, 'setPasswordEmployeePost'])
    ->name('employee.token.setPassword');


// Protected employee API (must be logged in + ready)
Route::middleware(['auth:api', 'check.readiness:api'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard']);
});

//  Protected (Authenticated) Routes
Route::middleware(['auth:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'dashboard']);

    Route::get('/employee/company-policy', [AccountController::class, 'getCompanyPolicy']);
    Route::get('/employee/readiness-quiz', [AccountController::class, 'getReadinessQuiz']);
    Route::post('/employee/readiness-quiz-save', [AccountController::class, 'saveReadinessQuizResult']);
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
            'permissions' => $permissionSlugs,
            'profile_pic' => $user->profile_pic,
        ]);
    });

   // All Candidate
    Route::get('/candidates', [TrackerController::class, 'allCandidates']);
    Route::post('/add', [TrackerController::class, 'addCandidatePost']);
    Route::post('/check', [TrackerController::class, 'checkCandidate']);
    Route::put('/edit/{candidate_id}', [TrackerController::class, 'editCandidatePost']);
    Route::delete('/delete/{candidate_id}', [TrackerController::class, 'deleteCandidate']);
    Route::get('/send-email/{candidate_id}', [TrackerController::class, 'sendEmailCandidateProfile']);
    Route::get('/mail-to-hr', [TrackerController::class, 'mailToHr']);

    Route::get('/candidate/profile/{profile_id}', [UserController::class, 'candidateProfileView']);
    Route::get('/candidates/{candidate_id}', [UserController::class, 'editCandidate']);
    Route::post('/candidates/update', [UserController::class, 'editCandidatePost']);


    // Active Candidate

Route::post('/candidate-update-profile',[UserController::class,'candidateProfilePost']);

    Route::get('/users/candidate/all-candidates', [UserController::class, 'allCandidates']);
    Route::delete('/candidate/deleteCandidate/{candidate_id}', [UserController::class, 'deleteCandidate']);
    Route::delete('/candidates/{candidate_id}', [TrackerController::class, 'deleteCandidate']);
    Route::get('/users/export-users', [UserController::class, 'exportUsers']);
    Route::get('/users/export-candidates', [UserController::class, 'exportCandidates']);
    Route::get('/users/export-download/{file_name}', [UserController::class, 'exportDownload']);
    Route::get('/all-employees', [UserController::class, 'allEmployees']);
    Route::get('/add-employee', [UserController::class, 'addEmployee']);
    Route::post('/add-employee-post', [UserController::class, 'addEmployeePost']);
    // Route::get('/employee/token/validate/{type}/{token}', [UserController::class, 'validateEmployeeToken']);
    // Route::post('/employee/token/set-password/{token}', [UserController::class, 'setPasswordEmployeePost']);

    Route::get('edit-employee/{user_id}', [UserController::class, 'editEmployee']);
    Route::post('edit-employee-post', [UserController::class, 'editEmployeePost']);

    //test Users Admin,Recruiter,HR
    Route::get('/all-questions', [QuestionController::class, 'allQuestions']);
    Route::get('/add-question', [QuestionController::class, 'addQuestion']);
    Route::post('add-question-post', [QuestionController::class, 'addQuestionPost']);
    Route::get('/edit-question/{question_id}', [QuestionController::class, 'editQuestion']);
    Route::post('edit-question-post', [QuestionController::class, 'editQuestionPost']);
    Route::delete('/delete-question/{question_id}', [QuestionController::class, 'deleteQuestion']);

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
    
    // attendance based on date and monthly
    Route::post('/get-attendance-by-date', [AccountController::class, 'getAttendanceByDate']);
    Route::get('/calender', [AccountController::class, 'calender']);
    
    Route::get('/company-profile', [EmployeeController::class, 'CompanyProfileView']);
    Route::get('/employee/notification', [NotificationController::class, 'realTimeNotificationByCurrentUser']);
    Route::post('/change-password', [AccountController::class, 'editProfile'])->name('em-edit-profile');

    // update my profile
    Route::post('joining-form-submit', [OnboardProcessController::class, 'joinigFormSubmit']);

    // ticket
    Route::get('/ticketViewByEmployee', [TicketController::class, 'ticketViewByEmployee']);
    Route::post('/addTicket', [TicketController::class, 'addTicket']);
    Route::get('/ticket-system/{tab}', [TicketController::class, 'ticketViewByITteam']);
     Route::get('/ticket/detail/{id}', [TicketController::class ,'detail']);

    // salary slip
    Route::get('/salary-slip', [AccountController::class, 'salaryslip']);
    Route::post('/insert-salary-slip', [AccountController::class, 'insertsalaryslip']);

    // Event notification 
    // Route::get('/birthday', [EventController::class ,'birthdayMail'])->name('birthdayMail');

    // AttendanceLogController
    // Route::post('/clock-in', [AttendanceLogController::class, 'clockIn']);
    Route::post('/clockIn', [AuthController::class, 'clockIn']);
    Route::post('/clockOut', [AuthController::class, 'clockOut']);
    Route::get('/clockApi', [AuthController::class, 'clockApi']);


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
        Route::get('/delete-employee/{user_id}', [UserController::class, 'deleteEmployee']);

        
        // helpdesk search
        Route::get('/helpdesk-search', [SettingController::class, 'helpdesk_search'])->name('em-helpdesk-search');
    });

    //  Employee-only routes (for future)
    Route::middleware('role:2')->group(function () {
        // Add employee-specific routes if needed

    });

    // IT support
    Route::middleware('role:3')->group(function () {
        Route::get('/helpdesk-search', [SettingController::class, 'helpdesk_search'])->name('em-helpdesk-search');
    });

    Route::get('start-onboarding/{candidate_id}', [OnboardProcessController::class, 'startOnboarding'])->name('startOnboarding');
    Route::get('all-candidates', [OnboardProcessController::class, 'onboardCandidates'])->name('onboardCandidates');

});

Route::middleware('auth:api')->prefix('tracker')->group(function () {
    Route::get('/add-candidate', [TrackerController::class, 'addCandidate'])->name('trackercandidateadd');
    Route::post('/add-candidate-post', [TrackerController::class, 'addCandidatePost'])->name('trackercandidateaddpost');
    Route::get('/editCandidates/{candidate_id}', [TrackerController::class, 'editCandidates']);
    Route::get('edit-candidate/{candidate_id}', 'UserController@editCandidate')->name('candidateedit');
    Route::get('delete-candidate/{candidate_id}', 'UserController@deleteCandidate')->name('candidatedelete');
    Route::get('generate-test/{candidate_id}', 'UserController@generateTest')->name('generateTest');
    Route::get('/ticketViewByEmployee', [TicketController::class, 'ticketViewByEmployee']);
    Route::post('/addTicket', [TicketController::class, 'addTicket']);
    Route::get('/ticket-system/{tab}', [TicketController::class, 'ticketViewByITteam']);
    Route::get('mail-to-hr', [TicketController::class, 'mailToHr']);
    
    // Route::get('/editCandidates/{candidate_id}', [TrackerController::class, 'editCandidates']);
   
});

Route::middleware([])->prefix('tracker')->group(function () {
    Route::get('/candidate/profile/{profile_id}/view', [UserController:: class, 'candidateProfileView']);
    Route::get('candidate/profile/{token}/edit', [UserController:: class, 'candidateProfile']);
});
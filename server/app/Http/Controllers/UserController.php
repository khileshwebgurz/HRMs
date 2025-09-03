<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidates;
use App\Models\User;
use App\Models\Employees;
use App\Models\CandidateAssessments;
use App\Models\CandidateAssessmentSections;
use App\Models\CandidateEducations;
use App\Models\CandidateEmployments;
use App\Models\CandidateFamilies;
use App\Models\CandidateLanguages;
use App\Models\CandidateOtherInformations;
use App\Models\CandidateQuestions;
use App\Models\CandidateSkills;
use App\Models\CandidateStatus;
use App\Models\CandidateTest;
use App\Models\CandidateTestOptions;
use App\Models\ObCandidates;
use Yajra\DataTables\Facades\DataTables;
//use Validator;
use Illuminate\Support\Facades\Validator;
use App\Models\ObTabFieldRelations;
use App\Models\Country;
use App\Models\State;
use App\Models\EmployeeExit;
use App\Models\City;
use Illuminate\Support\Facades\Auth;
//use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UserCsvExport;
use App\Exports\CandidateCsvExport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\Questions;
use App\Models\Notifications;
use App\Models\ReadinessAnswer;
use App\Models\CandidateInterviews;
use App\Models\CandidateInterviewRounds;
use App\Settings;
use App\Models\LeaveRules;
use App\Models\AttendanceRules;
use App\Models\EmployeeLeaveRules;
use App\Models\Roles;
use App\Models\ObTabFieldData;
use App\Models\ObTabFieldOptions;
use App\Models\InventoryRooms;
use App\Models\OnboardRequests;
use App\Models\Employee_manager_team;
use Spatie\GoogleCalendar\Event;
use App\Imports\EmployeesImport;
use App\Exports\ExportEmployees;
use Illuminate\Support\Facades\Input;
use App\Imports\MailPasswordImport;
use Carbon\Carbon;
//use Session;
use Illuminate\Support\Facades\Session;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use App\Mail\EmployeeInviteMail;
use App\Models\Permissions;

use Illuminate\Support\Facades\DB;
use App\Models\CandidateSkill;
use App\Models\CandidateEducation;
use App\Models\CandidateEmployment;
use App\Models\CandidateLanguage;
use App\Models\CandidateOtherInformation;
use App\Models\CandidateFamily;
use App\Mail\TestResultMail;
use App\Mail\TestCompletedMail;
use Google\Service\CivicInfo\Candidate;

class UserController extends Controller
{

    public $questionLimit = 5;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
        $this->questionLimit = get_options('aptitude_question_limit');
    }

    /**
     * Save IDE images in temp folder.
     */
    public function saveIDEImage(Request $request)
    {
        if ($file = $request->file('file')) {
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/ide/', $name)) {
                return asset('uploads/ide/') . '/' . $name;
            }
        }
        return "";
    }

    /**
     * Show add user page.
     */
    public function addUser()
    {

        // create a new event
        /*
         * $event = new Event();
         * $event->name = 'Sukhpal Test Event ' . rand(1, 999);
         * $event->description = ' You interview has been schedule.';
         * $event->startDateTime = \Carbon\Carbon::now()->addDay(1);
         * $event->endDateTime = \Carbon\Carbon::now()->addDay(5)->addHour();
         *
         * $event->location = 'testguruz Technologies (P) Ltd. IT C-2 Dibon Building - 4th Floor, Sector 67, Sahibzada Ajit Singh Nagar, Punjab 160062 ';
         *
         * $optParams['sendUpdates'] = 'all';
         * $optParams['sendNotifications'] = true;
         *
         * $event->addAttendee([
         * 'email' => 'internalwgz@gmail.com',
         * ]);
         *
         * $event->save(null,$optParams);
         * echo '<pre>';
         * print_r($event);
         * exit;
         */
        $loginuser = Auth::user();

        if (!in_array('all_users', Session::get('permission')[0])) {
            abort(404);
        }


        $user_roles = User::$role;
        $genders = User::$gender;
        $roles = Roles::get();

        return view('users.adduser', compact('user_roles', 'genders', 'roles'));
    }

    /**
     * Save new user.
     */
    public function addUserPost(Request $request)
    {
        // $loginuser = Auth::user();
        $user = new User();
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'email' => 'unique:users,email|required|regex:/(.+)@(.+)\.(.+)/i',
                'phone' => 'required|digits:10|numeric',
                'password' => 'min:6|confirmed|required',
                'user_role' => 'required'
            ],
            [
                'name.required' => 'Please fill the name',
                'email.required' => 'Please fill the email',
                'email.regex' => 'Email should be in proper format',
                'phone.required' => 'Please fill mobile number',
                'phone.digits' => 'Please enter 10 digits',
                'user_role.required' => 'Please select the role'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }


        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->phone = $request->phone;
        $user->gender = $request->gender;
        $user->user_role = $request->user_role;
        $user->created_by = $created_by;
        if ($user->save()) {

            $to_name = $user->full_name;
            $to_email = $user->email;
            $data = array(
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password
            );
            Mail::send('emails.register', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('Welcome to HRM');
            });

            if (! Mail::failures()) {
                return response()->json([
                    'status' => 200,
                    'message' => "User successfully added."
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    /**
     * Show edit user page.
     *
     * @params user_id
     */
    public function editUser($user_id)
    {
        $user_roles = User::$role;
        $genders = User::$gender;
        $loginuser = Auth::user();
        $user = User::where('id', $user_id)->first();
        $roles = Roles::get();
        if (!in_array('all_users', Session::get('permission')[0])) {
            abort(404);
        }

        return view('users.edituser', compact('user', 'loginuser', 'user_roles', 'genders', 'roles'));
    }

    /**
     * Update user.
     */
    public function editUserPost(Request $request)
    {
        $loginuser = Auth::user();
        $user_id = $request->user_id;
        $user = User::where('id', $user_id)->first();
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'email' => 'unique:users,email,' . $user_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i'
            ],
            [
                'name.required' => 'Please fill the name',
                'email.required' => 'Please fill the email'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $validator = Validator::make($request->all(), [
                'password' => 'min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
            $user->password = bcrypt($request->password);
        }

        if ($request->phone) {
            $validator = Validator::make($request->all(), [
                'phone' => 'digits:10|numeric'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
            $user->phone = $request->phone;
        } else {
            $user->phone = null;
        }

        $user->gender = $request->gender;
        $user->user_role = $request->user_role;


        /*
         * if ($request->hasFile('profileImg')) {
         * $this->validate($request, [
         * 'profileImg' => 'mimes:png'
         * ]);
         * $profileName = $user->id . '_avatar' . time() . '.' . request()->profile->getClientOriginalExtension();
         * $request->profile->storeAs('avatars', $profileName);
         * $user->profile = $profileName;
         * }
         */

        if ($user->save()) {
            return response()->json([
                'status' => 200,
                'message' => ($user_id == $loginuser->id) ? "Profile updated" : "User updated",
                'redirect' => ($user_id == $loginuser->id) ? false : true
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    /**
     * get all users .
     */
    public function allUsers(Request $request)
    {
        $loginuser = Auth::user();
        if (!in_array('all_users', Session::get('permission')[0])) {
            abort(404);
        }
        $user_roles = Roles::get();
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $data = User::where('created_by', Auth::user()->id)->orderBy('created_at', 'desc')->get();
        } elseif ($permission_role->view == '3') {

            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $data = User::whereIn('created_by', $employees)->orderBy('created_at', 'desc')->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $data = User::whereIn('created_by', $employees)->orderBy('created_at', 'desc')->get();
        } elseif ($permission_role->view == '5') {
            $data = User::get();
        }

        if ($request->ajax()) {

            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('gender', function (User $user) {
                    return User::$gender[$user->gender];
                })
                ->editcolumn('user_role', function ($row) {
                    $role = $row->roles->role_name;
                    return $role;
                })
                ->addColumn('action', function ($row) {
                    $loginuser = Auth::user();

                    $btn = '<div class="btn-group btn-group-sm">';
                    $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editUser', $row->id) . '">
                         <figure>
                           <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                         </figure>
                      </a> ';
                    if ($row->id != $loginuser->id) {
                        $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteUser', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this user?\')">
                         <figure>
                           <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor">
                           <img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                         </figure>
                    </a>';
                    }
                    $btn .= '</div>';
                    return $btn;
                })
                ->rawColumns([
                    'action'
                ])
                ->make(true);
        }
        return view('users.listuser', compact('user_roles'));
    }




    public function addEmployee()
    {
        $user = Auth::user();
        $role = Roles::find($user->user_role);

        $assign = [];
        if ($role && $role->add != '2') {
            if ($role->add == '4') {
                $assign = Employees::where('manager_id', $user->id)
                    ->orWhere('id', $user->id)
                    ->get();
            } elseif ($role->add == '5') {
                $all_roles = Roles::where('id', '!=', '2')->pluck('id')->toArray();
                $assign = Employees::whereIn('user_role', $all_roles)->get();
            } else {
                $assign = Employees::where('manager_id', $user->id)->get();
            }
        }

        return response()->json([
            'status' => true,
            'assignable_employees' => $assign,
            'can_assign' => $role && $role->add != '2'
        ]);
    }

    public function addEmployeePost(Request $request)
    {

        Log::info('My editing employee is >>>>', ['user' => $request]);
        $validator = Validator::make($request->all(), [
            'name'           => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email'          => 'required|unique:employees,email|regex:/(.+)@(.+)\.(.+)/i',
            'on_candidate_id' => 'nullable|integer',
            'created_by'     => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 401,
                'message' => $validator->errors()->first(),
            ]);
        }

        $authUser        = Auth::user();
        $permission_role = Roles::find($authUser->user_role);

        // If this role cannot choose assignee, force to current user
        $created_by = ($permission_role && $permission_role->add == '2')
            ? $authUser->id
            : $request->created_by;

        if (!$created_by) {
            return response()->json([
                'status'  => 401,
                'message' => 'Please select to whom you would assign to',
            ]);
        }

        // Create employee
        $employee = new Employees();
        $employee->name       = $request->name;
        $employee->email      = $request->email;
        $employee->password   = bcrypt('#testguruz#'); // temp placeholder
        $employee->token      = Str::random(32);
        $employee->created_by = $created_by;

        if (!$employee->save()) {
            return response()->json([
                'status'  => 401,
                'message' => 'Something went wrong. Try again.',
            ]);
        }

        // Candidate linking (only if provided)
        if ($request->filled('on_candidate_id')) {
            $ObCandidates = ObCandidates::firstOrNew(['id' => $request->on_candidate_id]);
        } else {
            $ObCandidates = new ObCandidates();
        }
        $ObCandidates->name               = $request->name;
        $ObCandidates->email              = $request->email;
        $ObCandidates->office_employee_id = $employee->id;
        $ObCandidates->created_by         = $created_by;
        $ObCandidates->save();

        // Build frontend invite URLs
        $frontendBase = rtrim(config('app.frontend_url', env('FRONTEND_URL', config('app.url'))), '/');
        $acceptUrl    = $frontendBase . '/set-password/accept/'   . $employee->token;
        $declineUrl   = $frontendBase . '/set-password/declined/' . $employee->token;

        // Send email
        try {
            Mail::to($employee->email)->send(new EmployeeInviteMail(
                $employee->name,
                $acceptUrl,
                $declineUrl
            ));
        } catch (\Throwable $e) {
            return response()->json([
                'status'       => 500,
                'message'      => 'Employee added but email failed to send.',
                'token'        => $employee->token,
                'accept_url'   => $acceptUrl,
                'decline_url'  => $declineUrl,
                'mail_error'   => $e->getMessage(),
            ]);
        }

        return response()->json([
            'status'      => 200,
            'message'     => 'Employee added successfully. Invitation email sent.',
            'token'       => $employee->token,
            'accept_url'  => $acceptUrl,
            'decline_url' => $declineUrl,
        ]);
    }

    public function validateEmployeeToken($type, $token)
    {
        $employee = Employees::where('token', $token)->first();

        if (!$employee) {
            return response()->json(['status' => 404, 'message' => 'Invalid or expired token']);
        }

        if ($type === 'accept') {
            return response()->json([
                'status' => 200,
                'data'   => [
                    'id'    => $employee->id,
                    'name'  => $employee->name,
                    'email' => $employee->email,
                ],
            ]);
        }

        if ($type === 'declined') {
            $employee->delete(); // hard delete; change to status if needed
            return response()->json(['status' => 200, 'message' => 'Invitation declined and account deleted.']);
        }

        return response()->json(['status' => 400, 'message' => 'Invalid type']);
    }


    public function setPasswordEmployeePost(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        $user = Employees::where('token', $token)->first();

        if (!$user) {
            return response()->json(['status' => 404, 'message' => 'Invalid token']);
        }

        $user->password         = bcrypt($request->password);
        $user->token            = null;    // invalidate token
        // $user->readiness_status = true;    // mark activated (add column if needed)

        if ($user->save()) {
            return response()->json(['status' => 200, 'message' => 'Password set successfully. You can now log in.']);
        }

        return response()->json(['status' => 500, 'message' => 'Failed to set password']);
    }


    public function addEmployeePostNEw(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|unique:employees,email|regex:/(.+)@(.+)\.(.+)/i'
        ], [
            'name.required' => 'Please fill the name',
            'email.required' => 'Please fill the email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }

        $user = new Employees();

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt('#testguruz#');
        $user->token = Str::random(32);
        $user->created_by = $created_by;

        if ($user->save()) {
            $ObCandidates = null;

            if (!empty($request->on_candidate_id)) {
                $ObCandidates = ObCandidates::find($request->on_candidate_id);
            }

            if (!$ObCandidates) {
                $ObCandidates = new ObCandidates();
            }


            $ObCandidates->name = $request->name;
            $ObCandidates->email = $request->email;
            $ObCandidates->office_employee_id = $user->id;
            $ObCandidates->created_by = $created_by;
            $ObCandidates->save();

            // Send Email
            // $to_name = $user->name;
            // $to_email = $user->email;
            // $data = [
            //     'name' => $request->name,
            //     'invite_link_accept' => route('setPasswordEmployee', ['accept', $user->token]),
            //     'invite_link_declined' => route('setPasswordEmployee', ['declined', $user->token])
            // ];

            // Mail::send('emails.employee-invite', $data, function ($message) use ($to_name, $to_email) {
            //     $message->to($to_email, $to_name)->subject('Welcome to HRM');
            // });

            // if (!Mail::failures()) {
            //     return response()->json([
            //         'status' => 200,
            //         'message' => 'Employee added successfully'
            //     ]);
            // } else {
            //     return response()->json([
            //         'status' => 401,
            //         'message' => 'Something went wrong while sending email.'
            //     ]);
            // }
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something went wrong. Try again.'
        ]);
    }


    public function editEmployeeold($user_id)
    {
        $user_roles = User::$role;
        $genders = User::$gender;
        $loginuser = Auth::user();
        $rooms = InventoryRooms::where('is_deleted', '0')->get();
        $user = Employees::where('id', $user_id)->first();
        $rules = AttendanceRules::get();
        $leaverules = LeaveRules::where('for_all', '!=', '1')->get();
        $obcandidates = ObCandidates::where('office_employee_id', $user_id)->first();
        $employees = Employees::where('id', $user_id)->first();
        if ($obcandidates) {
            $attendance_rule = AttendanceRules::where('id', $obcandidates->attendance_rule_id)->first();
        }

        $employeeleave = EmployeeLeaveRules::where('employee_id', $user_id)->pluck('leave_rule_id')->toArray();
        // $user_role = Auth::user()->user_role;
        //  $role = Roles::where('id', $user_role)->where('id','!=', '1')->first();
        //  if($role)
        //  {
        //      $myArray = explode(',', $role->permissions);
        //      if(!in_array('manage_employees', $myArray)){
        //          abort(404);
        //      }
        //  }

        $team_name = Employee_manager_team::all();
        return response()->json([
            'status' => 200,
            'data' => [
                'user' => $user,
                'loginuser' => $loginuser,
                'user_roles' => $user_roles,
                'genders' => $genders,
                'rules' => $rules,
                'leaverules' => $leaverules,
                'employeeleave' => $employeeleave,
                'obcandidates' => $obcandidates,
                'attendance_rule' => $attendance_rule,
                'rooms' => $rooms,
                'employees' => $employees,
                'team_name' => $team_name,
            ]
        ]);
    }

    public function editEmployee($user_id)
    {
        $loginuser = Auth::user();
        $rooms = InventoryRooms::where('is_deleted', '0')->get();
        $user = Employees::where('id', $user_id)->first();
        $rules = AttendanceRules::get();
        $leaverules = LeaveRules::where('for_all', '!=', '1')->get();
        $obcandidates = ObCandidates::where('office_employee_id', $user_id)->first();
        $employees = Employees::where('id', $user_id)->first();

        if ($obcandidates) {
            $attendance_rule = AttendanceRules::where('id', $obcandidates->attendance_rule_id)->first();
        }

        $employeeleave = EmployeeLeaveRules::where('employee_id', $user_id)->pluck('leave_rule_id')->toArray();

        $team_name = Employee_manager_team::all();

        // ✅ fetch roles dynamically from roles table
        $roles = Roles::select('id', 'role_name')->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'user' => $user,
                'loginuser' => $loginuser,
                'roles' => $roles,   // <-- send roles dynamically
                'genders' => User::$gender,
                'rules' => $rules,
                'leaverules' => $leaverules,
                'employeeleave' => $employeeleave,
                'obcandidates' => $obcandidates,
                'attendance_rule' => $attendance_rule ?? null,
                'rooms' => $rooms,
                'employees' => $employees,
                'team_name' => $team_name,
            ]
        ]);
    }

    /**
     * Show edit employee page.
     *
     * @params user_id
     */
    public function viewEmployee($user_id, $tab)
    {
        $user_roles = User::$role;
        $genders = User::$gender;
        $loginuser = Auth::user();
        $user = Employees::where('id', $user_id)->first();

        $employee_id = $user_id;

        $candidate_questions = CandidateQuestions::all();
        $candidate = $candidate_info = ObCandidates::where('office_employee_id', $user->id)->first();
        $candidate_id = $candidate->candidate_id;
        $candidateData = Candidates::where('id', $candidate_id)->first();

        $progress = getEmployeeProgress($candidate->id);
        $candidate_id = $candidate->id;

        if ($tab == 'personal') {
            return view('users.employees.view.personal', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData', 'candidate_questions', 'candidate_info', 'candidate_id'));
        } else if ($tab == 'official') {
            return view('users.employees.view.official', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData', 'candidate_questions', 'candidate_info', 'candidate_id'));
        } else if ($tab == 'appraisal') {
            return view('users.employees.view.appraisal', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData', 'candidate_info', 'candidate_questions', 'candidate_id'));
        }

        abort(404);
    }


    public function editEmployeePost(Request $request)
    {
        $loginuser = Auth::user();
        $user_id = $request->user_id;
        $all_employees = Employees::get();
        $user = Employees::where('id', $user_id)->first();

        Log::info('My editing employee is >>>>', ['user' => $user]);

        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'email' => 'unique:employees,email,' . $user_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i',
                'is_manager' => 'required|in:1, 0',
                'role_id' => 'required|in:1, 2, 3'
            ],
            [
                'name.required' => 'Please fill the name',
                'email.required' => 'Please fill the email'

            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $validator = Validator::make($request->all(), [
                'password' => 'min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
            $user->password = bcrypt($request->password);
        }

        if ($request->phone) {
            $validator = Validator::make($request->all(), [
                'phone' => 'digits:10|numeric'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
            $user->phone = $request->phone;
        }
        $user->gender = $request->gender;
        // $user->user_role = $request->user_role;
        $obcandidates = ObCandidates::where('office_employee_id', $request->user_id)->first();
        if ($obcandidates) {
            $obcandidates->attendance_rule_id = $request->attendance_rule_id;
            $obcandidates->is_crm = $request->crm;
            $obcandidates->is_interviewer = $request->Interviewer;

            $obcandidates->save();
        }


        $aa = $request->leave_rule_id;
        $employee = EmployeeLeaveRules::where('employee_id', $request->user_id)->pluck('leave_rule_id')->toArray();
        if ($aa) {
            $result = array_intersect($aa, $employee);
            $arrdiff = array_diff($employee, $result);


            foreach ($arrdiff as $diff) {
                $delruleid = EmployeeLeaveRules::where('employee_id', $request->user_id)->where('leave_rule_id', $diff)->delete();
            }
            foreach ($aa as $aa) {
                $employeeleave  = EmployeeLeaveRules::where('employee_id', $request->user_id)->where('leave_rule_id', $aa)->first();
                if (!$employeeleave) {
                    $employeeleave = new EmployeeLeaveRules();
                    $employeeleave->leave_rule_id = $aa;
                    $employeeleave->employee_id = $request->user_id;
                    $employeeleave->save();
                }
            }
        }

        $user->room_id = $request->room_name;
        $user->is_manager = $request->is_manager;
        // $user->role_id = $request->role_id;
        $user->user_role = $request->role_id; 
        $user->manager_id = $request->manager_id;
        $user->team_id = $request->team_id;

        if ($user->save()) {

            $obcandidates->name = $request->name;
            $obcandidates->email = $request->email;
            $obcandidates->phone = $request->phone;
            $obcandidates->save();
            return response()->json([
                'status' => 200,
                'message' => "Employee profile updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    /**
     * get all employees
     */


    public function allEmployees(Request $request)
    {
        $user = Auth::user();
        $role = Roles::find($user->user_role);


        Log::info('My request is  >>>>', ['skill_name' => $request->query('search')]);
        if (!$role || $role->view == '1') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = match ($role->view) {
            '2' => Employees::where('created_by', $user->id),
            '3' => Employees::whereIn('created_by', Employees::where('manager_id', $user->id)->pluck('id')),
            '4' => Employees::whereIn('created_by', Employees::where('manager_id', $user->id)->orWhere('id', $user->id)->pluck('id')),
            '5' => Employees::query(),
            default => null,
        };

        if (!$query) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $searchTerm = $request->query('search');
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // ✅ Check if all data is requested (e.g. for dropdown)
        if ($request->query('all') === 'true') {
            $employees = $query->orderBy('name')->get()->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                ];
            });

            return response()->json(['data' => $employees]);
        }

        // Get pagination values from query string
        $perPage = $request->query('limit', 10);
        $page = $request->query('page', 1);

        $paginated = $query->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        // $employees = $query->orderBy('name')->get();

        // Enrich data
        $data = $paginated->getCollection()->map(function ($employee) use ($user) {
            $employee->manager_name = optional(Employees::find($employee->manager_id))->name ?? '-';
            $employee->gender_text = $employee->gender === '1' ? 'Male' : 'Female';
            $employee->progress = $this->calculateProgress($employee);

            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'gender' => $employee->gender_text,
                'manager' => $employee->manager_name,
                'status' => $employee->status ? 'Active' : 'Inactive',
                'progress' => $employee->progress,
                'created_by' => $employee->created_by,
            ];
        });

        return response()->json([
            'data' => $data,
            'total' => $paginated->total(),
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
        ]);
    }

    private function calculateProgress($employee)
    {
        $candidate = ObCandidates::where('office_employee_id', $employee->id)->first();
        if (!$candidate) return 0;

        $progress = 0;
        $weights = [1 => 40, 2 => 20, 3 => 10, 4 => 10, 5 => 15];

        foreach ($weights as $tab => $weight) {
            $fieldIds = ObTabFieldRelations::where('tab_id', $tab)->pluck('field_id');
            $optionIds = ObTabFieldOptions::whereNotIn('type', [3, 6])->whereIn('field_id', $fieldIds)->pluck('id');
            $filled = ObTabFieldData::where('ob_candidate_id', $candidate->id)
                ->whereNotNull('value')
                ->where('value', '!=', '')
                ->where('value', '!=', '[]')
                ->whereIn('field_id', $optionIds)
                ->pluck('field_id');

            if ($fieldIds->diff($filled)->isEmpty()) {
                $progress += $weight;
            }
        }

        if ($progress == 95) {
            OnboardRequests::firstOrCreate(
                ['candidate_name' => $employee->name],
                [
                    'updated_by' => Auth::user()->name,
                    'link' => url('hrm/onboarding/candidate/' . $candidate->id),
                ]
            );
        }

        return $progress;
    }

    /**
     * employee accept/declined the account creation.
     * If employee Accept then show the password set screen where employee can set the password else showing the declined message and
     * remove the user from account.
     *
     * @params type(accept/declined)
     */
    public function setPasswordEmployee($type, $token)
    {
        $emp = Employees::where('token', $token)->first();
        if ($emp) {
            if ($type == 'accept') {
                return view('front.employee.accept', compact('emp'));
            } else {
                // $emp->delete();
                return view('front.employee.declined');
            }
        } else {
            abort(404);
        }
    }

    /**
     * Employee password set
     *
     * @params user_id
     */


    /**
     * Delete user.
     *
     * @params user_id
     */
    public function deleteUser($user_id)
    {
        $loginuser = Auth::user();

        if (!in_array('all_users', Session::get('permission')[0])) {
            abort(404);
        }

        $user = User::findOrFail($user_id);
        $delete = $user->delete();
        if ($delete) {
            return redirect()->route('allusers')->with('success', 'User deleted.');
        } else {
            return redirect()->route('allusers')->with('error', 'Something wrong. Try again.');
        }
    }

    /**
     * Show Apptitude Test for candidate.
     *
     */


    public function deleteEmployee($user_id)
    {
        $loginuser = Auth::user();

        $employee = Employees::findOrFail($user_id);
        $obcandidates = ObCandidates::where('office_employee_id', '=', $user_id)->firstOrFail();
        $delete = $employee->delete();
        $delete_2 = $obcandidates->delete();
        // if ($delete) {
        //     $delete_2 = $obcandidates->delete();
        //     return redirect('users/all-employees')->with('success', 'Employee deleted.');
        // } else {
        //     return redirect()->route('allusers')->with('error', 'Something wrong. Try again.');
        // }
    }


    // 5-aug-25
    public function showTest($test_id)
    {
        $can_test = CandidateTest::with(['questions.question', 'questions.options', 'candidate'])
            ->where('token', $test_id)
            ->first();

        Log::info('testtt', ['can_test' => $can_test]);

        if (!$can_test) {
            return response()->json(['error' => 'Test not found'], 404);
        }

        if ($can_test->status == '2') {
            return response()->json([
                'status' => 'expired',
                'message' => 'Link has been expired. Please contact support.'
            ]);
        }

        if ($can_test->status == '3') {
            return response()->json([
                'status' => 'completed',
                'test' => $can_test,
                'total_percentage' => ($can_test->result * 100) / count($can_test->questions)
            ]);
        }


        return response()->json([
            'status' => 'active',
            'test' => $can_test,
            'has_otp' => !empty($can_test->otp)
        ]);
    }

    public function checkTestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'test_token' => 'required',
            'otp' => 'required|digits:4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        $can_test = CandidateTest::where('token', $request->test_token)->first();

        if (!$can_test) {
            return response()->json([
                'success' => false,
                'message' => 'Test not found'
            ], 404);
        }

        if ($can_test->otp == $request->otp) {
            $can_test->otp = null;
            $can_test->save();

            return response()->json([
                'success' => true,
                'message' => 'OTP verified successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid OTP. Please try again.'
        ], 401);
    }

    public function saveTestResultOLd(Request $request)
    {
        Log::info('test', ['testtw' => $request]);

        $validator = Validator::make($request->all(), [
            'test_token' => 'required',
            'pending_time' => 'required|regex:/^\d{2}:\d{2}$/',
            'question_page' => 'required|integer|min:0',
            'finalsave' => 'required|boolean',
            'ans' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $can_test = CandidateTest::with(['questions', 'candidate'])
            ->where('token', $request->test_token)
            ->first();

        if (!$can_test) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test not found'
            ], 404);
        }

        // If test already completed, don't allow changes or resend emails
        if ($can_test->status == 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test has already been submitted.'
            ], 400);
        }

        // Update time and page if provided
        if ($request->has('pending_time')) {
            $can_test->pending_time = $request->pending_time;
        }

        if ($request->has('question_page')) {
            $can_test->question_page = $request->question_page;
        }

        // Save answers if provided
        if ($request->has('ans')) {
            foreach ($request->ans as $qid => $answer) {
                $question = $can_test->questions->firstWhere('id', $qid);
                if ($question) {
                    $question->candidate_answer = $answer;
                    $question->save();
                }
            }
        }

        // Handle final submission
        if ($request->finalsave) {

            $can_test->status = 3;

            // Calculate result
            $correctAnswers = $can_test->questions->filter(function ($question) {
                return $question->candidate_answer == $question->correct_answer;
            })->count();

            $can_test->result = $correctAnswers;
            $can_test->save();

            $totalPercentage = ($correctAnswers / $can_test->questions->count()) * 100;

            // Send emails only once on final submission
            $this->sendCompletionEmails($can_test, $totalPercentage);

            // Update candidate status
            $candidate = $can_test->candidate;
            $candidateStatus = $totalPercentage  >= 10 ? 3 : 8; // 3=Passed, 8=Failed
            $candidate->status = $candidateStatus;
            $candidate->save();

            // Create notification
            $this->createNotification($can_test);

            // Create interview records
            $this->createInterviewRecords($can_test, $totalPercentage);

            return response()->json([
                'status' => 'completed',
                'message' => $totalPercentage  >= 10
                    ? 'Congratulations, you are shortlisted for next round.'
                    : 'Better luck next time. Please connect with HR.',
                'result' => [
                    'score' => $correctAnswers,
                    'total' => $can_test->questions->count(),
                    'percentage' => $totalPercentage
                ]
            ]);
        }

        // Save progress for non-final submission
        $can_test->save();

        return response()->json([
            'status' => 'progress_saved',
            'message' => 'Progress saved successfully'
        ]);
    }

    public function saveTestResult(Request $request)
    {
        Log::info('test', ['testtw' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'test_token' => 'required',
            'pending_time' => 'required|regex:/^\d{2}:\d{2}$/',
            'question_page' => 'required|integer|min:0',
            'finalsave' => 'required|boolean',
            'ans' => 'sometimes|array',
            'auto_save' => 'sometimes|boolean'  // Add auto_save to validation
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $can_test = CandidateTest::with(['questions', 'candidate'])
            ->where('token', $request->test_token)
            ->first();

        if (!$can_test) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test not found'
            ], 404);
        }

        // If test already completed, don't allow changes or resend emails
        if ($can_test->status == 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Test has already been submitted.'
            ], 400);
        }

        // Handle auto-save separately for better performance and logging
        if (!$request->finalsave && $request->has('auto_save') && $request->auto_save) {
            // Update time and page for auto-save
            if ($request->has('pending_time')) {
                $can_test->pending_time = $request->pending_time;
            }

            if ($request->has('question_page')) {
                $can_test->question_page = $request->question_page;
            }

            // Save answers if provided
            if ($request->has('ans')) {
                foreach ($request->ans as $question_id => $answer_id) {
                    // Find the candidate test option record by question_id, not the question record itself
                    $testOption = CandidateTestOptions::where('candidate_test_id', $can_test->id)
                        ->where('question_id', $question_id)
                        ->first();

                    if ($testOption) {
                        $testOption->candidate_answer = $answer_id;
                        $testOption->save();
                    }
                }
            }

            $can_test->save();

            Log::info('Auto-save completed', [
                'test_id' => $can_test->id,
                'candidate_id' => $can_test->candidate_id,
                'pending_time' => $request->pending_time,
                'question_page' => $request->question_page
            ]);

            return response()->json([
                'status' => 'auto_saved',
                'message' => 'Progress auto-saved successfully'
            ]);
        }

        // Update time and page if provided (for manual saves)
        if ($request->has('pending_time')) {
            $can_test->pending_time = $request->pending_time;
        }

        if ($request->has('question_page')) {
            $can_test->question_page = $request->question_page;
        }

        // Save answers if provided (for manual saves)
        if ($request->has('ans')) {
            foreach ($request->ans as $question_id => $answer_id) {
                // Find the candidate test option record by question_id
                $testOption = CandidateTestOptions::where('candidate_test_id', $can_test->id)
                    ->where('question_id', $question_id)
                    ->first();

                if ($testOption) {
                    $testOption->candidate_answer = $answer_id;
                    $testOption->save();
                }
            }
        }

        // Handle final submission
        if ($request->finalsave) {
            // Double-check test status before final submission
            $can_test->refresh(); // Refresh from database to get latest status

            if ($can_test->status == 3) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Test has already been submitted.'
                ], 400);
            }

            $can_test->status = 3;

            // Calculate result - count correct answers from CandidateTestOptions
            $correctAnswers = CandidateTestOptions::where('candidate_test_id', $can_test->id)
                ->whereColumn('candidate_answer', 'correct_answer')
                ->count();

            $totalQuestions = CandidateTestOptions::where('candidate_test_id', $can_test->id)->count();

            $can_test->result = $correctAnswers;
            $can_test->save();

            $totalPercentage = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0;

            // Send emails only once on final submission
            try {
                $this->sendCompletionEmails($can_test, $totalPercentage);
            } catch (\Exception $e) {
                Log::error('Failed to send completion emails', [
                    'test_id' => $can_test->id,
                    'error' => $e->getMessage()
                ]);
            }

            // Update candidate status
            $candidate = $can_test->candidate;
            $candidateStatus = $totalPercentage  >= 10 ? 3 : 8; // 3=Passed, 8=Failed
            $candidate->status = $candidateStatus;
            $candidate->save();

            // Create notification
            try {
                $this->createNotification($can_test);
            } catch (\Exception $e) {
                Log::error('Failed to create notification', [
                    'test_id' => $can_test->id,
                    'error' => $e->getMessage()
                ]);
            }

            // Create interview records
            try {
                $this->createInterviewRecords($can_test, $totalPercentage);
            } catch (\Exception $e) {
                Log::error('Failed to create interview records', [
                    'test_id' => $can_test->id,
                    'error' => $e->getMessage()
                ]);
            }

            Log::info('Test completed successfully', [
                'test_id' => $can_test->id,
                'candidate_id' => $can_test->candidate_id,
                'score' => $correctAnswers,
                'percentage' => $totalPercentage
            ]);

            return response()->json([
                'status' => 'completed',
                'message' => $totalPercentage  >= 10
                    ? 'Congratulations, you are shortlisted for next round.'
                    : 'Better luck next time. Please connect with HR.',
                'result' => [
                    'score' => $correctAnswers,
                    'total' => $totalQuestions,
                    'percentage' => round($totalPercentage, 2)
                ]
            ]);
        }

        // Save progress for non-final submission (manual save)
        $can_test->save();

        Log::info('Manual progress saved', [
            'test_id' => $can_test->id,
            'candidate_id' => $can_test->candidate_id,
            'pending_time' => $request->pending_time,
            'question_page' => $request->question_page
        ]);

        return response()->json([
            'status' => 'progress_saved',
            'message' => 'Progress saved successfully'
        ]);
    }


    protected function sendCompletionEmails($can_test, $percentage)
    {
        // Email to HR
        Mail::send('emails.completed-aptitude-test', [
            'candidate_name' => $can_test->candidate->full_name,
            'position' => $can_test->candidate->position,
            'score' => $can_test->result,
            'total' => $can_test->questions->count(),
            'percentage' => $percentage
        ], function ($message) use ($can_test) {
            $message->to('hr-sandeep@yopmail.com')
                ->subject($can_test->candidate->full_name . ' Completed Aptitude Test Round 1 - ' . $can_test->candidate->position);
        });

        // Email to candidate
        $statusMessage = $percentage  >= 10
            ? 'Congratulations, you are shortlisted for next round.'
            : 'Better luck next time. Please connect with HR.';

        Mail::send('emails.send-test-result', [
            'name' => $can_test->candidate->full_name,
            'msg' => $statusMessage,
            'status' => $percentage  >= 10 ? 1 : 2,
            'test_url' => route('showTest', $can_test->token)
        ], function ($message) use ($can_test) {
            $message->to($can_test->candidate->email)
                ->subject('Message from HRM');
        });
    }

    protected function createNotification($can_test)
    {
        Notifications::create([
            'type_id' => 'test_complete',
            'message' => $can_test->candidate->full_name . ' has been completed assigned aptitude test.',
            'page_id' => $can_test->id,
            'notify_type' => 1
        ]);
    }

    protected function createInterviewRecords($can_test, $percentage)
    {
        $interview = CandidateInterviews::create([
            'candidate_id' => $can_test->candidate_id
        ]);

        $interStatus = $percentage  >= 10 ? 2 : 3; // 2=Passed, 3=Failed
        $message = $percentage  >= 10
            ? 'Congratulations, you are shortlisted for next round.'
            : 'Better luck next time. Please connect HR';

        CandidateInterviewRounds::create([
            'interview_id' => $interview->id,
            'interview_time' => now(),
            'status' => $interStatus,
            'remarks' => $message,
            'score' => $can_test->result,
            'weight_age' => $percentage
        ]);
    }

    public function generateTest(Request $request, $candidate_id)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:1,2,3'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $candidate = Candidates::findOrFail($candidate_id);

        if ($request->type == 3) {
            return $this->skipTest($candidate);
        }

        return $this->createTest($candidate, $request->type);
    }


    public function viewGenerateTest($candidate_id)
            {
                $candidate = Candidates::findOrFail($candidate_id);

                return response()->json([
                    'status' => 'success',
                    'candidate' => $candidate
                ]);
            }


    protected function skipTest($candidate)
    {
        $interview = CandidateInterviews::create([
            'candidate_id' => $candidate->id
        ]);

        CandidateInterviewRounds::create([
            'interview_id' => $interview->id,
            'interview_time' => now(),
            'status' => 2,
            'remarks' => 'Skip Test',
            'score' => 0,
            'weight_age' => 0
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Candidate aptitude test skipped.'
        ]);
    }

    protected function createTest($candidate, $type)
    {

        Log::info('test', ['testtw' => $candidate . $type]);
        $existingTest = CandidateTest::where('candidate_id', $candidate->id)
            ->where('status', 1) // 1 = active
            ->first();

        if ($existingTest) {
            return response()->json([
                'status' => 'already_exists',
                'message' => 'A test is already assigned to this candidate.',
                'test_id' => $existingTest->id
            ]);
        }

        // ✅ If no existing test, create new one
        $can_test = CandidateTest::create([
            'candidate_id' => $candidate->id,
            'token' => Str::random(32),
            'status' => 1,
            'pending_time' => '00:00',
            'type' => $type,
            'otp' => $type == 1 ? rand(1000, 9999) : null


        ]);

        // Attach random questions
        $questions = Questions::where('status', '1')
            ->where('question_type', '1')
            ->inRandomOrder()
            ->limit(get_options('aptitude_question_limit'))
            ->get();

        foreach ($questions as $question) {
            CandidateTestOptions::create([
                'candidate_test_id' => $can_test->id,
                'question_id' => $question->id,
                'correct_answer' => $question->answer
            ]);
        }

        // Send email
        $this->sendTestInviteEmail($candidate, $can_test);

        // Create notification
        Notifications::create([
            'type_id' => 'aptitude_sent',
            'message' => 'Aptitude test sent to ' . $candidate->full_name . ' <a target="_blank" style="margin-left: 23px;" href=' . route('showTest', $can_test->token) . '>Click Here</a>',
            'page_id' => $can_test->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Test sent to candidate email address.',
            'test_id' => $can_test->id
        ]);
    }

    

    protected function sendTestInviteEmail($candidate, $test)
    {
        $data = [
            'name' => $candidate->full_name,
            'addresslink' => ($test->type == 1) ? get_options('office_address_link') : '',
            'otp' => $test->otp,
           // 'test_url' => route('showTest', $test->token)
            'test_url' => env('FRONTEND_URL') . '/test/' . $test->token,
        ];

        Mail::send('emails.test-invite', $data, function ($message) use ($candidate) {
            $message->to($candidate->email, $candidate->full_name)
                ->subject('HRM Aptitude Quiz');
        });
    }




    public function addCandidate()
    {
        if (!in_array('add_candidate', Session::get('permission')[0])) {
            abort(404);
        }
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        return view('users.candidates.add', compact('candidate_status', 'candidate_questions', 'candidate_relationship'));
    }


    // i changed on_candidate_id to candidate_id 
    public function addCandidatePost(Request $request)
    {
        $loginuser = Auth::user();
        $validator = Validator::make(
            $request->all(),
            [
                'position' => 'required',
                'department' => 'required',
                'full_name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'mobile_number' => 'unique:candidates,mobile_number|required|digits:10',
                'email' => 'unique:candidates,email|required|regex:/(.+)@(.+)\.(.+)/i',
                'gender' => 'required',
                'status' => 'required'
            ],
            [
                'position.required' => 'Please enter position',
                'department.required' => 'Please select the department',
                'full_name.required' => 'Please fill the name',
                'mobile_number.required' => 'Please fill the mobile number',
                'mobile_number.unique' => 'Mobile number already exists',
                'mobile_number.digits' => 'Please enter 10 digits mobile number',
                'email.required' => 'Please fill the email',
                'gender.required' => 'Please select the gender',
                'status.required' => 'Please Select the status'


            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        try {
            $candidate = new Candidates();
            $candidate->user_id = $loginuser->id;
            $candidate->full_name = $request->get('full_name');
            $candidate->email = $request->get('email');
            $candidate->gender = $request->get('gender');
            $candidate->mobile_number = $request->get('mobile_number');
            $candidate->position = $request->get('position');
            $candidate->marital_status = $request->get('marital_status');
            $candidate->residence_address = $request->get('residence_address');
            $candidate->passport_number = $request->get('passport_number');
            $candidate->nationality = $request->get('nationality');
            $candidate->dob = $request->get('dob');
            $candidate->age = $request->get('age');
            $candidate->place_of_birth = $request->get('place_of_birth');
            $candidate->marital_status = $request->get('marital_status');
            $candidate->hobbies = $request->get('hobbies');
            $candidate->current_salary = $request->get('current_salary');
            $candidate->expected_salary = $request->get('expected_salary');
            $candidate->remarks = $request->get('remarks');
            $candidate->status = $request->get('status');

            $candidate->date_of_interview = $request->get('date_of_interview');
            $candidate->interview_score = $request->get('interview_score');
            $candidate->interviewed_by = $request->get('interviewed_by');
            $candidate->sourcing = $request->get('sourcing');
            $candidate->department = $request->get('department');
            $candidate->profile_id = Str::random(16);

            $candidate->profile_token = Str::random(16);
            $candidate->offered_salary = $request->get('offered_salary');
            $candidate->created_by = Auth::user()->id;

            $candidate->save(); // Update Candidate table data

            $candidate_id = $candidate->id;

            // Save Skills
            $skill_name = explode(',', $request->get('skill_name'));
            if (count($skill_name) > 0) {
                foreach ($skill_name as $skill) {
                    $c_skill = new CandidateSkills();
                    $c_skill->candidate_id = $candidate_id;
                    $c_skill->skill_name = $skill;
                    $c_skill->Save();
                }
            }

            // Save Education
            $candidate_education = $request->get('candidate_education');
            if (count($candidate_education['institute_name']) > 0) {
                for ($ce = 0; $ce < count($candidate_education['institute_name']); $ce++) {
                    $institute_name = $candidate_education['institute_name'][$ce];
                    $from = $candidate_education['from'][$ce];
                    $to = $candidate_education['to'][$ce];
                    $professional_qualification = $candidate_education['professional_qualification'][$ce];

                    if (! empty($institute_name) || ! empty($from) || ! empty($to) || ! empty($professional_qualification)) {
                        $c_edu = new CandidateEducations();
                        $c_edu->candidate_id = $candidate_id;
                        $c_edu->institute_name = $institute_name;
                        $c_edu->from = $from;
                        $c_edu->to = $to;
                        $c_edu->professional_qualification = $professional_qualification;
                        $c_edu->save();
                    }
                }
            }

            // Save Employments
            $candidate_employments = $request->get('candidate_employments');
            if (count($candidate_employments['company_name']) > 0) {
                for ($ce = 0; $ce < count($candidate_employments['company_name']); $ce++) {
                    $company_name = $candidate_employments['company_name'][$ce];
                    $address = $candidate_employments['address'][$ce];
                    $contact_details = $candidate_employments['contact_details'][$ce];
                    $date_from = $candidate_employments['date_from'][$ce];
                    $date_to = $candidate_employments['date_to'][$ce];
                    $position = $candidate_employments['position'][$ce];
                    $reason_of_leaving = $candidate_employments['reason_of_leaving'][$ce];
                    $candidateEmp = new CandidateEmployments();

                    if (! empty($company_name) || ! empty($address) || ! empty($contact_details) || ! empty($date_from) || ! empty($date_to) || ! empty($position) || ! empty($date_from) || ! empty($reason_of_leaving)) {
                        $c_emp = new CandidateEmployments();
                        $c_emp->candidate_id = $candidate_id;
                        $c_emp->company_name = $company_name;
                        $c_emp->address = $address;
                        $c_emp->contact_details = $contact_details;
                        $c_emp->date_from = $date_from;
                        $c_emp->date_to = $date_to;
                        $c_emp->position = $position;
                        $c_emp->reason_of_leaving = $reason_of_leaving;
                        $c_emp->Save();
                    }
                }
            }

            // Save Languages
            $candidate_languages = $request->get('candidate_languages');
            if (count($candidate_languages['english_id']) > 0) {
                for ($ce = 1; $ce <= count($candidate_languages['english_id']); $ce++) {
                    $language_id = $candidate_languages['english_id'][$ce];
                    $speak = $candidate_languages['speak'][$ce];
                    $write = $candidate_languages['write'][$ce];
                    $understand = $candidate_languages['understand'][$ce];

                    if (! empty($language_id)) {
                        $c_lang = new CandidateLanguages();
                        $c_lang->candidate_id = $candidate_id;
                        $c_lang->language_id = $language_id;
                        $c_lang->speak = $speak;
                        $c_lang->write = $write;
                        $c_lang->understand = $understand;
                        $c_lang->Save();
                    }
                }
            }

            // Save Other infomations
            $candidate_other_informations = $request->get('candidate_other_informations');
            if (count($candidate_other_informations['question_id']) > 0) {
                for ($ce = 1; $ce <= count($candidate_other_informations['question_id']); $ce++) {
                    $question_id = $candidate_other_informations['question_id'][$ce];
                    $status = $candidate_other_informations['status'][$ce];
                    $reason = ($status) ? $candidate_other_informations['reason'][$ce] : "";

                    $c_other = new CandidateOtherInformations();
                    $c_other->candidate_id = $candidate_id;
                    $c_other->question_id = $question_id;
                    $c_other->status = $status;
                    $c_other->reason = $reason;
                    $c_other->Save();
                }
            }

            // Save Familes
            $candidate_families = $request->get('candidate_families');
            if (count($candidate_families['name']) > 0) {
                for ($ce = 0; $ce < count($candidate_families['name']); $ce++) {
                    $name = $candidate_families['name'][$ce];
                    $relationship = $candidate_families['relationship'][$ce];
                    $age = $candidate_families['age'][$ce];
                    $occupation = $candidate_families['occupation'][$ce];
                    $name_of_employer = $candidate_families['name_of_employer'][$ce];

                    if (! empty($name) || ! empty($relationship) || ! empty($age) || ! empty($occupation) || ! empty($name_of_employer)) {
                        $c_famiily = new CandidateFamilies();
                        $c_famiily->candidate_id = $candidate_id;
                        $c_famiily->name = $name;
                        $c_famiily->relationship = $relationship;
                        $c_famiily->age = $age;
                        $c_famiily->occupation = $occupation;
                        $c_famiily->name_of_employer = $name_of_employer;
                        $c_famiily->Save();
                    }
                }
            }

            // Save Accessments
            $candidate_assessments = $request->get('candidate_assessments');
            if (count($candidate_assessments) > 0) {
                foreach ($candidate_assessments as $interviewer => $cassesment) {
                    $cassesment = (object) $cassesment;
                    $interviewer = $interviewer;
                    $interviewer_name = $cassesment->interviewer_name;
                    $education = $cassesment->education;
                    $experince = $cassesment->experince;
                    $attitude = $cassesment->attitude;
                    $stability = $cassesment->stability;
                    $technical_skills = $cassesment->technical_skills;
                    $appearance_personality = $cassesment->appearance_personality;
                    $skills = $cassesment->skills;

                    if (! empty($interviewer_name) || ! empty($education) || ! empty($experince) || ! empty($attitude) || ! empty($stability) || ! empty($technical_skills) || ! empty($appearance_personality) || ! empty($skills)) {
                        $c_assesment = new CandidateAssessments();
                        $c_assesment->candidate_id = $candidate_id;
                        $c_assesment->interviewer = $interviewer;
                        $c_assesment->interviewer_name = $interviewer_name;
                        $c_assesment->education = $education;
                        $c_assesment->experince = $experince;
                        $c_assesment->attitude = $attitude;
                        $c_assesment->stability = $stability;
                        $c_assesment->technical_skills = $technical_skills;
                        $c_assesment->appearance_personality = $appearance_personality;
                        $c_assesment->skills = $skills;
                        $c_assesment->Save();
                    }
                }
            }

            // Save Assessment Sections
            $candidate_assessment_sections = $request->get('candidate_assessment_sections');
            if (count($candidate_assessment_sections) > 0) {
                foreach ($candidate_assessment_sections as $accessment_type => $cassesment) {
                    $cassesment = (object) $cassesment;
                    $accessment_by = $cassesment->accessment_by;
                    $weight_age = $cassesment->weight_age;
                    $score = $cassesment->score;

                    if (! empty($accessment_by) || ! empty($weight_age) || ! empty($score)) {
                        $c_assesment_section = new CandidateAssessmentSections();
                        $c_assesment_section->candidate_id = $candidate_id;
                        $c_assesment_section->accessment_type = $accessment_type;
                        $c_assesment_section->accessment_by = $accessment_by;
                        $c_assesment_section->weight_age = $weight_age;
                        $c_assesment_section->score = $score;
                        $c_assesment_section->Save();
                    }
                }
            }

            // $this->generateTest($candidate_id);

            return response()->json([
                'status' => 200,
                'message' => 'Candidate successfully added.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 401,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function editCandidateOLD($candidate_id)
    {
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        $candidate = Candidates::where('id', $candidate_id)->first();


        return view('users.candidates.edit', compact('candidate', 'candidate_status', 'candidate_questions', 'candidate_relationship'));
    }

    public function editCandidate($candidate_id)
    {
        $candidate = Candidates::with([
            'skills_section',
            'candidate_status',
            'languages',
            'educations',
            'employments',
            'families',
            'assessment_section',
            'assessments',
            'other_informations',
            'skills_section',
        ])->find($candidate_id);
        // $candidate = Candidates::where('id', $candidate_id)->first();


        if (!$candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        return response()->json([
            'candidate' => $candidate,
            'candidate_status' => CandidateStatus::all(),
            'candidate_questions' => CandidateQuestions::all(),
            'candidate_relationship' => Candidates::$relationship,
        ]);
    }


    public function editCandidatePost(Request $request)
    {
        $candidate_id = $request->get('candidate_id');

        // Log::info('My candidate_id is from edit functionality >>>> ' . json_encode($request->all()));


        $loginuser = Auth::user();
        $candidateProfile = $request->get('candidateProfile', []);
        $recommendation = $request->get('recommendation', []);


        foreach ($candidateProfile as $key => $value) {
            $request->merge([$key => $value]);
        }

        foreach ($recommendation as $key => $value) {
            $request->merge([$key => $value]);
        }

        // Now these keys exist in root level and can be validated
        $validator = Validator::make(
            $request->all(),
            [
                'position' => 'required',
                'department' => 'required',
                'full_name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'email' => 'unique:candidates,email,' . $candidate_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i',
                'gender' => 'required',
                'status' => 'required',
                'upload_cv' => 'mimes:doc,pdf,docx',
            ],
            [
                'position.required' => 'Please enter position',
                'department.required' => 'Please select the department',
                'full_name.required' => 'Please fill the name',
                'email.required' => 'Please fill the email',
                'gender.required' => 'Please select gender',
            ]
        );

        if ($validator->fails()) {



            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }
        $candidate = Candidates::where('id', $candidate_id)->first();

        try {

            Log::info('My datas are >>>>', ['user_id' => $loginuser->id]);

            $candidate->user_id = $loginuser->id;
            $candidate->full_name = $request->get('full_name');
            $candidate->email = $request->get('email');
            $candidate->gender = $request->get('gender');


            if ($request->mobile_number) {
                $validator = Validator::make($request->all(), [
                    'mobile_number' => 'unique:candidates,mobile_number,' . $candidate_id . '|required|digits:10|numeric'
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 401,
                        'message' => $validator->errors()
                            ->first()
                    ]);
                }
                $candidate->mobile_number = $request->get('mobile_number');
            }

            $candidate->position = $request->get('position');
            $candidate->marital_status = $request->get('marital_status');
            $candidate->residence_address = $request->get('residence_address');
            $candidate->passport_number = $request->get('passport_number');
            $candidate->nationality = $request->get('nationality');
            $candidate->dob = $request->get('dob');
            $candidate->age = $request->get('age');
            $candidate->place_of_birth = $request->get('place_of_birth');
            $candidate->marital_status = $request->get('marital_status');
            $candidate->hobbies = $request->get('hobbies');
            $candidate->current_salary = $request->get('current_salary');
            $candidate->expected_salary = $request->get('expected_salary');
            $candidate->remarks = $request->get('remarks');
            $candidate->status = $request->get('status');

            $candidate->date_of_interview = $request->get('date_of_interview');
            $candidate->interview_score = $request->get('interview_score');
            $candidate->interviewed_by = $request->get('interviewed_by');
            $candidate->sourcing = $request->get('sourcing');
            $candidate->department = $request->get('department');
            $candidate->offered_salary = $request->get('offered_salary');

            $candidate->save(); // Update Candidate table data

            $candidate_id = $candidate->id;


            // //////////////////// OLD technical skills ////////////////////////////

            // $skill_names = $request->get('technicalSkills');


            // // Handle both array and string formats
            // if (is_string($skill_names)) {
            //     Log::info('My skills are >>>> ');
            //     $skill_name = explode(',', $skill_names);
            //     Log::info('My name of skills are >>>> ', $skill_name);
            // } else if (is_array($skill_names)) {
            //     Log::info('My skills 2nd are >>>> ');
            //     $skill_name = $skill_names;
            // } else {
            //     Log::info('My last skill name >>>> ');
            //     $skill_name = [];
            // }
            // $skill_name = $skill_names;


            // $skill_name = is_string($skill_name) ? explode(',', $skill_name) : $skill_name;
            // if (count($skill_name) > 0) {
            //     Log::info('My skills inside >>>> ');
            //     $skillids = [];
            //     foreach ($skill_name as $skill) {
            //         $skill = trim($skill);
            //         if (!empty($skill)) {
            //             $c_skill = new CandidateSkills();
            //             $c_skill->candidate_id = $candidate_id;
            //             $c_skill->skill_name = $skill;
            //             $c_skill->Save();
            //             $skillids[] = $c_skill->id;
            //         }
            //     }
            //     Log::info('My id of  skill name >>>> ', $skillids);

            //     if (count($skillids) > 0) {
            //         Log::info('My skills inside 2>>>> ');
            //         CandidateSkills::where('candidate_id', $candidate_id)->whereNotIn('id', $skillids)->delete();
            //     }
            // } else {
            //     Log::info('My sfinal boxxss2>>>> ');
            //     // If no skills provided, delete all existing skills for this candidate
            //     CandidateSkills::where('candidate_id', $candidate_id)->delete();
            // }


            $skill_names = json_decode($request->get('technicalSkills'), true);
            Log::info('Decoded candidate skills >>>>', $skill_names);

            // Ensure it's an array
            if (is_array($skill_names) && count($skill_names) > 0) {
                $skillids = [];
                foreach ($skill_names as $skill) {
                    $skill = trim($skill);
                    if (!empty($skill)) {
                        $c_skill = new CandidateSkills();
                        $c_skill->candidate_id = $candidate_id;
                        $c_skill->skill_name = $skill;
                        $c_skill->save();
                        $skillids[] = $c_skill->id;
                    }
                }

                Log::info('Saved skill IDs >>>>', $skillids);

                // Remove old skills not in the list
                CandidateSkills::where('candidate_id', $candidate_id)
                    ->whereNotIn('id', $skillids)
                    ->delete();
            } else {
                // If no skills provided, delete all
                CandidateSkills::where('candidate_id', $candidate_id)->delete();
                Log::info('All skills deleted for candidate_id: ' . $candidate_id);
            }

            // Save Education
            $candidate_education = $request->get('educationRows');
            // Log::info('My candidate_education are >>>> ' . json_encode($candidate_education));

            if ($candidate_education && count($candidate_education) > 0) {
                $canedu = [];

                foreach ($candidate_education as $edu) {
                    $institute_name = $edu['institute'] ?? null;
                    $from = $edu['from'] ?? null;
                    $to = $edu['to'] ?? null;
                    $professional_qualification = $edu['qualification'] ?? null;

                    if (!empty($institute_name) || !empty($from) || !empty($to) || !empty($professional_qualification)) {
                        $c_edu = new CandidateEducations();
                        $c_edu->candidate_id = $candidate_id;
                        $c_edu->institute_name = $institute_name;
                        $c_edu->from = $from;
                        $c_edu->to = $to;
                        $c_edu->professional_qualification = $professional_qualification;
                        $c_edu->save();
                        $canedu[] = $c_edu->id;
                    }
                }

                if (count($canedu) > 0) {
                    CandidateEducations::where('candidate_id', $candidate_id)
                        ->whereNotIn('id', $canedu)
                        ->delete();
                }
            }

            // Save Employments
            $candidate_employments = $request->get('employments');
            // Log::info('My candidate_employments >>>>', ['candidate' => $candidate_employments]);

            if ($candidate_employments && is_array($candidate_employments) && count($candidate_employments) > 0) {
                $empids = [];

                foreach ($candidate_employments as $emp) {
                    $company_name = $emp['company_name'] ?? null;
                    $address = $emp['address'] ?? null;
                    $contact_details = $emp['contact_details'] ?? null;
                    $date_from = $emp['from'] ?? null;
                    $date_to = $emp['to'] ?? null;
                    $position = $emp['position'] ?? null;
                    $reason_of_leaving = $emp['reason_of_leaving'] ?? null;

                    if (!empty($company_name) || !empty($address) || !empty($contact_details) || !empty($date_from) || !empty($date_to) || !empty($position) || !empty($reason_of_leaving)) {
                        $c_emp = new CandidateEmployments();
                        $c_emp->candidate_id = $candidate_id;
                        $c_emp->company_name = $company_name;
                        $c_emp->address = $address;
                        $c_emp->contact_details = $contact_details;
                        $c_emp->date_from = $date_from;
                        $c_emp->date_to = $date_to;
                        $c_emp->position = $position;
                        $c_emp->reason_of_leaving = $reason_of_leaving;
                        $c_emp->save();
                        $empids[] = $c_emp->id;
                    }
                }

                if (count($empids) > 0) {
                    CandidateEmployments::where('candidate_id', $candidate_id)->whereNotIn('id', $empids)->delete();
                }
            }

            // Save Languages

            $languagesMap = [
                'English' => 1,
                'Hindi' => 2,
                'Punjabi' => 3,
            ];
            $candidate_languages = $request->get('languages');

            // Log::info('My candidate_languages are >>>> ' . json_encode($candidate_languages));

            if ($candidate_languages && is_array($candidate_languages) && count($candidate_languages) > 0) {
                $langids = [];

                foreach ($candidate_languages as $lang) {

                    $language_name = $lang['language'] ?? null;
                    $language_id = $languagesMap[$language_name] ?? null;
                    $speak = $lang['speak'] ?? null;
                    $write = $lang['write'] ?? null;
                    $understand = $lang['understand'] ?? null;

                    if (!empty($language_id)) {
                        $c_lang = new CandidateLanguages();
                        $c_lang->candidate_id = $candidate_id;
                        $c_lang->language_id = $language_id;
                        $c_lang->speak = $speak;
                        $c_lang->write = $write;
                        $c_lang->understand = $understand;
                        $c_lang->save();
                        $langids[] = $c_lang->id;
                    }
                }

                if (count($langids) > 0) {
                    CandidateLanguages::where('candidate_id', $candidate_id)->whereNotIn('id', $langids)->delete();
                }
            }

            // Save Other infomations
            $candidate_other_informations = $request->get('otherInfo');

            // Log::info('My candidate_other_informations are >>>> ' . json_encode($candidate_other_informations));

            if ($candidate_other_informations && is_array($candidate_other_informations) && count($candidate_other_informations) > 0) {
                $otherids = [];

                foreach ($candidate_other_informations as $info) {
                    $question_id = $info['id'] ?? null;
                    $status = $info['status'] ?? null;
                    $reason = $status ? ($info['reason'] ?? '') : '';

                    if (!empty($question_id)) {
                        $c_other = new CandidateOtherInformations();
                        $c_other->candidate_id = $candidate_id;
                        $c_other->question_id = $question_id;
                        $c_other->status = $status;
                        $c_other->reason = $reason;
                        $c_other->save();
                        $otherids[] = $c_other->id;
                    }
                }

                if (count($otherids) > 0) {
                    CandidateOtherInformations::where('candidate_id', $candidate_id)
                        ->whereNotIn('id', $otherids)
                        ->delete();
                }
            }

            // Save Familes
            $candidate_families = $request->get('familyMembers');

            // Log::info('My candidate_families are >>>> ' . json_encode($candidate_families));

            if ($candidate_families && is_array($candidate_families) && count($candidate_families) > 0) {
                $famids = [];

                foreach ($candidate_families as $family) {
                    $name = $family['name'] ?? null;
                    $relationship = $family['relationship'] ?? null;
                    $age = $family['age'] ?? null;
                    $occupation = $family['occupation'] ?? null;
                    $name_of_employer = $family['employer'] ?? null;

                    if (!empty($name) || !empty($relationship) || !empty($age) || !empty($occupation) || !empty($name_of_employer)) {
                        $c_family = new CandidateFamilies();
                        $c_family->candidate_id = $candidate_id;
                        $c_family->name = $name;
                        $c_family->relationship = $relationship;
                        $c_family->age = $age;
                        $c_family->occupation = $occupation;
                        $c_family->name_of_employer = $name_of_employer;
                        $c_family->save();
                        $famids[] = $c_family->id;
                    }
                }

                if (count($famids) > 0) {
                    CandidateFamilies::where('candidate_id', $candidate_id)
                        ->whereNotIn('id', $famids)
                        ->delete();
                }
            }

            // Save Accessments
            $candidate_assessments = $request->get('assessmentData');

            // Log::info('My candidate_assessments are >>>> ' . json_encode($candidate_assessments));

            if ($candidate_assessments && is_array($candidate_assessments)) {
                $assids = [];

                foreach ($candidate_assessments as $interviewerId => $assessment) {
                    $interviewer_name = $assessment['interviewer_name'] ?? null;
                    $education = $assessment['education'] ?? null;
                    $experince = $assessment['experince'] ?? null;
                    $attitude = $assessment['attitude'] ?? null;
                    $stability = $assessment['stability'] ?? null;
                    $technical_skills = $assessment['technical_skills'] ?? null;
                    $appearance_personality = $assessment['appearance_personality'] ?? null;
                    $skills = $assessment['skills'] ?? null;

                    if (
                        !empty($interviewer_name) || !empty($education) || !empty($experince) ||
                        !empty($attitude) || !empty($stability) || !empty($technical_skills) ||
                        !empty($appearance_personality) || !empty($skills)
                    ) {
                        $c_assessment = new CandidateAssessments();
                        $c_assessment->candidate_id = $candidate_id;
                        $c_assessment->interviewer = $interviewerId;
                        $c_assessment->interviewer_name = $interviewer_name;
                        $c_assessment->education = $education;
                        $c_assessment->experince = $experince;
                        $c_assessment->attitude = $attitude;
                        $c_assessment->stability = $stability;
                        $c_assessment->technical_skills = $technical_skills;
                        $c_assessment->appearance_personality = $appearance_personality;
                        $c_assessment->skills = $skills;
                        $c_assessment->save();

                        $assids[] = $c_assessment->id;
                    }
                }

                if (count($assids) > 0) {
                    CandidateAssessments::where('candidate_id', $candidate_id)
                        ->whereNotIn('id', $assids)
                        ->delete();
                }
            }

            // Save Assessment Sections
            $candidate_assessment_sections = $request->get('assessmentSectionData');
            Log::info('My candidate_assessment_sections are >>>> ' . json_encode($candidate_assessment_sections));

            if ($candidate_assessment_sections && is_array($candidate_assessment_sections)) {
                $asssecids = [];

                foreach ($candidate_assessment_sections as $accessment_type => $section) {
                    Log::info('My title >>>> ' . $section['accessment_type']);
                    $accessment_type = $section['accessment_type'] ?? null;
                    Log::info('My assessment by >>>> ' . $section['accessment_by']);
                    $accessment_by = $section['accessment_by'] ?? null;
                    Log::info('My weight age by >>>> ' . $section['weight_age']);
                    $weight_age = $section['weight_age'] ?? null;
                    Log::info('My score is  >>>> ' . $section['score']);
                    $score = $section['score'] ?? null;

                    if (!empty($accessment_by) || !empty($weight_age) || !empty($score)) {
                        $c_assessment_section = new CandidateAssessmentSections();
                        $c_assessment_section->candidate_id = $candidate_id;
                        $c_assessment_section->accessment_type = $accessment_type;
                        $c_assessment_section->accessment_by = $accessment_by;
                        $c_assessment_section->weight_age = $weight_age;
                        $c_assessment_section->score = $score;
                        $c_assessment_section->save();

                        $asssecids[] = $c_assessment_section->id;
                    }
                }

                if (count($asssecids) > 0) {
                    CandidateAssessmentSections::where('candidate_id', $candidate_id)
                        ->whereNotIn('id', $asssecids)
                        ->delete();
                }
            }



            /*
             * Upload cv
             */
            if ($file = $request->file('upload_cv')) {
                $name = time() . '-' . $file->getClientOriginalName();
                if ($file->move(public_path('/') . 'uploads/cv/', $name)) {
                    $candidate->cv_file = $name;
                }
            }
            $candidate->save();

            return response()->json([
                'status' => 200,
                'message' => 'Candidate form updated.'
            ]);
        } catch (\Exception $e) {
            Log::info('My final error execption  failed here >>>> ' . $e->getMessage());
            return response()->json([
                'status' => 401,
                'message' => $e->getMessage()
            ]);
        }
    }



    public function allCandidates(Request $request)
    {

        //  $permissions = Session::get('permission', []);

        $currentUser = Auth::user();
        // Log::info('testtt',['currentUser' => $currentUser]);
        $role = Roles::find($currentUser->user_role);
        //  Log::info('role',['role' => $role]);
        $permissionIds = [];
        $permissionSlugs = [];

        if ($role && $role->permissions) {
            $permissionIds = array_filter(explode(',', str_replace(['[', ']'], '', $role->permissions)));
            $permissionSlugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();
        }

        // Log::info('permissionSlugs',['permissionSlugs' => $permissionSlugs]);

        if (empty($permissionSlugs) || !in_array('all_candidates', $permissionSlugs)) {
            abort(403, 'Unauthorized access');
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();

        if (!$permission_role) {
            abort(403, 'Role not found');
        }

        // Base query with relationships
        $query = Candidates::with([
            'candidate_status',
            'educations',
            'employments',
            // 'created_by_user.manager'
        ]);


        if ($permission_role->view == '2') {
            $query->where('created_by', Auth::user()->id);
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)
                ->pluck('id')
                ->toArray();
            $query->whereIn('created_by', $employees);
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)
                ->orWhere('id', Auth::user()->id)
                ->pluck('id')
                ->toArray();
            $query->whereIn('created_by', $employees);
        }

        // 🌐 Server-side filters
        $department = $request->input('department');
        $status = $request->input('status');
        $gender = $request->input('gender');
        $search = $request->input('search');

        Log::info('department', ['department' => $department]);
        Log::info('status', ['status' => $status]);
        Log::info('gender', ['gender' => $gender]);
        Log::info('search', ['search' => $department]);


        if ($department && ($department)) {
            $query->where('department', $department);
        }

        if ($status && ($status)) {
            $query->where('status', $status);
        }
        if ($gender && ($gender)) {
            $query->where('gender', $gender);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%$search%")
                    ->orWhere('profile_id', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        Log::info('my query is ', ['query' => $query]);

        if ($request->expectsJson() || $request->ajax()) {
            $perPage = $request->input('limit', 10);
            $paginatedData = $query->paginate($perPage);

            // Log::info('my paginatedData is ', ['paginatedData' => $paginatedData]);


            // Transform data with null-safe checks
            $transformedData = $paginatedData->getCollection()->map(function ($candidate) use ($permission_role) {
                $manager = optional($candidate->created_by_user)->manager;
                $currentUserId = Auth::id();
                $createdBy = $candidate->created_by;


                return [
                    'id' => 'HRM' . $candidate->id,
                    'full_name' => $candidate->full_name ?? '',
                    'email' => $candidate->email ?? '',
                    'gender' => $candidate->gender ? (Candidates::$gender[$candidate->gender] ?? '') : '',
                    'status' => optional($candidate->candidate_status)->status_name ?? '',
                    'education' => optional($candidate->educations->first())->professional_qualification ?? '',
                    'current_employer' => optional($candidate->employments->first())->company_name ?? '',
                    'department' => $candidate->department ? (Candidates::$departments[$candidate->department] ?? '') : '',
                    'created_at' => $candidate->created_at ? date('d M, Y', strtotime($candidate->created_at)) : '',
                    'date_of_interview' => $candidate->date_of_interview ? date('d M, Y', strtotime($candidate->date_of_interview)) : '',
                    'profile_id' => $candidate->profile_id ?? '',
                    'remarks' => $candidate->remarks ?? '',
                    'can_edit' => $this->checkEditPermission($permission_role, $currentUserId, $createdBy, $manager),
                    'can_delete' => $this->checkDeletePermission($permission_role, $currentUserId, $createdBy, $manager),
                    'can_onboard' => $candidate->status == 7,
                    'is_recruiter' => loginUserRole() === User::ROLE_RECRUITER,
                    'total_experience' => $candidate->total_experience,
                    'total_relevant_experience' => $candidate->total_relevant_experience,
                    'age' => $candidate->age,
                    'mobile_number' => $candidate->mobile_number,
                    'current_salary' => $candidate->current_salary,
                    'expected_salary' => $candidate->expected_salary,
                    'sourcing' => $candidate->sourcing,
                    'interviewed_by' => $candidate->interviewed_by,
                    'interview_score' => $candidate->interview_score,
                    'actions' => $this->generateActionButtons($candidate, $permission_role)
                ];
            })->values()->toArray();

            // Log::info('my transformedData is ', ['transformedData' => $transformedData]);

            return response()->json([
                'data' => $transformedData,
                'current_page' => $paginatedData->currentPage(),
                'last_page' => $paginatedData->lastPage(),
                'total' => $paginatedData->total(),
                'departments' => Candidates::$departments ?? [],
                'statuses' => CandidateStatus::all()->toArray(),
                'filters' => [
                    'genders' => [
                        ['value' => '1', 'label' => 'Male'],
                        ['value' => '2', 'label' => 'Female']
                    ]
                ]
            ]);
        }

        // Handle exports
        if ($request->has('export') && $request->export != '-') {
            $items = $query->get();
            $name = 'candidates-' . time() . '.' . $request->export;

            Excel::store(new CandidateCsvExport($items), $name);

            return response()->json([
                'status' => 'download',
                'download_link' => route('exportdownload', $name)
            ]);
        }

        return response()->json(['error' => 'Invalid request'], 400);
    }


    private function checkEditPermission($permission_role, $currentUserId, $createdBy, $manager)
    {
        if ($permission_role->edit == '2') {
            return $currentUserId == $createdBy;
        }
        if ($permission_role->edit == '3') {
            return $manager && $currentUserId == $manager->id;
        }
        if ($permission_role->edit == '4') {
            return ($manager && $currentUserId == $manager->id) || $currentUserId == $createdBy;
        }
        if ($permission_role->edit == '5') {
            return true;
        }
        return false;
    }

    private function checkDeletePermission($permission_role, $currentUserId, $createdBy, $manager)
    {
        if ($permission_role->delete == '2') {
            return $currentUserId == $createdBy;
        }
        if ($permission_role->delete == '3') {
            return $manager && $currentUserId == $manager->id;
        }
        if ($permission_role->delete == '4') {
            return ($manager && $currentUserId == $manager->id) || $currentUserId == $createdBy;
        }
        if ($permission_role->delete == '5') {
            return true;
        }
        return false;
    }


    private function generateActionButtons($candidate, $permission_role)
    {
        $currentUserId = Auth::id();
        $createdBy = $candidate->created_by;
        $manager = $candidate->created_by_user->manager ?? null;

        $canEdit = $this->checkEditPermission($permission_role, $currentUserId, $createdBy, $manager);
        $canDelete = $this->checkDeletePermission($permission_role, $currentUserId, $createdBy, $manager);
        $isRecruiter = loginUserRole() === User::ROLE_RECRUITER;
        $canOnboard = $candidate->status == 7;

        $buttons = [
            'view' => [
                // 'url' => route('candidateProfileView', $candidate->profile_id),
                'url' => '',
                'icon' => 'eye',
                'class' => 'btn-info',
                'title' => 'View',
                'target' => '_blank'
            ],
            'comment' => [
                'icon' => 'comment',
                'class' => 'btn-success',
                'style' => 'color:#707070',
                'title' => "Name:{$candidate->full_name}&Remarks:{$candidate->remarks}",
                'html' => true
            ]
        ];

        if ($canEdit) {
            $buttons['edit'] = [
                'url' => route('candidateedit', $candidate->id),
                'icon' => 'pencil-alt',
                'class' => 'btn-success',
                'title' => 'Edit'
            ];
        }

        if ($isRecruiter) {
            $buttons['delete'] = [
                'onclick' => "alert('You are not authorized with this permission please contact to HR for further.')",
                'icon' => 'trash',
                'class' => 'btn-secondary',
                'style' => 'background-color:#808080;border-color:#808080;color:#fff',
                'title' => 'Delete'
            ];
        } elseif ($canDelete) {
            $buttons['delete'] = [
                'url' => route('candidatedelete', $candidate->id),
                'onclick' => "return confirm('Are you sure you want to delete this candidate?')",
                'icon' => 'trash',
                'class' => 'btn-danger',
                'title' => 'Delete'
            ];
        }

        if ($canOnboard) {
            $buttons['onboard'] = [
                'url' => route('startOnboarding', $candidate->id),
                'onclick' => "return confirm('Are you sure You want to start Onboarding?')",
                'icon' => 'clipboard-check',
                'class' => 'btn-success',
                'title' => 'Start Onboarding'
            ];
        } else {
            $buttons['onboard'] = [
                'icon' => 'clipboard-check',
                'class' => 'btn-success disabled',
                'title' => 'Not ready for onboarding'
            ];
        }

        $buttons['aptitude'] = [
            'onclick' => "showAptitudeModal('" . route('generateTest', $candidate->id) . "')",
            'icon' => 'paper-plane',
            'class' => 'btn-warning',
            'title' => 'Send Aptitude Test'
        ];

        return $buttons;
    }

    public function exportDownload($file_path)
    {
        // $file_path = $_GET['file_path'];
        return response()->download(storage_path('app/' . $file_path))->deleteFileAfterSend(true);
    }

    public function deleteCandidate($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        $delete = $candidate->delete();
        // if ($delete) {
        //     return redirect()->route('allcandidates')->with('success', 'Candidate deleted.');
        // } else {
        //     return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
        // }
    }

    public function exportUsers()
    {
        return Excel::download(new UserCsvExport(), 'users-' . time() . '.xlsx');
    }

    public function exportCandidates()
    {
        // return Excel::download(new CandidateCsvExport(), 'candidates-' . time() . '.xlsx');  // old functionality
        $candidates = Candidates::where('status', '!=', 0)->get()->toArray();

        return Excel::download(new CandidateCsvExport($candidates), 'candidates-' . time() . '.xlsx');
    }

    public function allCandidateTestOLD(Request $request)
    {
        if (!in_array('review_aptitude_test', Session::get('permission')[0])) {
            abort(404);
        }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();

        if ($permission_role->view == '2') {
            $data = CandidateTest::with('candidate')->where('created_by', Auth::user()->id)->latest();
        } elseif ($permission_role->view == '3') {

            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $data = CandidateTest::with('candidate')->whereIn('created_by', $employees)->latest();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $data = CandidateTest::with('candidate')->whereIn('created_by', $employees)->latest();
        } elseif ($permission_role->view == '5') {
            $data = CandidateTest::with('candidate')->latest();
        }
        if ($request->ajax()) {

            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('status', function (CandidateTest $candidate) {
                    return CandidateTest::$status[$candidate->status];
                })
                ->editcolumn('candidate_id', function (CandidateTest $candidate) {
                    if (isset($candidate->candidate->full_name)) {
                        return $candidate->candidate->full_name . ' (' . $candidate->candidate->id . ')';
                    } else {
                        return '-';
                    }
                })
                ->editcolumn('id', function ($row) {
                    $input = '<input type ="text" style="width:160px;" value ="https://hrm.testguruz.in/public/test/' . $row->token . '" readonly><button class="btn btn-primary edit"  data-id="https://hrm.testguruz.in/public/test/' . $row->token . '" > copy</button>';
                    $link = '<a style="cursor: pointer;" class="edit" title="click to copy" data-id="https://hrm.testguruz.in/public/test/' . $row->token . '" >https://hrm.testguruz.in/public/test/' . $row->token . '</a>';
                    return $input;
                })
                ->addColumn('action', function ($row) {
                    $btn = '<div class="btn-group btn-group-sm">';
                    if ($row->status == 3) {
                        $btn .= '<a class="btn btn-info site-icon eye-icon" title="View" href="' . route('viewCandidateTest', $row->id) . '" target="_blank" ><figure><img src="' . asset("/dist/img/2021/icons/eye-icon-lg.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/eye-icon-lg-white.png") . '" alt="editor"></figure></a> ';
                    }
                    $btn .= '</div>';
                    return $btn;
                })
                ->rawColumns([
                    'id',
                    'action'
                ])
                ->make(true);
        }
        return view('users.candidates.test.list');
    }

    // updated allcandidateTest
    public function allCandidateTest(Request $request)
    {
        $permission_role = Roles::find(Auth::user()->user_role);

        if (!$permission_role) {
            return response()->json(['error' => 'Role not found'], 404);
        }

        // Get pagination and search parameters
        $limit = $request->input('limit', 10);
        $search = $request->input('search', '');

        // Base query
        $query = CandidateTest::with('candidate');

        // Apply role-based restrictions
        if ($permission_role->view == '2') {
            $query->where('created_by', Auth::id());
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::id())->pluck('id');
            $query->whereIn('created_by', $employees);
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::id())
                ->orWhere('id', Auth::id())
                ->pluck('id');
            $query->whereIn('created_by', $employees);
        } elseif ($permission_role->view == '5') {
            // no restriction
        } else {
            return response()->json([
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0
            ]);
        }

        // Search filter (by full_name from related candidate)
        if (!empty($search)) {
            $query->whereHas('candidate', function ($q) use ($search) {
                $q->where('full_name', 'LIKE', "%{$search}%");
            });
        }

        // Apply pagination
        $data = $query->latest()->paginate($limit);

        return response()->json($data);
    }



    public function viewCandidateTestOLD($test_id)
    {
        $can_test = CandidateTest::where('id', $test_id)->where('status', '3')
            ->with('questions')
            ->first();
        if ($can_test) {
            return view('users.candidates.test.view', compact('can_test'));
        } else {
            abort(404);
        }
    }

    public function viewCandidateTest($test_id)
    {
        // added the with -> questions.question.options to get the list of question and its option
        $can_test = CandidateTest::where('id', $test_id)
            ->where('status', '3')
            ->with([
                'candidate',
                'questions.question.options'
            ])
            ->first();
        Log::info('my candidate is >>',['candiate '=>$can_test]);

        if ($can_test) {
            return response()->json([
                'success' => true,
                'data' => $can_test
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Test not found or not completed'
            ], 404);
        }
    }


    public function testStatusCandidate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required',
            'candidate_status' => 'required',
            'candidate_test_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $candidate_id = $request->get('candidate_id');
        $candidate_status = $request->get('candidate_status');
        $candidate_test_id = $request->get('candidate_test_id');

        $candidatetest = CandidateTest::findOrFail($candidate_test_id);
        $candidatetest->test_status = $candidate_status;
        $candidatetest->save();

        $candidate = Candidates::findOrFail($candidate_id);
        $candidate->test_status = $candidate_status;
        $candidate->save();

        $message = 'Congratulations, you are shortlisted for next round. HR team will conecting with you shortly.';
        if ($candidate_status == 2) {
            $message = 'Sorry, You are rejected for this position. Thanks for your time.';
        }

        $to_name = $candidate->full_name;
        $to_email = $candidate->email;
        $data = array(
            'name' => $to_name,
            'msg' => $message,
            'status' => $candidate_status,
            'test_url' => route('showTest', $candidatetest->token)
        );
        Mail::send('emails.send-test-result', $data, function ($message) use ($to_name, $to_email) {
            $message->to($to_email, $to_name)->subject('Message from HRM');
        });

        if (! Mail::failures()) {
            return response()->json([
                'status' => 200,
                'message' => "Message sent to candidate."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    public function sendMessagetoCandidate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required',
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first(),
            ]);
        }

        try {
            $candidate = Candidates::findOrFail($request->candidate_id);
            $to_email = $candidate->email;
            $to_name = $candidate->full_name;

            $data = [
                'messagedata' => $request->message,
                'name' => $to_name,
            ];

            Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_email, $to_name) {
                $message->to($to_email, $to_name)->subject('Message from HRM');
            });

            return response()->json([
                'status' => 200,
                'message' => 'Message sent to candidate.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ]);
        }
    }

    // public function sendEmailCandidateProfile($candidate_id)
    // {
    //     $candidate = Candidates::findOrFail($candidate_id);

    //     $to_name = $candidate->full_name;
    //     $to_email = $candidate->email;
    //     $candidate->profile_token =  Str::random(16);
    //     $candidate->profile_token_date = date("Y-m-d H:i:s", strtotime('+48 hours'));
    //     $candidate->save();

    //     $data = array(
    //         'url' => route('candidateProfile', $candidate->profile_token),
    //         'candidate_view_url' => route('candidateProfileView', $candidate->profile_id),
    //         'name' => $to_name
    //     );
    //     Mail::send('emails.candidate-profile', $data, function ($message) use ($to_name, $to_email) {
    //         $message->to($to_email, $to_name)->subject('Thank you for applying the job.');
    //         $message->from('internaltesting24@yopmail.com');
    //     });

    //     if (! Mail::failures()) {
    //         return redirect()->route('allcandidates')->with('success', 'Profile link sent to candidate email address.');
    //     } else {
    //         return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
    //     }
    // }

    // for getting data based on profile_token when user clicks the email update profile

    public function candidateProfile($token)
    {
        $candidate = Candidates::where('profile_token', $token)
            ->whereNotNull('profile_token')
            ->whereDate('profile_token_date', '>=', now())
            ->first();

        if (!$candidate) {
            return response()->json([
                'status' => false,
                'message' => 'Candidate not found or token expired.'
            ], 404);
        }

        if (!$candidate) {
            return response()->json([
                'status' => false,
                'message' => 'Candidate not found or token expired.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'candidate' => $candidate,
            'candidate_status' => CandidateStatus::all(),
            'candidate_questions' => CandidateQuestions::all(),
            'candidate_relationship' => Candidates::$relationship,
            'candidate_education' => CandidateEducations::where('candidate_id', $candidate->id)->get(),
            'candidate_language' => CandidateLanguages::where('candidate_id', $candidate->id)->get(),
            'candidate_skills' => CandidateSkills::where('candidate_id', $candidate->id)->get(),
            'candidate_employment_history' => CandidateEmployments::where('candidate_id', $candidate->id)->get(),
            'candidate_families' => CandidateFamilies::where('candidate_id', $candidate->id)->get(),
            'candidate_other_info' => CandidateOtherInformations::where('candidate_id', $candidate->id)->get(),
            'countries' => Country::get(['id', 'name']),
            'states' => State::get(['id', 'name']),
            'cities' => City::get(['id', 'name']),
        ]);
    }

    public function candidateProfilePostOld(Request $request)
    {
        Log::info('Candidate Profile Post Request >>> ' . json_encode($request->all()));

        $validator = Validator::make($request->all(), [
            'candidate_token'     => 'required|string|exists:candidates,profile_token',
            'full_name'           => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'gender'              => 'required',
            'residence_address'   => 'required',
            'nationality'         => 'required',
            'dob'                 => 'required|date',
            'place_of_birth'      => 'required',
            'upload_cv'           => 'nullable|file|mimes:pdf,doc,docx'
        ], [
            'full_name.required' => 'Please enter fullname',
            'gender.required'    => 'Please select gender',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        try {
            DB::beginTransaction();

            $candidate = Candidates::where('profile_token', $request->candidate_token)->firstOrFail();

            $candidate->update([
                'full_name'         => $request->full_name,
                'gender'            => $request->gender,
                'marital_status'    => $request->marital_status,
                'residence_address' => $request->residence_address,
                'passport_number'   => $request->passport_number,
                'nationality'       => $request->nationality,
                'dob'               => $request->dob,
                'age'               => $request->age,
                'country_id'        => $request->country,
                'state_id'          => $request->state,
                'city_id'           => $request->city,
                'place_of_birth'    => $request->place_of_birth,
                'hobbies'           => $request->hobbies,
                'link_status'       => '1'
            ]);

            if ($request->get('upload_cv_remove')) {
                $candidate->cv_file = null;
            }

            if ($request->hasFile('upload_cv')) {
                $file = $request->file('upload_cv');
                $filename = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('uploads/cv/'), $filename);
                $candidate->cv_file = $filename;
            }

            $candidate->save();

            // --- Skills ---
            $skillNames = explode(',', $request->input('technicalSkills', '')); // Get skills from request
            $candidate->skills_section()->delete(); // Delete old skills

            // Insert new skills
            foreach ($skillNames as $skill) {
                $skill = trim($skill);
                if (!empty($skill)) {
                    $candidate->skills_section()->create(['skill_name' => $skill]);
                }
            }


            // --- Educations ---
            CandidateEducations::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('educationRows', []) as $edu) {
                CandidateEducations::create([
                    'candidate_id'               => $candidate->id,
                    'institute_name'             => $edu['institute_name'] ?? '',
                    'from'                       => $edu['from'] ?? '',
                    'to'                         => $edu['to'] ?? '',
                    'professional_qualification' => $edu['professional_qualification'] ?? ''
                ]);
            }

            // --- Employments ---
            CandidateEmployments::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('employments', []) as $emp) {
                CandidateEmployments::create([
                    'candidate_id'     => $candidate->id,
                    'company_name'     => $emp['company_name'] ?? '',
                    'address'          => $emp['address'] ?? '',
                    'contact_details'  => $emp['contact_details'] ?? '',
                    'date_from'        => $emp['date_from'] ?? '',
                    'date_to'          => $emp['date_to'] ?? '',
                    'position'         => $emp['position'] ?? '',
                    'reason_of_leaving' => $emp['reason_of_leaving'] ?? ''
                ]);
            }

            // --- Languages ---
            CandidateLanguages::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('languages', []) as $lang) {
                CandidateLanguages::create([
                    'candidate_id' => $candidate->id,
                    'language_id'  => $lang['language_id'] ?? 1,
                    'speak'        => $lang['speak'] ?? 0,
                    'write'        => $lang['write'] ?? 0,
                    'understand'   => $lang['understand'] ?? 0
                ]);
            }

            // --- Other Information ---
            CandidateOtherInformations::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('otherInfo', []) as $info) {
                CandidateOtherInformations::create([
                    'candidate_id' => $candidate->id,
                    'question_id'  => $info['question_id'] ?? 1,
                    'status'       => $info['status'] ?? 0,
                    'reason'       => $info['reason'] ?? ''
                ]);
            }

            // --- Families ---
            CandidateFamilies::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('familyMembers', []) as $fam) {
                CandidateFamilies::create([
                    'candidate_id'     => $candidate->id,
                    'name'             => $fam['name'] ?? '',
                    'relationship'     => $fam['relationship'] ?? '',
                    'age'              => $fam['age'] ?? 12,
                    'occupation'       => $fam['occupation'] ?? '',
                    'name_of_employer' => $fam['name_of_employer'] ?? ''
                ]);
            }

            $candidate->otp = rand(1000, 9999);

            Log::info('otp0', ['otp0' => $candidate->otp]);
            // --- Test Creation ---
            $test = CandidateTest::create([
                'candidate_id' => $candidate->id,
                'token'        => Str::random(32),
                'status'       => 1,
                'created_by'   => Auth::id(),
                'pending_time' => '00:00',
                // 'type'         => 2,
                'type'         => 1,
                'otp'          => $candidate->otp

            ]);
            Log::info('otp0', ['otp0' => $test]);
            // --- Assign random questions ---
            $questions = Questions::where('status', 1)
                ->inRandomOrder()
                ->limit(10) // You can use config('settings.quiz_question_limit') if dynamic
                ->get();

            foreach ($questions as $question) {
                CandidateTestOptions::create([
                    'candidate_test_id' => $test->id,
                    'question_id'       => $question->id,
                    'correct_answer'    => $question->answer
                ]);
            }

            // --- Send Email ---
            // Mail::send('emails.test-invite', [
            //     'name'     => $candidate->full_name,
            //     'test_url' => route('showTest', $test->token)
            // ], function ($message) use ($candidate) {
            //     $message->to($candidate->email, $candidate->full_name)->subject('HRM Aptitude Quiz');
            // });


            Mail::send('emails.test-invite', [
                'name'     => $candidate->full_name,
                //'test_url' => route('showTest', $test->token),
                'otp'     => $candidate->otp,
                'test_url' => env('FRONTEND_URL') . '/test/' . $test->token,
            ], function ($message) use ($candidate) {
                $message->to($candidate->email, $candidate->full_name)
                    ->subject('HRM Aptitude Quiz');
            });


            // --- Notification ---
            Notifications::create([
                'type_id' => 'profile_updated',
                'message' => $candidate->full_name . ' has updated profile',
                'page_id' => $candidate->id,
            ]);

            DB::commit();

            return response()->json(['status' => 200, 'message' => 'Profile updated successfully.']);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Profile Update Error: ' . $e->getMessage());
            return response()->json(['status' => 500, 'message' => 'Server error. Please try again.']);
        }
    }

    public function candidateProfilePost(Request $request)
    {
        Log::info('Candidate Profile Post Request >>> ' . json_encode($request->all()));

        $validator = Validator::make($request->all(), [
            'candidate_token'     => 'required|string|exists:candidates,profile_token',
            'full_name'           => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'gender'              => 'required',
            'residence_address'   => 'required',
            'nationality'         => 'required',
            'dob'                 => 'required|date',
            'place_of_birth'      => 'required',
            'upload_cv'           => 'nullable|file|mimes:pdf,doc,docx'
        ], [
            'full_name.required' => 'Please enter fullname',
            'gender.required'    => 'Please select gender',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        try {
            DB::beginTransaction();

            $candidate = Candidates::where('profile_token', $request->candidate_token)->first();

            if (!$candidate) {
                return response()->json(['status' => 404, 'message' => 'Candidate not found']);
            }

            // ✅ Block further updates
            if ($candidate->link_status == 1) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Profile has already been submitted and cannot be updated again.'
                ]);
            }

            $candidate->update([
                'full_name'         => $request->full_name,
                'gender'            => $request->gender,
                'marital_status'    => $request->marital_status,
                'residence_address' => $request->residence_address,
                'passport_number'   => $request->passport_number,
                'nationality'       => $request->nationality,
                'dob'               => $request->dob,
                'age'               => $request->age,
                'country_id'        => $request->country,
                'state_id'          => $request->state,
                'city_id'           => $request->city,
                'place_of_birth'    => $request->place_of_birth,
                'hobbies'           => $request->hobbies,
                'link_status'       => '1' // Mark as submitted
            ]);

            if ($request->get('upload_cv_remove')) {
                $candidate->cv_file = null;
            }

            if ($request->hasFile('upload_cv')) {
                $file = $request->file('upload_cv');
                $filename = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('uploads/cv/'), $filename);
                $candidate->cv_file = $filename;
            }

            $candidate->save();

            // --- Skills ---
            $skillNames = explode(',', $request->input('technicalSkills', ''));
            $candidate->skills_section()->delete();
            foreach ($skillNames as $skill) {
                $skill = trim($skill);
                if (!empty($skill)) {
                    $candidate->skills_section()->create(['skill_name' => $skill]);
                }
            }

            // --- Educations ---
            CandidateEducations::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('educationRows', []) as $edu) {
                CandidateEducations::create([
                    'candidate_id'               => $candidate->id,
                    'institute_name'             => $edu['institute_name'] ?? '',
                    'from'                       => $edu['from'] ?? '',
                    'to'                         => $edu['to'] ?? '',
                    'professional_qualification' => $edu['professional_qualification'] ?? ''
                ]);
            }

            // --- Employments ---
            CandidateEmployments::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('employments', []) as $emp) {
                CandidateEmployments::create([
                    'candidate_id'     => $candidate->id,
                    'company_name'     => $emp['company_name'] ?? '',
                    'address'          => $emp['address'] ?? '',
                    'contact_details'  => $emp['contact_details'] ?? '',
                    'date_from'        => $emp['date_from'] ?? '',
                    'date_to'          => $emp['date_to'] ?? '',
                    'position'         => $emp['position'] ?? '',
                    'reason_of_leaving' => $emp['reason_of_leaving'] ?? ''
                ]);
            }

            // --- Languages ---
            CandidateLanguages::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('languages', []) as $lang) {
                CandidateLanguages::create([
                    'candidate_id' => $candidate->id,
                    'language_id'  => $lang['language_id'] ?? 1,
                    'speak'        => $lang['speak'] ?? 0,
                    'write'        => $lang['write'] ?? 0,
                    'understand'   => $lang['understand'] ?? 0
                ]);
            }

            // --- Other Information ---
            CandidateOtherInformations::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('otherInfo', []) as $info) {
                CandidateOtherInformations::create([
                    'candidate_id' => $candidate->id,
                    'question_id'  => $info['question_id'] ?? 1,
                    'status'       => $info['status'] ?? 0,
                    'reason'       => $info['reason'] ?? ''
                ]);
            }

            // --- Families ---
            CandidateFamilies::where('candidate_id', $candidate->id)->delete();
            foreach ($request->input('familyMembers', []) as $fam) {
                CandidateFamilies::create([
                    'candidate_id'     => $candidate->id,
                    'name'             => $fam['name'] ?? '',
                    'relationship'     => $fam['relationship'] ?? '',
                    'age'              => $fam['age'] ?? 12,
                    'occupation'       => $fam['occupation'] ?? '',
                    'name_of_employer' => $fam['name_of_employer'] ?? ''
                ]);
            }

            // --- OTP & Test Creation ---
            $candidate->otp = rand(1000, 9999);
            Log::info('Generated OTP', ['otp' => $candidate->otp]);

            $test = CandidateTest::create([
                'candidate_id' => $candidate->id,
                'token'        => Str::random(32),
                'status'       => 1,
                'created_by'   => Auth::id(),
                'pending_time' => '00:00',
                'type'         => 1,
                'otp'          => $candidate->otp
            ]);

            // --- Assign Questions ---
            $questions = Questions::where('status', 1)
                ->inRandomOrder()
                ->limit(10)
                ->get();

            foreach ($questions as $question) {
                CandidateTestOptions::create([
                    'candidate_test_id' => $test->id,
                    'question_id'       => $question->id,
                    'correct_answer'    => $question->answer
                ]);
            }

            // --- Send Email ---
            Mail::send('emails.test-invite', [
                'name'     => $candidate->full_name,
                'otp'      => $candidate->otp,
                'test_url' => env('FRONTEND_URL') . '/test/' . $test->token,
            ], function ($message) use ($candidate) {
                $message->to($candidate->email, $candidate->full_name)
                    ->subject('HRM Aptitude Quiz');
            });

            // --- Notification ---
            Notifications::create([
                'type_id' => 'profile_updated',
                'message' => $candidate->full_name . ' has updated profile',
                'page_id' => $candidate->id,
            ]);

            DB::commit();

            return response()->json(['status' => 200, 'message' => 'Profile updated successfully.']);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Profile Update Error: ' . $e->getMessage());
            return response()->json(['status' => 500, 'message' => 'Server error. Please try again.']);
        }
    }



    public function candidateProfileView($profile_id)
    {
        $candidate = Candidates::with([
            'skills_section',
            'languages',
            'educations',
            'employments',
            'families',
            'assessment_section'
        ])->where('profile_id', $profile_id)->first();
        Log::info('My candidate >>>>', [' candidates are >', $candidate]);

        if (!$candidate) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json([
            'candidate' => $candidate,
            'candidate_questions' => CandidateQuestions::all(),
            'candidate_relationship' => Candidates::$relationship,
            'candidate_status' => CandidateStatus::all(),
            'candidate_education' => CandidateEducations::all(),
        ]);
    }


    public function bulkSendForm(Request $request)
    {
        $rowsIds = $request->get('rows_ids');
        $type = $request->get('type');
        $page = $request->get('page');

        // if ($page == 'candidates') {
        // $allemails = Candidates::get();
        // }
        $emails = implode(',', $rowsIds);
        return view('modals.send_email', compact('emails'));
    }

    public function bulkSendFormSubmit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_to' => 'required',
            'email_subject' => 'required',
            'email_content' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $email_to = explode(',', $request->get('email_to'));
        $email_subject = $request->get('email_subject');
        $email_content = $request->get('email_content');
        foreach ($email_to as $to_email) {

            $data = array(
                'email_subject' => $email_subject,
                'email_content' => $email_content
            );
            Mail::send('emails.bulk-email', $data, function ($message) use ($email_subject, $to_email) {
                $message->to($to_email)->subject($email_subject);
            });
        }

        return response()->json([
            'status' => 200,
            'message' => "Email send to selected users email address."
        ]);
    }

    public function realTimeNotification()
    {
        $notifications = Notifications::where('notify_status', '1')->where('notify_type', '!=', 3)->orderBy('id', 'DESC')->get();
        if ($notifications) {
            $messages = [];
            foreach ($notifications as $notify) {
                $notify->notify_status = 2;
                $notify->save();
                $messages[] = $notify->message;
            }
            return response()->json([
                'status' => 200,
                'data' => $messages
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => "Email send to selected users email address."
            ]);
        }
    }

    public function importEmployees()
    {
        Excel::import(new EmployeesImport, request()->file('file'));

        return back();
    }

    public function passwordMail(Request $request)
    {
        Excel::import(new MailPasswordImport, request()->file('file'));
        return back();
    }

    public function exportEmployees(Request $request)
    {
        return Excel::download(new ExportEmployees, 'employees.xlsx');
    }

    public function changeStatus(Request $request)
    {
        $user_id = $request->user_id;
        $status = $request->status;
        $user = Employees::find($request->user_id);
        if ($user->is_manager == '1' && $status == '0') {
            return view('modals.allocate-manager', compact('status', 'user_id'));
        } else {

            $user->status = $request->status;
            $user->password = '';
            $user->save();

            return response()->json(['response' => 'deactive', 'success' => 'Status change successfully.']);
        }
    }

    public function changeEmployeeStatusPost(Request $request)
    {

        $new_manager = $request->new_manager;
        $user = Employees::find($request->user_id);
        $managers = Employees::where('manager_id', $request->user_id)->pluck('id')->toArray();
        foreach ($managers as $manager) {
            $emp = Employees::where('id', $manager)->first();
            $emp->manager_id = $request->new_manager;
            $emp->save();
        }
        $user->status = $request->status;
        $user->password = '';
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "Status Changed succesfully"
        ]);







        // $user = Employees::find($request->user_id);
        // $user->status = $request->status;
        // $user->password= '';
        // $user->save();

        // return response()->json(['success'=>'Status change successfully.']);
    }

    public function inductionNotCompleted(Request $request)
    {
        $requests = OnboardRequests::pluck('candidate_name')->toArray();
        $candidate = ObCandidates::pluck('name')->toArray();
        $result = array_diff($candidate, $requests);
        $name = implode(",", $result);
        $to_email = 'tamanna@yopmail.co.in';
        $email_subject = "Induction not completed";
        $email_content = "You haven't completed the induction of following profiles";

        $data = array(
            'email_subject' => $email_subject,
            'email_content' => $email_content,
            'name' => $name

        );
        Mail::send('emails.induction', $data, function ($message) use ($email_subject, $to_email) {
            $message->to($to_email)->subject($email_subject);
        });

        return response()->json([
            'status' => 200,
            'message' => "Email send to hr"
        ]);
    }

    public function  onboardRequestMail(Request $request)
    {
        $requests = OnboardRequests::where('status', '1')->pluck('candidate_name')->toArray();
        // print_r($requests);die();
        $name = implode(",", $requests);
        $to_email = 'tamanna@yopmail.co.in';
        $email_subject = "Onboarding request";
        $email_content = "You haven't Approve the Onboarding request of following employees: ";

        $data = array(
            'email_subject' => $email_subject,
            'email_content' => $email_content,
            'name' => $name

        );
        Mail::send('emails.onboard-requests', $data, function ($message) use ($email_subject, $to_email) {
            $message->to($to_email)->subject($email_subject);
        });

        return response()->json([
            'status' => 200,
            'message' => "Email send to jass"
        ]);
    }

    public function OnboardRequests(Request $request)
    {
        if (!in_array('onboard_requests', Session::get('permission')[0])) {
            abort(404);
        }
        if ($request->ajax()) {
            $data = OnboardRequests::get();
            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('status', function ($row) {
                    if ($row->status == '1') {
                        return 'Pending';
                    } else {
                        return 'Approved';
                    }
                    return CandidateTest::$status[$candidate->status];
                })
                ->editcolumn('link', function ($row) {
                    $btn = '<div class="btn-group btn-group-sm">';
                    $btn .= '<a class="btn btn-info site-icon eye-icon" title="View Profile" target="_blank" href="' . $row->link . '" ><figure><img src="' . asset("/dist/img/2021/icons/eye-icon-lg.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/eye-icon-lg-white.png") . '" alt="editor"></figure>';

                    $btn .= '</div>';
                    return $btn;
                })

                ->addColumn('action', function ($row) {
                    if ($row->status == '1') {
                        $btn = '<div class="btn-group btn-sm btn-group-sm">';
                        $btn .= '<a class="btn btn-warning" title="pending" href="' . route('approveOnboard', $row->id) . '"><b>Approve</b>';
                        $btn .= '</div>';
                        return $btn;
                    } else {
                        return '<i class="fas fa-check" style="color:green;"></i>';
                    }
                })
                ->rawColumns([
                    'action',
                    'status',
                    'link'
                ])
                ->make(true);
        }
        return view('users.employees.onboardrequests');
    }
    public function approveOnboard(Request $request, $user_id)
    {
        $onboard = OnboardRequests::where('id', $user_id)->first();
        $onboard->status = '2';
        if ($onboard->save()) {
            return redirect()->route('onboardRequests')->with('success', 'Onboarding request approved');
        }
    }
    public function viewReadinessTest($test_id)
    {
        $last = ReadinessAnswer::where('employee_id', $test_id)->latest()->first();
        $employee = Employees::where('id', $test_id)->first();
        if ($last) {
            return view('users.candidates.readiness.view', compact('last', 'employee'));
        } else {
            abort(404);
        }
    }

    public function redirectionTest(Request $request)
    {
        $url = $_SERVER['REQUEST_URI'];
        print_r($url);
    }


    public function openExitPopup(Request $request)
    {
        $id = $request->resignation_id;
        $exit = EmployeeExit::where('employee_id', $id)->first();
        if ($exit) {
            return response()->json([
                'status' => 401,
                'message' => 'Already In Progress'
            ]);
        } else {
            return view('modals.open-exit-popup-from-admin', compact('exit', 'id'));
        }
    }

    
}

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
         * $event->location = 'Webguruz Technologies (P) Ltd. IT C-2 Dibon Building - 4th Floor, Sector 67, Sahibzada Ajit Singh Nagar, Punjab 160062 ';
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
        
        if(!in_array('all_users', Session::get('permission')[0])){
            abort(404);
        }
        

        $user_roles = User::$role;
        $genders = User::$gender;
        $roles = Roles::get();

        return view('users.adduser', compact('user_roles', 'genders','roles'));
    }

    /**
     * Save new user.
     */
    public function addUserPost(Request $request)
    {
        // $loginuser = Auth::user();
        $user = new User();
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email' => 'unique:users,email|required|regex:/(.+)@(.+)\.(.+)/i',
            'phone' => 'required|digits:10|numeric',
            'password' => 'min:6|confirmed|required',
            'user_role' => 'required'
        ],
       [
        'name.required'=>'Please fill the name',
        'email.required'=>'Please fill the email',
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
        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
        if($permission_role->add == '2')
        {
            $created_by =Auth::user()->id;
        }
        else
        {
            if(empty($request->created_by)){
             return response()->json([
                    'status' => 401,
                    'message' =>'Please select to whom you would assign to'
                ]);
        }
          $created_by =$request->created_by;
        }
       

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->phone =$request->phone;
        $user->gender = $request->gender;
        $user->user_role = $request->user_role;
        $user->created_by =$created_by;
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
        if(!in_array('all_users', Session::get('permission')[0])){
            abort(404);
        } 
    
        return view('users.edituser', compact('user', 'loginuser', 'user_roles', 'genders','roles'));
    }

    /**
     * Update user.
     */
    public function editUserPost(Request $request)
    {
        $loginuser = Auth::user();
        $user_id = $request->user_id;
        $user = User::where('id', $user_id)->first();
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email' => 'unique:users,email,' . $user_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i'
        ],
       [
        'name.required'=>'Please fill the name',
        'email.required'=>'Please fill the email'
       ]);

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
        if(!in_array('all_users', Session::get('permission')[0])){
            abort(404);
        } 
        $user_roles = Roles::get();
        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
        if($permission_role->view == '2')
        {
           $data = User::where('created_by',Auth::user()->id)->orderBy('created_at', 'desc')->get();
        }
        elseif($permission_role->view == '3')
        {

            $employees = Employees::where('manager_id',Auth::user()->id)->pluck('id')->toArray();
            $data = User::whereIn('created_by',$employees)->orderBy('created_at', 'desc')->get();
          
        }
        elseif ($permission_role->view == '4')
        {
            $employees = Employees::where('manager_id',Auth::user()->id)->orWhere('id',Auth::user()->id)->pluck('id')->toArray();
            $data = User::whereIn('created_by',$employees)->orderBy('created_at', 'desc')->get();
           
        }
        elseif ($permission_role->view == '5') {
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
                           <img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor">
                         </figure>
                      </a> ';
                if ($row->id != $loginuser->id) {
                    $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteUser', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this user?\')">
                         <figure>
                           <img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor">
                           <img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor">
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

    /**
     * Add employee page.
     */
    public function addEmployee()
    {
        $loginuser = Auth::user();
        $user_role = Auth::user()->user_role;
        
        $user_roles = User::$role;
        $genders = User::$gender;
        return view('users.employees.adduser', compact('user_roles', 'genders'));
    }

    /**
     * add new employee and send email notification to employee to create account password.
     */
    public function addEmployeePost(Request $request)
    {
        // $loginuser = Auth::user();

        $user = new Employees();
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|unique:employees,email|regex:/(.+)@(.+)\.(.+)/i'
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

        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
       if($permission_role->add == '2')
            {
                $created_by =Auth::user()->id;
            }
            else
            {
                if(empty($request->created_by)){
                 return response()->json([
                        'status' => 401,
                        'message' =>'Please select to whom you would assign to'
                    ]);
            }
              $created_by =$request->created_by;
            }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt('#WEBGURUZ#'); // Str::random(6)
        $user->token = Str::random(32);
        $user->created_by = $created_by;
        if ($user->save()) {
            $ObCandidates = ObCandidates::where('id',$request->on_candidate_id)->first();
            if(!$ObCandidates)
            {
                $ObCandidates = new ObCandidates();
                $ObCandidates->name = $request->name;
                $ObCandidates->email = $request->email;
                $ObCandidates->office_employee_id = $user->id;
                $ObCandidates->created_by = $created_by;
                $ObCandidates->save();

            }
            else
            {
                 $ObCandidates->email = $request->email;
                 $ObCandidates->office_employee_id = $user->id;
                 $ObCandidates->created_by = $created_by;
                 $ObCandidates->save(); 
            }
            

            // if ($request->has('on_candidate_id')) {
            //     $obcandidate = ObCandidates::where('id', $request->on_candidate_id)->first();
            //     $obcandidate->office_employee_id = $user->id;
            //     $obcandidate->save();
            // }

            $to_name = $user->name;
            $to_email = $user->email;
            $data = array(
                'name' => $request->name,
                'invite_link_accept' => route('setPasswordEmployee', [
                    'accept',
                    $user->token
                ]),
                'invite_link_declined' => route('setPasswordEmployee', [
                    'declined',
                    $user->token
                ])
            );
            Mail::send('emails.employee-invite', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('Welcome to HRM');
            });

            if (! Mail::failures()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Employee added successfully"
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

    
    public function editEmployee($user_id)
    {
        $user_roles = User::$role;
        $genders = User::$gender;
        $loginuser = Auth::user();
        $rooms =InventoryRooms::where('is_deleted', '0')->get();
        $user = Employees::where('id', $user_id)->first();
        $rules = AttendanceRules::get();
        $leaverules = LeaveRules::where('for_all','!=','1')->get();
        $obcandidates = ObCandidates::where('office_employee_id',$user_id)->first();
        $employees = Employees::where('id',$user_id)->first();
        if($obcandidates){
           $attendance_rule = AttendanceRules::where('id',$obcandidates->attendance_rule_id)->first(); 
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

        return view('users.employees.edituser', compact('team_name','user', 'loginuser', 'user_roles', 'genders','rules','leaverules','employeeleave','obcandidates','rooms','employees'));
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
        $candidate=$candidate_info = ObCandidates::where('office_employee_id', $user->id)->first();
        $candidate_id = $candidate->candidate_id;
        $candidateData = Candidates::where('id', $candidate_id)->first();

        $progress = getEmployeeProgress($candidate->id);
        $candidate_id = $candidate->id;

        if ($tab == 'personal') {
            return view('users.employees.view.personal', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData', 'candidate_questions','candidate_info', 'candidate_id'));
        } else if ($tab == 'official') {
            return view('users.employees.view.official', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData', 'candidate_questions','candidate_info', 'candidate_id'));
        } else if ($tab == 'appraisal') {
            return view('users.employees.view.appraisal', compact('tab', 'employee_id', 'user', 'loginuser', 'user_roles', 'genders', 'progress', 'candidate', 'candidateData','candidate_info', 'candidate_questions', 'candidate_id'));
        }

        abort(404);
    }

    /**
     * Update employee.
     */
    public function editEmployeePost(Request $request)
    {
        $loginuser = Auth::user();
        $user_id = $request->user_id;
        $all_employees= Employees::get();
        $user = Employees::where('id', $user_id)->first();

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'email' => 'unique:employees,email,' . $user_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i',
            'is_manager' =>'required|in:1, 0',
            'role_id'=>'required|in:1, 2, 3' 
        ],
        [
            'name.required' => 'Please fill the name',
            'email.required' => 'Please fill the email'

        ]);
          
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
            $obcandidates = ObCandidates::where('office_employee_id',$request->user_id)->first();
            if($obcandidates){
             $obcandidates->attendance_rule_id = $request->attendance_rule_id;
            $obcandidates->is_crm = $request->crm;
            $obcandidates->is_interviewer = $request->Interviewer;

            $obcandidates->save();
            }
            

            $aa = $request->leave_rule_id;
            $employee= EmployeeLeaveRules::where('employee_id',$request->user_id)->pluck('leave_rule_id')->toArray();
            if($aa){
                 $result=array_intersect($aa,$employee);
            $arrdiff = array_diff($employee,$result);
                 
            
            foreach($arrdiff as $diff) {
       $delruleid= EmployeeLeaveRules::where('employee_id',$request->user_id)->where('leave_rule_id', $diff)->delete();
            }
        foreach($aa as $aa)
        {
           $employeeleave  = EmployeeLeaveRules::where('employee_id',$request->user_id)->where('leave_rule_id',$aa)->first();
            if(!$employeeleave){
              $employeeleave = new EmployeeLeaveRules();
              $employeeleave->leave_rule_id = $aa;
              $employeeleave->employee_id = $request->user_id;
              $employeeleave->save();
        }

    }
            }
           
       $user->room_id = $request->room_name;
       $user->is_manager = $request->is_manager;
       $user->role_id = $request->role_id;
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
        $loginuser = Auth::user();
        
        if(!in_array('all_employees', Session::get('permission')[0])){
            abort(404);
        }
        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
        if($permission_role->view == '2')
        {
          $data = Employees::where('created_by',Auth::user()->id)->orderBy('name', 'ASC')->get();
        }
        elseif($permission_role->view =='3')
        {
            $employees = Employees::where('manager_id',Auth::user()->id)->pluck('id')->toArray();
            $data = Employees::whereIn('created_by',$employees)->orderBy('name', 'ASC')->get();
        }
        elseif ($permission_role->view == '4') 
        {
            $employees = Employees::where('manager_id',Auth::user()->id)->orWhere('id',Auth::user()->id)->pluck('id')->toArray();
            $data = Employees::whereIn('created_by',$employees)->orderBy('name', 'ASC')->get();
        }
        elseif ($permission_role->view == '5') {
           $data = Employees::orderBy('name','ASC')->get();
        }
        
        $user_roles = User::$role;

        if ($request->ajax()) {
           
            return DataTables::of($data)->addIndexColumn()
             ->editcolumn('manager_id', function ($row) {
               if(!empty($row->manager_id))
               {
                $get_manager = Employees::where('id', $row->manager_id)->first();
                 return $get_manager->name;
               }
               else
               {
                return '-';
               }              
            })
                ->editcolumn('gender', function (Employees $user) {
                return User::$gender[$user->gender];
            })

                ->editcolumn('status', function ($row) {
                return '<input data-id="' . $row->id . '" data-size = "mini" data-style="toggle-button"  class="toggle-class" type="checkbox" data-onstyle="success" data-offstyle="danger" data-toggle="toggle" data-on="Active" data-off="InActivee" '. (( $row->status) ? "checked" : "") .'>';
            })
                ->editcolumn('progress', function ($row) {

                    $id = $row->id;
                    $name = ObCandidates::where('office_employee_id', $id)->first();
                    if(!empty($name)){
                          // for tab 1
                    $tab_id_1 = ObTabFieldRelations::where('tab_id',1)->pluck('field_id')->toArray();
                    $full_data_1 = ObTabFieldOptions::whereNotIn('type', array(3,6))->whereIn('field_id', $tab_id_1)->pluck('id')->toArray();
                    $data_1 = ObTabFieldData::where('ob_candidate_id', $name->id)->where('value' ,  '!=' , '')->where('value' ,  '!=' , '[]')->whereIn('field_id', $full_data_1 )->pluck('field_id')->toArray();

              
                    $tab_id_2 = ObTabFieldRelations::where('tab_id',2)->pluck('field_id')->toArray();
                    $full_data_2 = ObTabFieldOptions::whereNotIn('type', array(3,6))->whereIn('field_id', $tab_id_2)->pluck('id')->toArray();
                    $data_2 = ObTabFieldData::where('ob_candidate_id', $name->id)->where('value' ,  '!=' , '')->where('value' ,  '!=' , '[]')->whereIn('field_id', $full_data_2)->pluck('field_id')->toArray();

                   
                    $tab_id_3 = ObTabFieldRelations::where('tab_id',3)->pluck('field_id')->toArray();
                    $full_data_3 = ObTabFieldOptions::whereNotIn('type', array(3,6))->whereIn('field_id', $tab_id_3)->pluck('id')->toArray();
                    $data_3 = ObTabFieldData::where('ob_candidate_id', $name->id)->where('value' ,  '!=' , '')->where('value' ,  '!=' , '[]')->whereIn('field_id', $full_data_3)->pluck('field_id')->toArray();

                    $tab_id_4 = ObTabFieldRelations::where('tab_id',4)->pluck('field_id')->toArray();
                    $full_data_4 = ObTabFieldOptions::whereNotIn('type', array(3,6))->whereIn('field_id', $tab_id_4)->pluck('id')->toArray();
                    $data_4 = ObTabFieldData::where('ob_candidate_id', $name->id)->where('value' ,  '!=' , '')->where('value' ,  '!=' , '[]')->whereIn('field_id', $full_data_4)->pluck('field_id')->toArray();
 
                    $tab_id_5 = ObTabFieldRelations::where('tab_id',5)->pluck('field_id')->toArray();
                    $full_data_5 = ObTabFieldOptions::whereNotIn('type', array(3,6))->whereIn('field_id', $tab_id_5)->pluck('id')->toArray();
                    $data_5 = ObTabFieldData::where('ob_candidate_id', $name->id)->where('value' ,  '!=' , '')->where('value' ,  '!=' , '[]')->whereIn('field_id', $full_data_5)->pluck('field_id')->toArray();

                    $progress = 0;
                    if(empty(array_diff($full_data_1, $data_1)))
                    {
                         $b =40;
                         $progress += $b;
                    }
                    if(empty(array_diff($full_data_2, $data_2)))
                    {
                         $c =20;
                         $progress = $progress + $c;
                    }
                    if(empty(array_diff($full_data_3, $data_3)))
                    {
                         $d =10;
                         $progress = $progress +  $d;
                    }
                    if(empty(array_diff($full_data_4, $data_4)))
                    {
                         $e =10;
                         $progress = $progress  + $e;
                    }
                    if(empty(array_diff($full_data_5, $data_5)))
                    {
                         $f =15;
                         $progress = $progress  + $f;
                    }
                    if( $progress == 95)
                    {
                        $onboard =OnboardRequests::where('candidate_name', $row->name)->first();
                                        if(empty($onboard))
                                        {
                                            $request = new OnboardRequests();
                                            $request->candidate_name = $row->name;
                                            $request->updated_by = Auth::user()->name;
                                            $request->link = 'http://103.163.58.156:4016/hrm/onboarding/candidate/'.$name->id.'';
                                            $request->save();
                                        }
                                        else{
                                            if($onboard->status == '1')
                                            {
                                                return '<div class="progress progress-sm border-radius">
                                                <div class="progress-bar bg-primary cstm-progress" style="width:95%"></div>
                                                </div><small style="color:green;">95%</small>';
                                            }
                                            else{
                                                return '<div class="progress progress-sm border-radius">
                                                    <div class="progress-bar bg-primary cstm-progress" style="width:100%"></div>
                                                    </div><small style="color:green;">100%</small>';

                                            }
                    }
                }
                    }else{
                        $progress=0;
                    }
                  

                     return '<div class="progress progress-sm border-radius">
                                <div class="progress-bar bg-primary cstm-progress" style="width: '.$progress.'%"></div>
                                </div><small style="color:red;">'.$progress.'%</small>';

              
            })
                ->addColumn('action', function ($row) {
                $id = Auth::user()->id;
                $created_by = $row->created_by;
                $manager =  Employees::where('id', $created_by)->first();
                $permission_role =Roles::where('id',Auth::user()->user_role)->first();
                $btn = '<div class="btn-group btn-group-sm">';
                if($row->id)
                {
                    if($permission_role->edit == '2')
                {
                    if($id == $created_by)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editEmployee', $row->id) . '">
                           <figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure>';

                    }
                }
                elseif($permission_role->edit == '3')
                {
                     if($id == $manager->manager_id)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editEmployee', $row->id) . '">
                           <figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure>';
                    }
                }
                elseif($permission_role->edit == '4')
                {
                     if($id == $manager->manager_id || $id == $created_by)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editEmployee', $row->id) . '">
                           <figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure>';
                    }
                }
               elseif($permission_role->edit == '5')
                {
                   
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editEmployee', $row->id) . '">
                           <figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure>';
                    
                }
               
                $btn .= '<a class="btn btn-info site-icon eye-icon" title="View Profile" href="' . route('viewEmployee', [
                    $row->id,
                    'personal'
                ]) . '" ><figure><img src="'.asset("/dist/img/2021/icons/eye-icon-lg.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/eye-icon-lg-white.png").'" alt="editor"></figure>';



                if($permission_role->delete == '2')
                {
                    if($id == $created_by)
                    {
                         $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteEmployee', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this Employee??\')"><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure>';
                    }
                }
                elseif($permission_role->delete == '3')
                {
                     if($id == $manager->manager_id)
                    {
                         $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteEmployee', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this Employee??\')"><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure>';
                    }
                }
                elseif($permission_role->delete == '4')
                {
                     if($id == $manager->manager_id || $id == $created_by)
                    {
                           $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteEmployee', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this Employee??\')"><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure>';
                    }
                }
               elseif($permission_role->delete == '5')
                {
                     $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteEmployee', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this Employee??\')"><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure>';
                    
                }
                $exit =EmployeeExit::where('employee_id', $row->id)->first();
                if(!$exit)
                {

                 $btn .= '<a class="btn btn-info site-icon exit-icon exitmodule" title="exit" data-id="'.$row->id. '" ><figure><img src="'.asset("/dist/img/2021/icons/exit.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/exit.png").'" alt="editor"></figure>';
                }
              
                $btn .= '</div>';
                return $btn;
                }
                
            })
                ->rawColumns([
                'action',
                'progress',
                'status'
            ])
                ->make(true);
        }
        return view('users.employees.listuser', compact('user_roles'));
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
    public function setPasswordEmployeePost(Request $request, $token)
    {
        $user = Employees::where('token', $token)->first();
        $validator = Validator::make($request->all(), [
            'password' => 'min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', $validator->errors()
                ->first());
        }

        $user->password = bcrypt($request->password);
        $user->token = null;
        if ($user->save()) {
            return redirect()->route('em-login')->with('success', 'Your account has been created successfully you can now log in.');
        } else {
            return redirect()->back()->with('error', 'Something Wrong. Try Again.');
        }
    }

    /**
     * Delete user.
     *
     * @params user_id
     */
    public function deleteUser($user_id)
    {
        $loginuser = Auth::user();
       
        if(!in_array('all_users', Session::get('permission')[0])){
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
        $obcandidates= ObCandidates::where('office_employee_id', '=', $user_id)->firstOrFail();
        $delete = $employee->delete();
        $delete_2 = $obcandidates->delete();
        if ($delete) {
            $delete_2 = $obcandidates->delete();
            return redirect('users/all-employees')->with('success', 'Employee deleted.');
        } else {
            return redirect()->route('allusers')->with('error', 'Something wrong. Try again.');
        }
    }

    public function showTest($test_id)
    {
        $can_test = CandidateTest::where('token', $test_id)->first();
        if ($can_test->status == '2') {
            echo 'Link has been expired. Please contact support.';
        } else if ($can_test->status == '3') {
            return view('front.test-view', compact('can_test', 'test_id'));
        } else {
            if (! empty($can_test->otp)) {
                return view('front.testotp', compact('can_test', 'test_id'));
            } else {
                return view('front.test', compact('can_test', 'test_id'));
            }
        }
    }

    public function checkTestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'test_token' => 'required',
            'otp' => 'required|min:4|max:4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $test_id = $request->test_token;
        $otp = $request->otp;
        $can_test = CandidateTest::where('token', $test_id)->first();
        if ($can_test) {
            if ($can_test->otp == $otp) {
                $can_test->otp = null;
                if ($can_test->save()) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Your otp verified you test will be start in few seconds.'
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
                    'message' => 'Invalid OTP. Please try another!'
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
    }

    public function saveFinalTest(Request $request)
    {}

    /**
     * Save test result and send email notification to candidate.
     */
    public function saveTestResult(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'test_token' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $test_id = $request->test_token;
        $can_test = CandidateTest::where('token', $test_id)->first();
        $candidate = Candidates::findOrFail($can_test->candidate_id);
        $can_test->pending_time = $request->pending_time;

        if ($request->TimeSave == 1) {
            if ($can_test->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => ''
                ]);
            }
        }

        $can_test->question_page = ($can_test->question_page) + 1;

        if ($request->finalsave == 1) {
            $can_test->status = 3;
        }

        $can_test->save();

        $finalResult = array();
        if (count($request->ans)) {
            foreach ($request->ans as $qid => $ans) {
                $testopt = CandidateTestOptions::where('id', $qid)->first();
                $testopt->candidate_answer = $ans;
                $testopt->save();
                if ($testopt->candidate_answer == $testopt->correct_answer) {
                    $finalResult[] = 1;
                }
            }
        }
        $can_test->result = count($finalResult);
        $can_test->save();

        if ($request->finalsave == 1) {

            $to_name = 'Manika';
            $to_email = 'hr@webguruz.in';
            $candidate_name =$can_test->candidate->full_name;
            $candidate_position =$can_test->candidate->position;
            $data = array(
                'name' => $to_name,
                'email' => $to_email,
                'candidate_name' => $can_test->candidate->full_name
                
            );

           print_r($can_test->candidate->full_name);
            
           Mail::send('emails.completed-aptitude-test', $data, function ($message) use ($to_name, $to_email,$candidate_name,$candidate_position) {
                $message->to($to_email, $to_name)->subject($candidate_name.' Completed Aptitude Test Round 1 - ' .$candidate_position);
            });
            $noti = new Notifications();
            $noti->type_id = 'test_complete';
            $noti->message = $can_test->candidate->full_name . ' has been completed assigned aptitude test.';
            $noti->page_id = $can_test->id;
            $noti->notify_type = 1;
            $noti->save();

            $totalp = $can_test->result * 100;
            $totalp = $totalp / count($can_test->questions);

            /*
             * Create new interview session
             */
            $canInterview = new CandidateInterviews();
            $canInterview->candidate_id = $can_test->candidate_id;
            // $canInterview->created_by = Auth::user()->id;
            $canInterview->save();

            $interStatus = 2;
            $candidate_status = 1;
            $message = 'Congratulations, you are shortlisted for next round.';
            $candidate->status = 3;
            $candidate->save();
            if ($totalp < 60) {
                $candidate_status = 2;
                $message = 'Better Luck next time. Please connect HR';
                $interStatus = 3;
                $candidate->status = 8;
                $candidate->save();
            }

            /*
             * Create interview 1st round
             */
            $canInterviewRound = new CandidateInterviewRounds();
            $canInterviewRound->interview_id = $canInterview->id;
            $canInterviewRound->interview_time = date('Y-m-d H:i:s');
            $canInterviewRound->status = $interStatus;
            $canInterviewRound->remarks = $message;
            $canInterviewRound->score = $can_test->result;
            $canInterviewRound->weight_age = $totalp;
            $canInterviewRound->save();

            $can_test->test_status = $candidate_status;
            $can_test->save();

            $candidate = Candidates::findOrFail($can_test->candidate_id);
            $candidate->test_status = $candidate_status;
            $candidate->save();

            $to_name = $candidate->full_name;
            $to_email = $candidate->email;
            $data = array(
                'name' => $to_name,
                'msg' => $message,
                'status' => $candidate_status,
                'test_url' => route('showTest', $can_test->token)
            );
            Mail::send('emails.send-test-result', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('Message from HRM');
            });

            if (! Mail::failures()) {
                return response()->json([
                    'status' => 200,
                    'message' => $message
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        }
    }

     public function generateTest(Request $request, $candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        if ($candidate) {

            if ($request->type == 3) {

                /*
                 * Create new interview session
                 */
                $canInterview = new CandidateInterviews();
                $canInterview->candidate_id = $candidate_id;
                $canInterview->save();

                /*
                 * Create interview 1st round
                 */
                $canInterviewRound = new CandidateInterviewRounds();
                $canInterviewRound->interview_id = $canInterview->id;
                $canInterviewRound->interview_time = date('Y-m-d H:i:s');
                $canInterviewRound->status = 2;
                $canInterviewRound->remarks = 'Skip Test';
                $canInterviewRound->score = 0;
                $canInterviewRound->weight_age = 2;

                if ($canInterviewRound->save()) {
                    return redirect()->route('allInterviews')->with('success', 'Candidate aptitude test skipped.');
                } else {
                    return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
                }
            } else {

                $can_test = new CandidateTest();
                $can_test->candidate_id = $candidate_id;
                $can_test->token = Str::random(32);
                $can_test->status = 1;
                $can_test->pending_time = '00:00';
                $can_test->type = $request->type;

                if ($request->type == 1) {
                    $can_test->otp = rand(1000, 9999);
                }
                // $can_test->interview_type = $can_test->type;
                $can_test->save();

                $questions = Questions::where('status', '1')->where('question_type', '1')->get()->random($this->questionLimit);
                if ($questions) {
                    foreach ($questions as $question) {
                        $can_test_ques = new CandidateTestOptions();
                        $can_test_ques->candidate_test_id = $can_test->id;
                        $can_test_ques->question_id = $question->id;
                        $can_test_ques->correct_answer = $question->answer;

                        $can_test_ques->save();
                    }
                }

                $to_name = $candidate->full_name;
                $to_email = $candidate->email;
                $data = array(
                    'name' => $to_name,
                    'addresslink' => ($can_test->type == 1) ? get_options('office_address_link') : '',
                    'otp' => $can_test->otp,
                    'test_url' => route('showTest', $can_test->token)
                );

                Mail::send('emails.test-invite', $data, function ($message) use ($to_name, $to_email) {
                    $message->to($to_email, $to_name)->subject('HRM Aptitude Quiz');
                });

                // Mail::send('emails.test-invite', $data, function ($message) use ($to_name, $to_email) {
                //     $message->to('sukhpal@webguruz.in', $to_name)->subject('HRM Aptitude Quiz');
                // });

                if (! Mail::failures()) {
                      $noti = new Notifications();
                    $noti->type_id = 'aptitude_sent';
                    $noti->message ='Aptitude test sent to '.$candidate->full_name.' <a target="_blank" style="margin-left: 23px;" href='.route('showTest', $can_test->token).'>Click Here</a>';
                    $noti->page_id = $can_test->id;
                    $noti->save();
                    return redirect()->route('allcandidates')->with('success', 'Test sent to candidate email address.');
                } 
                else {
                    return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
                }

                return redirect()->route('allcandidates')->with('success', 'Test sent to candidate email address.');
            }
        } else {
            return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
        }
    }

    public function addCandidate()
    {
        if(!in_array('add_candidate', Session::get('permission')[0])){
            abort(404);
        }
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        return view('users.candidates.add', compact('candidate_status', 'candidate_questions', 'candidate_relationship'));
    }

    public function addCandidatePost(Request $request)
    {
        $loginuser = Auth::user();
        $validator = Validator::make($request->all(), [
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
            'full_name.required' =>'Please fill the name',
            'mobile_number.required' =>'Please fill the mobile number',
            'mobile_number.unique' => 'Mobile number already exists',
            'mobile_number.digits' => 'Please enter 10 digits mobile number',
            'email.required' =>'Please fill the email',
            'gender.required' =>'Please select the gender',
            'status.required' => 'Please Select the status'


        ]);

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
                for ($ce = 0; $ce < count($candidate_education['institute_name']); $ce ++) {
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
                for ($ce = 0; $ce < count($candidate_employments['company_name']); $ce ++) {
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
                for ($ce = 1; $ce <= count($candidate_languages['english_id']); $ce ++) {
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
                for ($ce = 1; $ce <= count($candidate_other_informations['question_id']); $ce ++) {
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
                for ($ce = 0; $ce < count($candidate_families['name']); $ce ++) {
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

    public function editCandidate($candidate_id)
    {
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        $candidate = Candidates::where('id', $candidate_id)->first();
        return view('users.candidates.edit', compact('candidate', 'candidate_status', 'candidate_questions', 'candidate_relationship'));
    }

    public function editCandidatePost(Request $request)
    {
        $candidate_id = $request->get('candidate_id');

        $loginuser = Auth::user();
        $validator = Validator::make($request->all(), [
            'position' => 'required',
            'department' => 'required',
            'full_name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            // 'mobile_number' => 'unique:candidates,' . $candidate_id . '|mobile_number|required',
            'email' => 'unique:candidates,email,' . $candidate_id . '|email|required|regex:/(.+)@(.+)\.(.+)/i',
            'gender' => 'required',
            'status' => 'required',
            'upload_cv' => 'mimes:doc,pdf,docx'
        ],
        [
            'position.required' => 'Please enter position',
            'department.required' => 'Please select the department',
            'full_name.required'=> 'Please fill the name',
            'email.required' =>'Please fill the email',
            'gender.required'=> 'Please select gender'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $candidate = Candidates::where('id', $candidate_id)->first();
        try {

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

            // Save Skills
            $skill_name = explode(',', $request->get('skill_name'));
            if (count($skill_name) > 0) {
                $skillids = [];
                foreach ($skill_name as $skill) {
                    $c_skill = new CandidateSkills();
                    $c_skill->candidate_id = $candidate_id;
                    $c_skill->skill_name = $skill;
                    $c_skill->Save();
                    $skillids[] = $c_skill->id;
                }

                if (count($skillids) > 0) {
                    CandidateSkills::where('candidate_id', $candidate_id)->whereNotIn('id', $skillids)->delete();
                }
            }

            // Save Education
            $candidate_education = $request->get('candidate_education');
            if (count($candidate_education['institute_name']) > 0) {
                $canedu = [];
                for ($ce = 0; $ce < count($candidate_education['institute_name']); $ce ++) {
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
                        $canedu[] = $c_edu->id;
                    }
                }

                if (count($canedu) > 0) {
                    CandidateEducations::where('candidate_id', $candidate_id)->whereNotIn('id', $canedu)->delete();
                }
            }

            // Save Employments
            $candidate_employments = $request->get('candidate_employments');
            if (count($candidate_employments['company_name']) > 0) {

                $empids = [];
                for ($ce = 0; $ce < count($candidate_employments['company_name']); $ce ++) {
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
                        $empids[] = $c_emp->id;
                    }
                }

                if (count($empids) > 0) {
                    CandidateEmployments::where('candidate_id', $candidate_id)->whereNotIn('id', $empids)->delete();
                }
            }

            // Save Languages
            $candidate_languages = $request->get('candidate_languages');
            if (count($candidate_languages['english_id']) > 0) {
                $langids = [];
                for ($ce = 1; $ce <= count($candidate_languages['english_id']); $ce ++) {
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
                        $langids[] = $c_lang->id;
                    }
                }

                if (count($langids) > 0) {
                    CandidateLanguages::where('candidate_id', $candidate_id)->whereNotIn('id', $langids)->delete();
                }
            }

            // Save Other infomations
            $candidate_other_informations = $request->get('candidate_other_informations');
            if (count($candidate_other_informations['question_id']) > 0) {
                $otherids = [];
                for ($ce = 1; $ce <= count($candidate_other_informations['question_id']); $ce ++) {
                    $question_id = $candidate_other_informations['question_id'][$ce];
                    $status = $candidate_other_informations['status'][$ce];
                    $reason = ($status) ? $candidate_other_informations['reason'][$ce] : "";

                    $c_other = new CandidateOtherInformations();
                    $c_other->candidate_id = $candidate_id;
                    $c_other->question_id = $question_id;
                    $c_other->status = $status;
                    $c_other->reason = $reason;
                    $c_other->Save();
                    $otherids[] = $c_other->id;
                }

                if (count($otherids) > 0) {
                    CandidateOtherInformations::where('candidate_id', $candidate_id)->whereNotIn('id', $otherids)->delete();
                }
            }

            // Save Familes
            $candidate_families = $request->get('candidate_families');
            if (count($candidate_families['name']) > 0) {
                $famids = [];
                for ($ce = 0; $ce < count($candidate_families['name']); $ce ++) {
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
                        $famids[] = $c_famiily->id;
                    }

                    if (count($famids) > 0) {
                        CandidateFamilies::where('candidate_id', $candidate_id)->whereNotIn('id', $famids)->delete();
                    }
                }
            }

            // Save Accessments
            $candidate_assessments = $request->get('candidate_assessments');
            if (count($candidate_assessments) > 0) {
                $assids = [];
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
                        $assids[] = $c_assesment->id;
                    }

                    if (count($assids) > 0) {
                        CandidateAssessments::where('candidate_id', $candidate_id)->whereNotIn('id', $assids)->delete();
                    }
                }
            }

            // Save Assessment Sections
            $candidate_assessment_sections = $request->get('candidate_assessment_sections');
            if (count($candidate_assessment_sections) > 0) {
                $asssecids = [];
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
                        if ($weight_age) {
                            $c_assesment_section->weight_age = $weight_age;
                        }
                        $c_assesment_section->score = $score;
                        $c_assesment_section->Save();
                        $asssecids[] = $c_assesment_section->id;
                    }

                    if (count($asssecids) > 0) {
                        CandidateAssessmentSections::where('candidate_id', $candidate_id)->whereNotIn('id', $asssecids)->delete();
                    }
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
            return response()->json([
                'status' => 401,
                'message' => $e->getMessage()
            ]);
        }
    }

  public function allCandidates(Request $request)
    {
        if(!in_array('all_candidates', Session::get('permission')[0])){
            abort(404);
        }
        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
        if($permission_role->view == '2')
        {
          $data = Candidates::where('created_by',Auth::user()->id)->orderBy('created_at', 'desc')->get();
        }
        elseif($permission_role->view =='3')
        {
            $employees = Employees::where('manager_id',Auth::user()->id)->pluck('id')->toArray();
            $data = Candidates::whereIn('created_by',$employees)->orderBy('created_at', 'desc')->get();
        }
        elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id',Auth::user()->id)->orWhere('id',Auth::user()->id)->pluck('id')->toArray();
            $data = Candidates::whereIn('created_by',$employees)->orderBy('created_at', 'desc')->get();
        }
        elseif ($permission_role->view == '5') {
           $data = Candidates::select('*');
        }

        if ($request->ajax()) {
            $loginuser = Auth::user();
            $results = DataTables::of($data)->addIndexColumn()
                ->addcolumn('select', function (Candidates $candidate) {
                return '<input type="checkbox" class="checkBoxClass" value="' . $candidate->email . '" />';
            })
                ->editcolumn('id', function (Candidates $candidate) {
                return 'HRM' . $candidate->id;
            })
                ->editcolumn('gender', function (Candidates $candidate) {
                return ($candidate->gender) ? Candidates::$gender[$candidate->gender] : '';
            })
                ->editcolumn('status', function (Candidates $candidate) {
                // return $candidate->candidate_status['status_name'];
                $emp = $candidate->candidate_status;
                return ($emp) ? $emp['status_name'] : '';
            })
                ->addcolumn('education', function (Candidates $candidate) {
                // return $candidate->educations->first()['professional_qualification'];
                $emp = $candidate->educations->first();
                return ($emp) ? $emp['professional_qualification'] : '';
            })
                ->addcolumn('current_employer', function (Candidates $candidate) {
                $emp = $candidate->employments->first();
                return ($emp) ? $emp['company_name'] : '';
            })
                ->editcolumn('department', function (Candidates $candidate) {
                return ($candidate->department) ? Candidates::$departments[$candidate->department] : '';
            })
                ->editcolumn('created_at', function ($row) {
                return date('d M, Y', strtotime($row->created_at));
            })
                ->editcolumn('date_of_interview', function ($row) {
                return ($row->date_of_interview) ? date('d M, Y', strtotime($row->date_of_interview)) : '';
            })
                ->addColumn('action', function ($row) {
                $role = loginUserRole();
                $id = Auth::user()->id;
                $created_by = $row->created_by;
                $manager =  Employees::where('id', $created_by)->first();
                $permission_role =Roles::where('id',Auth::user()->user_role)->first();
                $btn = '<div class="btn-group btn-group-sm">';
                $btn .= '<a class="btn btn-info site-icon eye-icon" title="View" href="' . route('candidateProfileView', $row->profile_id) . '" target="_blank" ><figure><img src="'.asset("/dist/img/2021/icons/eye-icon-lg.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/eye-icon-lg-white.png").'" alt="editor"></figure></a> ';
                //comment
                   $btn .= '<a class="btn btn-success site-icon comment-icon " style="color:#707070;" data-toggle="tooltip"
                     data-html="true"  data-original-title="Name:'.$row->full_name.'& Remarks:'.$row->remarks.'" title="Name:'.$row->full_name.'& Remarks:'.$row->remarks.'" ><figure><i class="fa fa-comment"></i></figure></a> ';

                if($permission_role->edit == '2')
                {
                    if($id == $created_by)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('candidateedit', $row->id) . '" ><figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure></a> ';
                    }
                }
                elseif($permission_role->edit == '3')
                {
                     if($id == $manager->manager_id)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('candidateedit', $row->id) . '" ><figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure></a> ';
                    }
                }
                elseif($permission_role->edit == '4')
                {
                     if($id == $manager->manager_id || $id == $created_by)
                    {
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('candidateedit', $row->id) . '" ><figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure></a> ';
                    }
                }
               elseif($permission_role->edit == '5')
                {
                   
                         $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('candidateedit', $row->id) . '" ><figure><img src="'.asset("/dist/img/2021/icons/pencil.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/pencil-white.png").'" alt="editor"></figure></a> ';
                    
                }
                if ($role == User::ROLE_RECRUITER) {

                    $btn .= '<a class="btn site-icon delete-icon title="Delete" style="background-color: #808080;border-color: #808080;color:#fff;" href="#" onclick="return confirm(\'You are not authorized with this permission please contact to HR for further.\')" ><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure></a> ';
                } else {
                    if($permission_role->delete == '2')
                {
                    if($id == $created_by)
                    {
                         $btn .= '<a class="btn btn-danger delete-icon site-icon" title="Delete" href="' . route('candidatedelete', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this candidate?\')" ><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure></a> ';
                    }
                }
                elseif($permission_role->delete == '3')
                {
                     if($id == $manager->manager_id)
                    {
                       $btn .= '<a class="btn btn-danger delete-icon site-icon" title="Delete" href="' . route('candidatedelete', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this candidate?\')" ><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure></a> ';
                    }
                }
                elseif($permission_role->delete == '4')
                {
                     if($id == $manager->manager_id || $id == $created_by)
                    {
                         $btn .= '<a class="btn btn-danger delete-icon site-icon" title="Delete" href="' . route('candidatedelete', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this candidate?\')" ><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure></a> ';
                    }
                }
               elseif($permission_role->delete == '5')
                {
                    $btn .= '<a class="btn btn-danger delete-icon site-icon" title="Delete" href="' . route('candidatedelete', $row->id) . '" onclick="return confirm(\'Are you sure you want to delete this candidate?\')" ><figure><img src="'.asset("/dist/img/2021/icons/delete.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/delete-white.png").'" alt="editor"></figure></a> ';
                    
                }

                    $dis = 'javascript:void(0)';
                    $onclck = '';
                    if ($row->status == 7) {
                        $dis = route('startOnboarding', $row->id);
                        $onclck = 'onclick="return confirm(\'Are you sure You want to start Onboarding?\')"';
                    }
                    $btn .= '<a class="btn btn-success site-icon menu-icon" title="Start Onboarding" href="' . $dis . '"   ' . $onclck . ' ><figure><img src="'.asset("/dist/img/2021/icons/menu.png").'" alt="editor">
                    <img src="'.asset("/dist/img/2021/icons/menu-overlay.png").'" alt="editor">
                    </figure></a> ';
                }
               $btn .= ' <a class="btn btn-warning wgz_send_aptutude site-icon paper-plane-icon"  title="Send Apptitute Test" href="javascript:void(0)"data-link="' . route('generateTest', $row->id) . '" ><figure><img src="'.asset("/dist/img/2021/icons/paper-plane.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/paper-plane-white.png").'" alt="editor"></figure></a> ';
               
               // $btn .= ' <a title="View Candidate" href="' . route('sendEmailCandidateProfile', $row->id) . '" class="edit btn btn-info btn-sm">Send Profile</a> ';
              
                $btn .= '</div>';

                return $btn;
            })
                ->rawColumns([
                'action',
                'select'
            ])
                ->make(true);
            $res = (array) $results;
            if ($request->get('export') != '-') {

                $res['original']['status'] = 'download';
                $items = $res['original']['data'];

                $name = 'candidates-' . time() . '.' . $request->get('export');
                $file = Excel::store(new CandidateCsvExport($items), $name);

                $res['original']['download_link'] = route('exportdownload', $name);
                return $res['original'];
            } else {
                $res['original']['status'] = '';
                return $res['original'];
            }
        }
        return view('users.candidates.list');
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
        if ($delete) {
            return redirect()->route('allcandidates')->with('success', 'Candidate deleted.');
        } else {
            return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
        }
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

    public function allCandidateTest(Request $request)
    {
        if(!in_array('review_aptitude_test', Session::get('permission')[0])){
            abort(404);
        }
         $permission_role =Roles::where('id',Auth::user()->user_role)->first();

          if($permission_role->view == '2')
            {
                $data = CandidateTest::with('candidate')->where('created_by',Auth::user()->id)->latest();
            }
            elseif($permission_role->view =='3')
            {

                $employees = Employees::where('manager_id',Auth::user()->id)->pluck('id')->toArray();
                $data = CandidateTest::with('candidate')->whereIn('created_by',$employees)->latest();
            }
            elseif ($permission_role->view == '4') {
                $employees = Employees::where('manager_id',Auth::user()->id)->orWhere('id',Auth::user()->id)->pluck('id')->toArray();
                $data = CandidateTest::with('candidate')->whereIn('created_by',$employees)->latest();
            }
            elseif ($permission_role->view == '5') {
              $data = CandidateTest::with('candidate')->latest();
            }
        if ($request->ajax()) {
           
            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('status', function (CandidateTest $candidate) {
                return CandidateTest::$status[$candidate->status];
            })
                ->editcolumn('candidate_id', function (CandidateTest $candidate) {
                if(isset($candidate->candidate->full_name))
                {
                     return $candidate->candidate->full_name . ' (' . $candidate->candidate->id . ')';
                }
                else
                {
                    return '-';
                }
               
            })
                 ->editcolumn('id', function ($row) {
                    $input = '<input type ="text" style="width:160px;" value ="https://hrm.webguruz.in/public/test/'.$row->token.'" readonly><button class="btn btn-primary edit"  data-id="https://hrm.webguruz.in/public/test/'.$row->token.'" > copy</button>';
                    $link ='<a style="cursor: pointer;" class="edit" title="click to copy" data-id="https://hrm.webguruz.in/public/test/'.$row->token.'" >https://hrm.webguruz.in/public/test/'.$row->token.'</a>';
                return $input ;
               
            })
                ->addColumn('action', function ($row) {
                $btn = '<div class="btn-group btn-group-sm">';
                if ($row->status == 3) {
                $btn .= '<a class="btn btn-info site-icon eye-icon" title="View" href="' . route('viewCandidateTest', $row->id) . '" target="_blank" ><figure><img src="'.asset("/dist/img/2021/icons/eye-icon-lg.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/eye-icon-lg-white.png").'" alt="editor"></figure></a> ';
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

    public function viewCandidateTest($test_id)
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
            'message' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $candidate_id = $request->get('candidate_id');
        $message = $request->get('message');

        $candidate = Candidates::findOrFail($candidate_id);

        $to_name = $candidate->full_name;
        $to_email = $candidate->email;
        $data = array(
            'messagedata' => $message,
            'name' => $to_name
        );
        Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_name, $to_email) {
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

    public function sendEmailCandidateProfile($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);

        $to_name = $candidate->full_name;
        $to_email = $candidate->email;
        $candidate->profile_token =  Str::random(16);
        $candidate->profile_token_date = date("Y-m-d H:i:s", strtotime('+48 hours'));
        $candidate->save();

        $data = array(
            'url' => route('candidateProfile', $candidate->profile_token),
            'candidate_view_url' => route('candidateProfileView', $candidate->profile_id),
            'name' => $to_name
        );
        Mail::send('emails.candidate-profile', $data, function ($message) use ($to_name, $to_email) {
            $message->to($to_email, $to_name)->subject('Thank you for applying the job.');
            $message->from('internaltesting24@gmail.com');
        });

        if (! Mail::failures()) {
            return redirect()->route('allcandidates')->with('success', 'Profile link sent to candidate email address.');
        } else {
            return redirect()->route('allcandidates')->with('error', 'Something wrong. Try again.');
        }
    }

    public function candidateProfile($token)
    {
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        $countries = Country::get(["name","id"]);
        $cities = City::get(["name","id"]);
        $states = State::get(["name","id"]);
        $candidate = Candidates::where('profile_token', $token)->whereNotNull('profile_token')
            ->whereDate('profile_token_date', '>=', date('Y-m-d H:i:s'))
            ->first();
        if ($candidate) {
            return view('front.candidate-profile', compact('candidate', 'candidate_status', 'candidate_questions', 'candidate_relationship','countries','cities','states'));
        }

        abort(404);
    }

    public function candidateProfilePost(Request $request)
    {
        $candidate_token = $request->get('candidate_token');

        $loginuser = Auth::user();
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
            'gender' => 'required',
            'residence_address' =>'required',
            'nationality'=>'required',
            'dob'=>'required',
            'place_of_birth'=>'required',

        ],
        [
          'full_name'=> 'Please enter fullname',
          'gender' =>'Please select gender'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        if ($request->file('upload_cv')) {
            $validator = Validator::make($request->all(), [
                'upload_cv' => 'mimes:pdf,doc,docx'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }
        if(empty($request->candidate_education['institute_name']['0'])){
             return response()->json([
                    'status' => 401,
                    'message' =>'Institute name cannot be blank'
                ]);
        }
        if(empty($request->candidate_education['professional_qualification']['0']))
        {
             return response()->json([
                    'status' => 401,
                    'message' =>'Qualification cannot be blank'
                ]);
        }
         if(empty($request->candidate_employments['company_name']['0']))
         {
             return response()->json([
                    'status' => 401,
                    'message' =>'company name cannot be blank'
                ]);
        }
        if(empty($request->candidate_employments['contact_details']['0']))
        {
             return response()->json([
                    'status' => 401,
                    'message' =>'company contact details cannot be blank'
                ]);
        }
          if(empty($request->candidate_employments['position']['0']))
          {
             return response()->json([
                    'status' => 401,
                    'message' =>'Position cannot be blank'
                ]);
        }
        if(empty($request->candidate_employments['reason_of_leaving']['0']))
        {
             return response()->json([
                    'status' => 401,
                    'message' =>'reason of leaving cannot be blank'
                ]);
        }
        if(empty($request->candidate_families['name']['0'])){
             return response()->json([
                    'status' => 401,
                    'message' =>'Family Name cannot be blank'
                ]);
        }
        if(empty($request->candidate_families['relationship']['0'])){
             return response()->json([
                    'status' => 401,
                    'message' =>'Family Relationship cannot be blank'
                ]);
        }

        // try {
        $candidate = Candidates::where('profile_token', $candidate_token)->first();
        // $candidate->user_id = $loginuser->id;
        $candidate->full_name = $request->get('full_name');
        $candidate->gender = $request->get('gender');
        // $candidate->position = $request->get('position');
        $candidate->marital_status = $request->get('marital_status');
        $candidate->residence_address = $request->get('residence_address');
        $candidate->passport_number = $request->get('passport_number');
        $candidate->nationality = $request->get('nationality');
        $candidate->dob = $request->get('dob');
        $candidate->age = $request->get('age');
        $candidate->country_id = $request->get('country');
        $candidate->city_id = $request->get('city');
        $candidate->state_id = $request->get('state');
        $candidate->place_of_birth = $request->get('place_of_birth');
        $candidate->marital_status = $request->get('marital_status');
        $candidate->hobbies = $request->get('hobbies');
        $candidate->link_status = '1';
        // $candidate->current_salary = $request->get('current_salary');
        // $candidate->expected_salary = $request->get('expected_salary');
        $candidate->save(); // Update Candidate table data

        $candidate_id = $candidate->id;

        // Save Skills
        $skill_name = explode(',', $request->get('skill_name'));
        if (count($skill_name) > 0) {
            $skillids = [];
            foreach ($skill_name as $skill) {
                $c_skill = new CandidateSkills();
                $c_skill->candidate_id = $candidate_id;
                $c_skill->skill_name = $skill;
                $c_skill->save();
                $skillids[] = $c_skill->id;
            }

            if (count($skillids) > 0) {
                CandidateSkills::where('candidate_id', $candidate_id)->whereNotIn('id', $skillids)->delete();
            }
        }

        // Save Education
        $candidate_education = $request->get('candidate_education');
        if (count($candidate_education['institute_name']) > 0) {
            $canedu = [];
            for ($ce = 0; $ce < count($candidate_education['institute_name']); $ce ++) {
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
                    $canedu[] = $c_edu->id;
                }
            }

            if (count($canedu) > 0) {
                CandidateEducations::where('candidate_id', $candidate_id)->whereNotIn('id', $canedu)->delete();
            }
        }

        // Save Employments
        $candidate_employments = $request->get('candidate_employments');
        if (count($candidate_employments['company_name']) > 0) {

            $empids = [];
            for ($ce = 0; $ce < count($candidate_employments['company_name']); $ce ++) {
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
                    $c_emp->save();
                    $empids[] = $c_emp->id;
                }
            }

            if (count($empids) > 0) {
                CandidateEmployments::where('candidate_id', $candidate_id)->whereNotIn('id', $empids)->delete();
            }
        }

        // Save Languages
        $candidate_languages = $request->get('candidate_languages');
        if (count($candidate_languages['english_id']) > 0) {
            $langids = [];
            for ($ce = 1; $ce <= count($candidate_languages['english_id']); $ce ++) {
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
                    $c_lang->save();
                    $langids[] = $c_lang->id;
                }
            }

            if (count($langids) > 0) {
                CandidateLanguages::where('candidate_id', $candidate_id)->whereNotIn('id', $langids)->delete();
            }
        }

        // Save Other infomations
        $candidate_other_informations = $request->get('candidate_other_informations');
        if (count($candidate_other_informations['question_id']) > 0) {
            $otherids = [];
            for ($ce = 1; $ce <= count($candidate_other_informations['question_id']); $ce ++) {
                $question_id = $candidate_other_informations['question_id'][$ce];
                $status = $candidate_other_informations['status'][$ce];
                $reason = ($status) ? $candidate_other_informations['reason'][$ce] : "";

                $c_other = new CandidateOtherInformations();
                $c_other->candidate_id = $candidate_id;
                $c_other->question_id = $question_id;
                $c_other->status = $status;
                $c_other->reason = $reason;
                $c_other->save();
                $otherids[] = $c_other->id;
            }

            if (count($otherids) > 0) {
                CandidateOtherInformations::where('candidate_id', $candidate_id)->whereNotIn('id', $otherids)->delete();
            }
        }

        // Save Familes
        $candidate_families = $request->get('candidate_families');
        if (count($candidate_families['name']) > 0) {
            $famids = [];
            for ($ce = 0; $ce < count($candidate_families['name']); $ce ++) {
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
                    $c_famiily->save();
                    $famids[] = $c_famiily->id;
                }

                if (count($famids) > 0) {
                    CandidateFamilies::where('candidate_id', $candidate_id)->whereNotIn('id', $famids)->delete();
                }
            }
        }

        if ($request->get('upload_cv_remove')) {
            $candidate->cv_file = null;
            $candidate->save();
        }

        /*
         * Upload cv
         */
        if ($file = $request->file('upload_cv')) {
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/cv/', $name)) {
                $candidate->cv_file = $name;
                $candidate->save();
            }
        }

        $can_test = new CandidateTest();
        $can_test->candidate_id = $candidate_id;
        $can_test->token = Str::random(32);
        $can_test->status = 1;
        $can_test->created_by = Auth::user()->id;
        $can_test->pending_time = '00:00';
        $can_test->type = 2;

        // $can_test->interview_type = $can_test->type;
        $can_test->save();

        $questions = Questions::where('status', '1')->get()->random($this->questionLimit);
        if ($questions) {
            foreach ($questions as $question) {
                $can_test_ques = new CandidateTestOptions();
                $can_test_ques->candidate_test_id = $can_test->id;
                $can_test_ques->question_id = $question->id;
                $can_test_ques->correct_answer = $question->answer;

                $can_test_ques->save();
            }
        }

        $to_name = $candidate->full_name;
        $to_email = $candidate->email;
        $data = array(
            'name' => $to_name,
            'addresslink' => ($can_test->type == 1) ? get_options('office_address_link') : '',
            'test_url' => route('showTest', $can_test->token)
        );

        Mail::send('emails.test-invite', $data, function ($message) use ($to_name, $to_email) {
            $message->to($to_email, $to_name)->subject('HRM Aptitude Quiz');
        });

        if (! Mail::failures()) {
            $noti = new Notifications();
            $noti->type_id = 'profile_updated';
            $noti->message = $candidate->full_name . ' has Updated profile';
            $noti->page_id = $candidate->id;
            $noti->save();
             return response()->json([
            'status' => 200,
            'message' => 'Profile updated.'
        ]);
        } else
          {
             return response()->json([
            'status' => 401,
            'message' => 'Error'
        ]);
           }

    }

    public function candidateProfileView($profile_id)
    {
        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;
        $candidate = Candidates::where('profile_id', $profile_id)->first();
        if ($candidate) {
            return view('front.candidate-profile-view', compact('candidate', 'candidate_status', 'candidate_questions', 'candidate_relationship'));
        }

        abort(404);
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
        $notifications = Notifications::where('notify_status', '1')->where('notify_type','!=', 3)->orderBy('id', 'DESC')->get();
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
        Excel::import(new EmployeesImport,request()->file('file'));
           
        return back();
    }

    public function passwordMail(Request $request)
       {
          Excel::import(new MailPasswordImport,request()->file('file'));   
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
        if($user->is_manager == '1' && $status == '0')  
        {
            return view('modals.allocate-manager', compact('status','user_id'));
        }
        else
        {

        $user->status = $request->status;
        $user->password= '';
        $user->save();
  
        return response()->json(['response'=>'deactive','success'=>'Status change successfully.']);
        }
        
       
    }

    public function changeEmployeeStatusPost(Request $request)
    {

        $new_manager = $request->new_manager;
        $user = Employees::find($request->user_id);
        $managers =Employees::where('manager_id', $request->user_id)->pluck('id')->toArray();
        foreach ($managers as $manager) 
        {
            $emp =Employees::where('id', $manager)->first();
            $emp->manager_id = $request->new_manager;
            $emp->save();
            
        }
        $user->status = $request->status;
        $user->password= '';
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
      $requests=OnboardRequests::pluck('candidate_name')->toArray();
      $candidate =ObCandidates::pluck('name')->toArray();
      $result=array_diff($candidate,$requests);
      $name= implode(",",$result);
      $to_email ='tamanna@webguruz.co.in';
      $email_subject = "Induction not completed";
      $email_content ="You haven't completed the induction of following profiles";
 
      $data = array(
        'email_subject' => $email_subject,
        'email_content' => $email_content,
        'name' =>$name

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
        $requests=OnboardRequests::where('status', '1')->pluck('candidate_name')->toArray();
        // print_r($requests);die();
            $name= implode(",",$requests);
            $to_email ='tamanna@webguruz.co.in';
            $email_subject = "Onboarding request";
            $email_content ="You haven't Approve the Onboarding request of following employees: ";

            $data = array(
                'email_subject' => $email_subject,
                'email_content' => $email_content,
                'name' =>$name

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
        if(!in_array('onboard_requests', Session::get('permission')[0])){
            abort(404);
        }
        if ($request->ajax()) {
            $data = OnboardRequests::get();
            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('status', function ($row) {
                    if($row->status == '1')
                    {
                        return 'Pending';                
                    }
                    else{
                        return 'Approved';
                    }
                return CandidateTest::$status[$candidate->status];
            })
                 ->editcolumn('link', function ($row) {
                       $btn = '<div class="btn-group btn-group-sm">';
                        $btn .= '<a class="btn btn-info site-icon eye-icon" title="View Profile" target="_blank" href="' .$row->link. '" ><figure><img src="'.asset("/dist/img/2021/icons/eye-icon-lg.png").'" alt="editor"><img src="'.asset("/dist/img/2021/icons/eye-icon-lg-white.png").'" alt="editor"></figure>';
                       
                        $btn .= '</div>';
                        return $btn;
            })
                
                ->addColumn('action', function ($row) {
                    if($row->status == '1'){
                        $btn = '<div class="btn-group btn-sm btn-group-sm">';
                        $btn .= '<a class="btn btn-warning" title="pending" href="' . route('approveOnboard', $row->id) . '"><b>Approve</b>';
                        $btn .= '</div>';
                       return $btn;
                    }
                    else{
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
    public function approveOnboard(Request $request,$user_id)
    {
        $onboard = OnboardRequests::where('id', $user_id)->first();
        $onboard->status ='2';
        if($onboard->save())
        {
           return redirect()->route('onboardRequests')->with('success', 'Onboarding request approved'); 
        }
    }
    public function viewReadinessTest($test_id)
    {
        $last = ReadinessAnswer::where('employee_id', $test_id)->latest()->first();
        $employee =Employees::where('id', $test_id)->first();
        if ($last) {
            return view('users.candidates.readiness.view', compact('last','employee'));
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
        $id =$request->resignation_id;
         $exit =EmployeeExit::where('employee_id', $id)->first();
         if($exit)
         {
           return response()->json([
                    'status' => 401,
                    'message' => 'Already In Progress'
                ]);

         }
         else
         {
           return view('modals.open-exit-popup-from-admin',compact('exit','id'));
         }
    }




}

 
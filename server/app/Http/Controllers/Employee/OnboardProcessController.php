<?php
namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ObTabs;
use App\Models\Candidates;
use App\Models\ObTabFields;
use App\Models\ObTabFieldOptions;
use App\Models\ObTabFieldRelations;
use App\Models\Notifications;
use App\Models\ObTabFieldData;
use Illuminate\Support\Facades\Validator;

use App\Models\ObCandidates;
use Illuminate\Support\Facades\File;
use PDF;
use Crypt;
use App\Models\Employees;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\CandidateQuestions;
use App\Models\OnboardRequests;
use Carbon\Carbon;
use Illuminate\Support\Facades\Session;
use App\Models\Roles;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;



class OnboardProcessController extends Controller
{

 
   public function onboardCandidates(Request $request)
    {

        $permissions = Session::get('permission');
        Log::info('My permissions >>>>',['total permissions are >', $permissions]);
        if (!is_array($permissions) || !isset($permissions[0]) || !in_array('onboarding_list', $permissions[0])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requests = OnboardRequests::pluck('candidate_name')->toArray();
        $candidate = ObCandidates::pluck('name')->toArray();
        $result = array_diff($candidate, $requests);

        $permission_role = Roles::find(Auth::user()->user_role);
        $viewLevel = $permission_role?->view;
        $data = [];

        switch ($viewLevel) {
            case '2':
                $data = ObCandidates::where('created_by', Auth::user()->id)->latest()->get();
                break;
            case '3':
                $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id');
                $data = ObCandidates::whereIn('created_by', $employees)->latest()->get();
                break;
            case '4':
                $employees = Employees::where('manager_id', Auth::user()->id)
                    ->orWhere('id', Auth::user()->id)
                    ->pluck('id');
                $data = ObCandidates::whereIn('created_by', $employees)->latest()->get();
                break;
            case '5':
                $data = ObCandidates::latest()->get();
                break;
        }

        // Optional: Transform department names
        $departments = [
            '1' => 'Digital Marketing',
            '2' => 'Buisness Development',
            '3' => 'Mobile Development',
            '4' => 'Web Designing',
            '5' => 'HR',
            '6' => 'Admin',
            '7' => 'Quality',
            '8' => 'Web Development',
            '10' => 'Content Writing',
        ];

        $transformed = $data->map(function ($item) use ($departments) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'job_title' => $item->job_title,
                'department' => $departments[$item->department] ?? 'Other',
                'date_of_joining' => date('Y-m-d', strtotime($item->date_of_joining)),
            ];
        });

        return response()->json([
            'data' => $transformed,
            'permissions' => [
                'view' => $viewLevel,
                'freeze_status' => Auth::user()->freeze_status,
            ],
        ]);
    }

    public function startOnboarding($candidate_id)
    {
        $candidate = Candidates::find($candidate_id);
        $date = date('Y-m-d');

        if ($candidate) {
            $onCan = new ObCandidates();
            $onCan->candidate_id = $candidate_id;
            $onCan->name = $candidate->full_name;
            $onCan->phone = $candidate->mobile_number;
            $onCan->email = $candidate->email;
            $onCan->job_title = $candidate->position;
            $onCan->date_of_joining = $date;
            $onCan->department = $candidate->department;
            $onCan->created_by = Auth::user()->id;
            $onCan->save();

           // return redirect()->route('onboardCandidates')->with('success', $candidate->full_name . " candidate is now on onboard.");
          return Redirect::route('onboardCandidates')->with('success', $candidate->full_name . " candidate is now on onboard.");
          Log::info('My onboardCandidates >>>>',['total candidates are >', $data]);
        } else {
            Log::info('My allcandidates >>>>',['total candidates are >']);
          return Redirect::route('allcandidates')->with('error', 'Something went wrong. Try again.');
        }
    }













// public function joinigFormSubmitOLD(Request $request)

//     {

//         // Log::info('kjsjhsbjfbsd',['jsdbjhbsd'=> $request]);
//         if ($request->has('name')) {
//             $validator = Validator::make($request->all(), [
//                 'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('date_of_joining')) {
//             $validator = Validator::make($request->all(), [
//                 'date_of_joining' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('job_title')) {
//             $validator = Validator::make($request->all(), [
//                 'job_title' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

       

//         if ($request->has('dob')) {
//             $validator = Validator::make($request->all(), [
//                 'dob' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }
//          if ($request->has('department')) {
//             $validator = Validator::make($request->all(), [
//                 'department' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('location')) {
//             $validator = Validator::make($request->all(), [
//                 'location' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('email')) {
//             $validator = Validator::make($request->all(), [
//                 'email' => 'required|regex:/(.+)@(.+)\.(.+)/i'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('current_address')) {
//             $validator = Validator::make($request->all(), [
//                 'current_address' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('permanent_address')) {
//             $validator = Validator::make($request->all(), [
//                 'permanent_address' => 'required'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('current_phone')) {
//             $validator = Validator::make($request->all(), [
//                 'current_phone' => 'required|digits:10'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }

//         if ($request->has('permanent_phone')) {
//             $validator = Validator::make($request->all(), [
//                 'permanent_phone' => 'required|digits:10'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => $validator->errors()
//                         ->first()
//                 ]);
//             }
//         }
//          if ($request->has('reference_0_contact')) {
//             $validator = Validator::make($request->all(), [
//                 'reference_0_contact' => 'digits:10'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Reference no. 0: Contact no. shoud be 10 digit no'
//                 ]);
//             }
//         }
//         if ($request->has('reference_1_contact')) {
//             $validator = Validator::make($request->all(), [
//                 'reference_1_contact' => 'digits:10'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Reference no. 1: Contact no. shoud be 10 digit no'
//                 ]);
//             }
//         }

//          if ($request->has('facebook')) {
//             $validator = Validator::make($request->all(), [
//                 'facebook' => 'url|regex:/http(?:s):\/\/(?:www\.)facebook\.com\/.+/i|nullable'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Facebook link is not valid'
//                 ]);
//             }
//         }
        
         
//          if ($request->has('instagram')) {
//             $validator = Validator::make($request->all(), [
//                 'instagram' => 'url|regex:/http(?:s):\/\/(?:www\.)instagram\.com\/.+/i|nullable'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Instagram link is not valid'
//                 ]);
//             }
//         }

//          if ($request->has('linkedin')) {
//             $validator = Validator::make($request->all(), [
//                 'linkedin' => 'url|regex:/http(?:s):\/\/(?:www\.)linkedin\.com\/.+/i|nullable'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'linkedin link is not valid'
//                 ]);
//             }
//         }

//         if ($request->has('twitter')) {
//             $validator = Validator::make($request->all(), [
//                 'twitter' => 'url|regex:/http(?:s):\/\/twitter\.com\/.+/i|nullable'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Twitter link is not valid'
//                 ]);
//             }
//         }

//         if ($request->has('reference_2_contact')) {
//             $validator = Validator::make($request->all(), [
//                 'reference_2_contact' => 'digits:10'
//             ]);

//             if ($validator->fails()) {
//                 return response()->json([
//                     'status' => 401,
//                     'message' => 'Reference no. 2: Contact no. shoud be 10 digit no'
//                 ]);
//             }
//         }

//         $id = $request->on_candidate_id;
//         $ob_candidate_id = $id;
//         Log::info('ob candidate id is ',['obcandidate '=> $ob_candidate_id]);
//         if (in_array($request->updated_by, array(
//             'hr',
//             'hr-emp'
//         ))) {
//             $ob_candidate_id = $request->on_candidate_id;
//         }

//         $candidate_questions = CandidateQuestions::all();
//         $candidate = ObCandidates::where('candidate_id', $ob_candidate_id)->first();
//          Log::info('my candidate id is ',['obcandidate '=> $candidate]);
//         $employee_id = Employees::where('id', $candidate->office_employee_id)->first();
//         if($employee_id)
//         {
//             if ($request->has('gender')) {
//                     $employee_id->gender = $request->gender;
//                     $employee_id->save();
//                 }
//         }
//         if ($candidate) {
//             if ($candidate->joining_form_status == 1) {

//                 // $candidate->joining_form_status = 2;
//                 if ($request->has('name')) {
//                     $candidate->name = $request->name;
//                 }
//                 if ($request->has('date_of_joining')) {
//                     $candidate->date_of_joining = ($request->date_of_joining) ? date('Y-m-d H:i:s', strtotime($request->date_of_joining)) : null;
//                 }
//                 if ($request->has('job_title')) {
//                     $candidate->job_title = $request->job_title;
//                 }
//                 if ($request->has('grade')) {
//                     $candidate->grade = $request->grade;
//                 }
//                 if ($request->has('department')) {
//                     $candidate->department = $request->department;
//                 }
//                 if ($request->has('blood_group')) {
//                     $candidate->blood_group = $request->blood_group;
//                 }
//                 if ($request->has('location')) {
//                     $candidate->location = $request->location;
//                 }
//                 if ($request->has('dob')) {
//                     $candidate->dob = $request->dob;
//                 }
//                 if ($request->has('nationality')) {
//                     $candidate->nationality = $request->nationality;
//                 }
//                 if ($request->has('email')) {
//                     $candidate->email = $request->email;
//                 }
//                 if ($request->has('referred_by')) {
//                     $candidate->referred_by = $request->referred_by;
//                 }
//                 if ($request->has('company_relatives_status')) {
//                     $candidate->company_relatives_status = 1; // $request->company_relatives_status;
//                 }
//                 if ($request->has('current_address')) {
//                     $candidate->current_address = $request->current_address;
//                 }
//                 if ($request->has('permanent_address')) {
//                     $candidate->permanent_address = $request->permanent_address;
//                 }
//                 if ($request->has('current_phone')) {
//                     $candidate->current_phone = $request->current_phone;
//                 }
//                 if ($request->has('permanent_phone')) {
//                     $candidate->permanent_phone = $request->permanent_phone;
//                 }
//                 if ($request->has('emergency_name')) {
//                     $candidate->emergency_name = $request->emergency_name;
//                 }
//                 if ($request->has('emergency_relation')) {
//                     $candidate->emergency_relation = $request->emergency_relation;
//                 }
//                 if ($request->has('emergency_contact')) {
//                     $candidate->emergency_contact = $request->emergency_contact;
//                 }
//                 if ($request->has('emergency_name_2')) {
//                     $candidate->emergency_name_2 = $request->emergency_name_2;
//                 }
//                 if ($request->has('emergency_relation_2')) {
//                     $candidate->emergency_relation_2 = $request->emergency_relation_2;
//                 }
//                 if ($request->has('emergency_contact_2')) {
//                     $candidate->emergency_contact_2 = $request->emergency_contact_2;
//                 }
//                 if ($request->has('date_of_marriage_anniversary')) {
//                     $candidate->date_of_marriage_anniversary = $request->date_of_marriage_anniversary;
//                 }
//                 if ($request->has('marital_status')) {
//                     $candidate->marital_status = $request->marital_status;
//                 }
//                 if ($request->has('spouse_name_profession')) {
//                     $candidate->spouse_name_profession = $request->spouse_name_profession;
//                 }
//                 if ($request->has('no_of_children')) {
//                     $candidate->no_of_children = $request->no_of_children;
//                 }
//                 if ($request->has('father_name')) {
//                     $candidate->father_name = $request->father_name;
//                 }
//                 if ($request->has('father_profession')) {
//                     $candidate->father_profession = $request->father_profession;
//                 }
//                 if ($request->has('father_age')) {
//                     $candidate->father_age = $request->father_age;
//                 }
//                 if ($request->has('mother_name')) {
//                     $candidate->mother_name = $request->mother_name;
//                 }
//                 if ($request->has('mother_profession')) {
//                     $candidate->mother_profession = $request->mother_profession;
//                 }
//                 if ($request->has('mother_age')) {
//                     $candidate->mother_age = $request->mother_age;
//                 }
//                 if ($request->has('id_proof')) {
//                     $candidate->id_proof = 1; // $request->id_proof;
//                 }
//                 if ($request->has('id_number')) {
//                     $candidate->id_number = $request->id_number;
//                 }
//                 if ($request->has('id_type')) {
//                     $candidate->id_type = $request->id_type;
//                 }

//                 if ($request->has('office_joining_date')) {
//                     $candidate->office_joining_date = $request->office_joining_date;
//                 }

//                 if ($request->has('date_of_reliveing')) {
//                     $candidate->date_of_reliveing = $request->date_of_reliveing;
//                 }

//                 if ($request->has('joining_salary')) {
//                     $candidate->id_type = $request->joining_salary;
//                 }

//                 if ($request->has('current_salary')) {
//                     $candidate->current_salary = $request->current_salary;
//                 }

//                 if ($request->has('company_relatives')) {
//                     if (empty($request->company_relatives)) {
//                         $request->company_relatives = [];
//                     }
//                     $candidate->company_relatives = json_encode(array_values($request->company_relatives)); // array
//                 }

//                 if ($request->has('employment_history')) {
//                     if (empty($request->employment_history)) {
//                         $request->employment_history = [];
//                     }
//                     $candidate->employment_history = json_encode(array_values($request->employment_history)); // array
//                 }

//                 if ($request->has('education')) {
//                     if (empty($request->education)) {
//                         $request->education = [];
//                     }
//                     $candidate->education = json_encode(array_values($request->education)); // array
//                 }

//                 if ($request->has('training')) {
//                     if (empty($request->training)) {
//                         $request->training = [];
//                     }
//                     $candidate->training = json_encode(array_values($request->training)); // array
//                 }

//                 if ($request->has('certifications')) {
//                     if (empty($request->certifications)) {
//                         $request->certifications = [];
//                     }
//                     $candidate->certifications = json_encode(array_values($request->certifications)); // array
//                 }

//                 if ($request->has('references')) {
//                     if (empty($request->references)) {
//                         $request->references = [];
//                     }
//                     $candidate->references = json_encode(array_values($request->references)); // array
//                 }

//                 if ($request->has('other_informations')) {
//                     if (empty($request->other_informations)) {
//                         $request->other_informations = [];
//                     }
//                     $candidate->other_informations = json_encode($request->other_informations); // array
//                 }

//                 if ($request->has('skype_id')) {
//                     $candidate->skype_id = $request->skype_id;
//                 }

//                 if ($request->has('basecamp_id')) {
//                     $candidate->basecamp_id = $request->basecamp_id;
//                 }

//                 if ($request->has('bank_account_holder_name')) {
//                     $candidate->bank_account_holder_name = $request->bank_account_holder_name;
//                 }

//                 if ($request->has('bank_name')) {
//                     $candidate->bank_name = $request->bank_name;
//                 }

//                 if ($request->has('bank_account_number')) {
//                     $candidate->bank_account_number = $request->bank_account_number;
//                 }

//                 if ($request->has('bank_branch_name')) {
//                     $candidate->bank_branch_name = $request->bank_branch_name;
//                 }

//                 if ($request->has('bank_city')) {
//                     $candidate->bank_city = $request->bank_city;
//                 }

//                 if ($request->has('bank_ifsc')) {
//                     $candidate->bank_ifsc = $request->bank_ifsc;
//                 }
//                 if ($request->has('facebook')) {
//                     $candidate->facebook = $request->facebook;
//                 }
//                 if ($request->has('linkedin')) {
//                     $candidate->linkedin = $request->linkedin;
//                 }
//                 if ($request->has('twitter')) {
//                     $candidate->twitter = $request->twitter;
//                 }
//                 if ($request->has('instagram')) {
//                     $candidate->instagram = $request->instagram;
//                 }

//                 if ($candidate->save()) {


//                     $candidateData = Candidates::where('id', $candidate->candidate_id)->first();
//                     // if ($request->updated_by != 'hr-emp') {
//                     $data = [
//                         'heading' => 'Employee Joining Form',
//                         'candidate' => $candidate,
//                         'candidate_questions' => $candidate_questions,
//                         'token' => $request->on_candidate_id,
//                         'candidateData' => $candidateData
//                     ];

//                   $filePath = public_path() . '/uploads/wgz-employees/HRM' . $candidate->id; 
//                     if (!file_exists($filePath)) {
//                           File::makeDirectory($filePath, 755, true);
//                      }
//                     $pdf = PDF::loadView('pdf.generate-joiningform', $data);

//                     $pdfName = 'joining-form-' . time() . '.pdf';
//                     $pdf->save($filePath . '/' . $pdfName);

//                     $fieldData = ObTabFieldData::where('ob_candidate_id', $candidate->id)->where('field_id', 71)->first();
//                     if (! $fieldData) {
//                         $fieldData = new ObTabFieldData();
//                     }
//                     $fieldData->field_id = 71;
//                     $fieldData->value = $pdfName;
//                     $fieldData->ob_candidate_id = $candidate->id;
//                     $fieldData->save();

//                     // }

//                     $message = '';
//                     if ($request->updated_by == 'hr') {
//                         $message = "Joining Details Added.";
//                     } else if ($request->updated_by == 'hr-emp') {
//                         $message = $request->updated_form;
//                     } else {
//                         $message = "Thank you for submit your details.";
//                     }

//                     return response()->json([
//                         'status' => 200,
//                         'message' => $message
//                     ]);
//                 } else {
//                     return response()->json([
//                         'status' => 401,
//                         'message' => 'Something Wrong. Try Again.'
//                     ]);
//                 }
//             }
//         } else {
//             return response()->json([
//                 'status' => 401,
//                 'message' => 'Something Wrong. Try Again.'
//             ]);
//         }
//     }


    public function joinigFormSubmit(Request $request)
    {
        Log::info('Request data:', $request->all());

        $section = $request->input('section');
        $updated_by = $request->input('updated_by', 'hr-emp');

        // Base validation
        $rules = [
            'on_candidate_id' => 'required',
            'updated_by' => 'nullable|in:hr,hr-emp',
        ];

        // Section-specific validation
        if ($section === 'personal') {
            $rules = array_merge($rules, [
                'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/',
                'job_title' => 'required|string|max:255',
                'grade' => 'nullable|string|max:50',
                'blood_group' => 'nullable|string|max:10',
                'location' => 'required|string|max:255',
                'dob' => 'required|date',
                'nationality' => 'nullable|string|max:100',
                'email' => 'required|regex:/(.+)@(.+)\.(.+)/i',
                'department' => 'required|string|max:255',
                'gender' => 'required|in:1,2',
                'date_of_joining' => 'nullable|date',
                'referred_by' => 'nullable|string|max:255',
                'company_relatives_status' => 'nullable|in:0,1',
                'skype_id' => 'nullable|string|max:255',
                'basecamp_id' => 'nullable|string|max:255',
                'facebook' => 'nullable|url|regex:/http(?:s):\/\/(?:www\.)facebook\.com\/.+/i',
                'linkedin' => 'nullable|url|regex:/http(?:s):\/\/(?:www\.)linkedin\.com\/.+/i',
                'twitter' => 'nullable|url|regex:/http(?:s):\/\/twitter\.com\/.+/i',
                'instagram' => 'nullable|url|regex:/http(?:s):\/\/(?:www\.)instagram\.com\/.+/i',
            ]);
        } elseif ($section === 'address') {
            $rules = array_merge($rules, [
                'current_address' => 'required|string|max:1000',
                'permanent_address' => 'required|string|max:1000',
                'current_phone' => 'required|digits:10',
                'permanent_phone' => 'required|digits:10',
            ]);
        } elseif ($section === 'contact') {
            $rules = array_merge($rules, [
                'emergency_name' => 'nullable|string|max:255',
                'emergency_relation' => 'nullable|string|max:255',
                'emergency_contact' => 'nullable|digits:10',
                'emergency_name_2' => 'nullable|string|max:255',
                'emergency_relation_2' => 'nullable|string|max:255',
                'emergency_contact_2' => 'nullable|digits:10',
            ]);
        } elseif ($section === 'other') {
            $rules = array_merge($rules, [
                'marital_status' => 'nullable|in:1,2',
                'spouse_name_profession' => 'nullable|string|max:255',
                'no_of_children' => 'nullable|integer|min:0',
                'father_name' => 'nullable|string|max:255',
                'father_profession' => 'nullable|string|max:255',
                'father_age' => 'nullable|integer|min:0',
                'mother_name' => 'nullable|string|max:255',
                'mother_profession' => 'nullable|string|max:255',
                'mother_age' => 'nullable|integer|min:0',
                'date_of_marriage_anniversary' => 'nullable|date',
            ]);
        } elseif ($section === 'employment') {
            $rules = array_merge($rules, [
                'employment_history' => 'required|array',
                'employment_history.*.fromto' => 'nullable|string|max:255',
                'employment_history.*.organisation' => 'nullable|string|max:255',
                'employment_history.*.responsibilities' => 'nullable|string|max:1000',
                'employment_history.*.position' => 'nullable|string|max:255',
                'employment_history.*.salary' => 'nullable|string|max:255',
                'employment_history.*.reason' => 'nullable|string|max:1000',
                'office_joining_date' => 'nullable|date',
                'date_of_reliveing' => 'nullable|date',
                'joining_salary' => 'nullable|string|max:255',
                'current_salary' => 'nullable|string|max:255',
            ]);
        } elseif ($section === 'education') {
            $rules = array_merge($rules, [
                'education' => 'required|array',
                'education.*.qualification' => 'nullable|string|max:255',
                'education.*.university' => 'nullable|string|max:255',
                'education.*.specialization' => 'nullable|string|max:255',
                'education.*.yop' => 'nullable|string|max:4',
                'education.*.grade' => 'nullable|string|max:255',
            ]);
        } elseif ($section === 'training') {
            $rules = array_merge($rules, [
                'training_info' => 'required|array',
                'training_info.*.course' => 'nullable|string|max:255',
                'training_info.*.location' => 'nullable|string|max:255',
                'training_info.*.conductedby' => 'nullable|string|max:255',
                'training_info.*.month' => 'nullable|string|max:255',
            ]);
        } elseif ($section === 'id') {
            $rules = array_merge($rules, [
                'id_type' => 'nullable|in:1,2,3,4',
                'id_number' => 'nullable|string',
            ]);
        } elseif ($section === 'references') {
            $rules = array_merge($rules, [
                'references' => 'required|array|size:2',
                'references.*.name' => 'required|string|max:255',
                'references.*.contact' => 'required|digits:10',
            ]);
        } elseif ($section === 'other_information') {
            $rules = array_merge($rules, [
                'candidate_questions' => 'required|array',
                'candidate_questions.*.id' => 'required|integer|exists:candidate_questions,id',
                'candidate_questions.*.question' => 'required|string',
                'candidate_questions.*.status' => 'required|in:0,1',
                'candidate_questions.*.reason' => 'required_if:status,1|string|max:1000',
            ]);
        } elseif ($section === 'bank_details') {
            $rules = array_merge($rules, [
                'bank_account_holder_name' => 'nullable|string|max:255',
                'bank_name' => 'nullable|string|max:255',
                'bank_account_number' => 'nullable|string|max:50',
                'bank_branch_name' => 'nullable|string|max:255',
                'bank_city' => 'nullable|string|max:255',
                'bank_ifsc' => 'nullable|string|max:11',
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid section specified.'
            ]);
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->toArray());
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }

        // Decode on_candidate_id
        $ob_candidate_id = null;
        try {
            $id = $request->on_candidate_id;
            if ($id === false) {
                Log::error('Invalid on_candidate_id format', ['on_candidate_id' => $request->on_candidate_id]);
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid candidate ID format.'
                ]);
            }
            $ob_candidate_id = $id;
            Log::info('Decoded ob_candidate_id:', ['ob_candidate_id' => $ob_candidate_id]);

            // Consistent decoding for hr/hr-emp
            if (in_array($updated_by, ['hr', 'hr-emp'])) {
                $ob_candidate_id =$id;
                Log::info('Using decoded ob_candidate_id for hr/hr-emp:', ['ob_candidate_id' => $ob_candidate_id]);
            }
        } catch (\Exception $e) {
            Log::error('Error decoding on_candidate_id:', ['error' => $e->getMessage(), 'on_candidate_id' => $request->on_candidate_id]);
            return response()->json([
                'status' => 401,
                'message' => 'Error processing candidate ID.'
            ]);
        }

        // Fetch candidate
        $candidate = ObCandidates::where('candidate_id', $ob_candidate_id)->first();
        if (!$candidate || $candidate->joining_form_status != 1) {
            Log::error('Candidate not found or invalid status:', ['ob_candidate_id' => $ob_candidate_id]);
            return response()->json([
                'status' => 401,
                'message' => 'Candidate not found or form status invalid.'
            ]);
        }

        // Update fields based on section
        if ($section === 'personal') {
            $candidate->name = $request->name;
            $candidate->job_title = $request->job_title;
            $candidate->grade = $request->grade;
            $candidate->blood_group = $request->blood_group;
            $candidate->location = $request->location;
            $candidate->dob = $request->dob ? date('Y-m-d', strtotime($request->dob)) : null;
            $candidate->nationality = $request->nationality;
            $candidate->email = $request->email;
            $candidate->department = $request->department;
            $candidate->date_of_joining = $request->date_of_joining ? date('Y-m-d H:i:s', strtotime($request->date_of_joining)) : null;
            $candidate->referred_by = $request->referred_by;
            $candidate->company_relatives_status = $request->company_relatives_status ? $request->company_relatives_status : 1; // in this we not sending anything like status that's why we passed condition
            $candidate->skype_id = $request->skype_id;
            $candidate->basecamp_id = $request->basecamp_id;
            $candidate->facebook = $request->facebook;
            $candidate->linkedin = $request->linkedin;
            $candidate->twitter = $request->twitter;
            $candidate->instagram = $request->instagram;

            if ($candidate->office_employee_id) {
                $employee = Employees::where('id', $candidate->office_employee_id)->first();
                if ($employee) {
                    $employee->gender = $request->gender;
                    $employee->save();
                } else {
                    Log::warning('Employee not found for office_employee_id:', ['office_employee_id' => $candidate->office_employee_id]);
                }
            } else {
                Log::warning('No office_employee_id for candidate:', ['ob_candidate_id' => $ob_candidate_id]);
            }
        } elseif ($section === 'address') {
            $candidate->current_address = $request->current_address;
            $candidate->permanent_address = $request->permanent_address;
            $candidate->current_phone = $request->current_phone;
            $candidate->permanent_phone = $request->permanent_phone;
        } elseif ($section === 'contact') {
            $candidate->emergency_name = $request->emergency_name;
            $candidate->emergency_relation = $request->emergency_relation;
            $candidate->emergency_contact = $request->emergency_contact;
            $candidate->emergency_name_2 = $request->emergency_name_2;
            $candidate->emergency_relation_2 = $request->emergency_relation_2;
            $candidate->emergency_contact_2 = $request->emergency_contact_2;
        } elseif ($section === 'other') {
            $candidate->marital_status = $request->marital_status;
            $candidate->spouse_name_profession = $request->spouse_name_profession;
            $candidate->no_of_children = $request->no_of_children;
            $candidate->father_name = $request->father_name;
            $candidate->father_profession = $request->father_profession;
            $candidate->father_age = $request->father_age;
            $candidate->mother_name = $request->mother_name;
            $candidate->mother_profession = $request->mother_profession;
            $candidate->mother_age = $request->mother_age;
            $candidate->date_of_marriage_anniversary = $request->date_of_marriage_anniversary ? date('Y-m-d', strtotime($request->date_of_marriage_anniversary)) : null;
        } elseif ($section === 'employment') {
            $candidate->employment_history = json_encode($request->employment_history ?: []);
            $candidate->office_joining_date = $request->office_joining_date ? date('Y-m-d', strtotime($request->office_joining_date)) : null;
            $candidate->date_of_reliveing = $request->date_of_reliveing ? date('Y-m-d', strtotime($request->date_of_reliveing)) : null;
            $candidate->joining_salary = $request->joining_salary;
            $candidate->current_salary = $request->current_salary;
        } elseif ($section === 'education') {
            $candidate->education = json_encode($request->education ?: []);
        } elseif ($section === 'training') {
            $candidate->training = json_encode($request->training_info ?: []);
        } elseif ($section === 'id') {
            $candidate->id_type = $request->id_type;
            $candidate->id_number = $request->id_number;
        } elseif ($section === 'references') {
            $candidate->references = json_encode($request->references ?: []);
        } elseif ($section === 'other_information') {
            foreach ($request->candidate_questions as $question) {
                $candidateQuestion = CandidateQuestions::where('id', $question['id'])
                    ->where('id', $ob_candidate_id)
                    ->first();
                if ($candidateQuestion) {
                    $candidateQuestion->status = $question['status'];
                    $candidateQuestion->reason = $question['reason'];
                    $candidateQuestion->save();
                } else {
                    CandidateQuestions::create([
                        'ob_candidate_id' => $ob_candidate_id,
                        'question' => $question['question'],
                        'status' => $question['status'],
                        'reason' => $question['reason'],
                    ]);
                }
            }
        } elseif ($section === 'bank_details') {
            $candidate->bank_account_holder_name = $request->bank_account_holder_name;
            $candidate->bank_name = $request->bank_name;
            $candidate->bank_account_number = $request->bank_account_number;
            $candidate->bank_branch_name = $request->bank_branch_name;
            $candidate->bank_city = $request->bank_city;
            $candidate->bank_ifsc = $request->bank_ifsc;
        }

        // Save candidate and generate PDF
        if ($candidate->save() || $section === 'other_information') {
            $candidateData = Candidates::where('id', $candidate->candidate_id)->first();
            $data = [
                'heading' => 'Employee Joining Form',
                'candidate' => $candidate,
                // 'candidate_questions' => CandidateQuestions::where('ob_candidate_id', $ob_candidate_id)->get(),
                'token' => $request->on_candidate_id,
                'candidateData' => $candidateData
            ];

            // $filePath = public_path() . '/Uploads/wgz-employees/HRM' . $candidate->id;
            // if (!file_exists($filePath)) {
            //     File::makeDirectory($filePath, 0755, true);
            // }
            // $pdf = PDF::loadView('pdf.generate-joiningform', $data);
            // $pdfName = 'joining-form-' . time() . '.pdf';
            // $pdf->save($filePath . '/' . $pdfName);

            // $fieldData = ObTabFieldData::where('ob_candidate_id', $candidate->id)->where('field_id', 71)->first();
            // if (!$fieldData) {
            //     $fieldData = new ObTabFieldData();
            // }
            // $fieldData->field_id = 71;
            // $fieldData->value = $pdfName;
            // $fieldData->ob_candidate_id = $candidate->id;
            // $fieldData->save();

            $message = $updated_by == 'hr' ? 'Joining Details Added.' :
                    ($updated_by == 'hr-emp' ? ($request->updated_form ?? 'Form updated.') : 'Thank you for submitting your details.');

            return response()->json([
                'status' => 200,
                'message' => $message
            ]);
        }

        Log::error('Failed to save candidate:', ['ob_candidate_id' => $ob_candidate_id]);
        return response()->json([
            'status' => 401,
            'message' => 'Something went wrong. Try again.'
        ]);
    }

}
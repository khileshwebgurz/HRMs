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
use Session;
use App\Roles;
use Illuminate\Support\Facades\Log;


class OnboardProcessController extends Controller
{

public function joinigFormSubmit(Request $request)

    {

        // Log::info('kjsjhsbjfbsd',['jsdbjhbsd'=> $request]);
        if ($request->has('name')) {
            $validator = Validator::make($request->all(), [
                'name' => 'required|max:25|regex:/^[a-zA-Z\s]+$/'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('date_of_joining')) {
            $validator = Validator::make($request->all(), [
                'date_of_joining' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('job_title')) {
            $validator = Validator::make($request->all(), [
                'job_title' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

       

        if ($request->has('dob')) {
            $validator = Validator::make($request->all(), [
                'dob' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }
         if ($request->has('department')) {
            $validator = Validator::make($request->all(), [
                'department' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('location')) {
            $validator = Validator::make($request->all(), [
                'location' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('email')) {
            $validator = Validator::make($request->all(), [
                'email' => 'required|regex:/(.+)@(.+)\.(.+)/i'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('current_address')) {
            $validator = Validator::make($request->all(), [
                'current_address' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('permanent_address')) {
            $validator = Validator::make($request->all(), [
                'permanent_address' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('current_phone')) {
            $validator = Validator::make($request->all(), [
                'current_phone' => 'required|digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }

        if ($request->has('permanent_phone')) {
            $validator = Validator::make($request->all(), [
                'permanent_phone' => 'required|digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }
        }
         if ($request->has('reference_0_contact')) {
            $validator = Validator::make($request->all(), [
                'reference_0_contact' => 'digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Reference no. 0: Contact no. shoud be 10 digit no'
                ]);
            }
        }
        if ($request->has('reference_1_contact')) {
            $validator = Validator::make($request->all(), [
                'reference_1_contact' => 'digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Reference no. 1: Contact no. shoud be 10 digit no'
                ]);
            }
        }

         if ($request->has('facebook')) {
            $validator = Validator::make($request->all(), [
                'facebook' => 'url|regex:/http(?:s):\/\/(?:www\.)facebook\.com\/.+/i|nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Facebook link is not valid'
                ]);
            }
        }
        
         
         if ($request->has('instagram')) {
            $validator = Validator::make($request->all(), [
                'instagram' => 'url|regex:/http(?:s):\/\/(?:www\.)instagram\.com\/.+/i|nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Instagram link is not valid'
                ]);
            }
        }

         if ($request->has('linkedin')) {
            $validator = Validator::make($request->all(), [
                'linkedin' => 'url|regex:/http(?:s):\/\/(?:www\.)linkedin\.com\/.+/i|nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'linkedin link is not valid'
                ]);
            }
        }

        if ($request->has('twitter')) {
            $validator = Validator::make($request->all(), [
                'twitter' => 'url|regex:/http(?:s):\/\/twitter\.com\/.+/i|nullable'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Twitter link is not valid'
                ]);
            }
        }

        if ($request->has('reference_2_contact')) {
            $validator = Validator::make($request->all(), [
                'reference_2_contact' => 'digits:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Reference no. 2: Contact no. shoud be 10 digit no'
                ]);
            }
        }

        $id = base64_decode($request->on_candidate_id);
        $ob_candidate_id = substr($id, 25);
        if (in_array($request->updated_by, array(
            'hr',
            'hr-emp'
        ))) {
            $ob_candidate_id = $request->on_candidate_id;
        }

        $candidate_questions = CandidateQuestions::all();
        $candidate = ObCandidates::where('id', $ob_candidate_id)->first();
        $employee_id = Employees::where('id', $candidate->office_employee_id)->first();
        if($employee_id)
        {
            if ($request->has('gender')) {
                    $employee_id->gender = $request->gender;
                    $employee_id->save();
                }
        }
        if ($candidate) {
            if ($candidate->joining_form_status == 1) {

                // $candidate->joining_form_status = 2;
                if ($request->has('name')) {
                    $candidate->name = $request->name;
                }
                if ($request->has('date_of_joining')) {
                    $candidate->date_of_joining = ($request->date_of_joining) ? date('Y-m-d H:i:s', strtotime($request->date_of_joining)) : null;
                }
                if ($request->has('job_title')) {
                    $candidate->job_title = $request->job_title;
                }
                if ($request->has('grade')) {
                    $candidate->grade = $request->grade;
                }
                if ($request->has('department')) {
                    $candidate->department = $request->department;
                }
                if ($request->has('blood_group')) {
                    $candidate->blood_group = $request->blood_group;
                }
                if ($request->has('location')) {
                    $candidate->location = $request->location;
                }
                if ($request->has('dob')) {
                    $candidate->dob = $request->dob;
                }
                if ($request->has('nationality')) {
                    $candidate->nationality = $request->nationality;
                }
                if ($request->has('email')) {
                    $candidate->email = $request->email;
                }
                if ($request->has('referred_by')) {
                    $candidate->referred_by = $request->referred_by;
                }
                if ($request->has('company_relatives_status')) {
                    $candidate->company_relatives_status = 1; // $request->company_relatives_status;
                }
                if ($request->has('current_address')) {
                    $candidate->current_address = $request->current_address;
                }
                if ($request->has('permanent_address')) {
                    $candidate->permanent_address = $request->permanent_address;
                }
                if ($request->has('current_phone')) {
                    $candidate->current_phone = $request->current_phone;
                }
                if ($request->has('permanent_phone')) {
                    $candidate->permanent_phone = $request->permanent_phone;
                }
                if ($request->has('emergency_name')) {
                    $candidate->emergency_name = $request->emergency_name;
                }
                if ($request->has('emergency_relation')) {
                    $candidate->emergency_relation = $request->emergency_relation;
                }
                if ($request->has('emergency_contact')) {
                    $candidate->emergency_contact = $request->emergency_contact;
                }
                if ($request->has('emergency_name_2')) {
                    $candidate->emergency_name_2 = $request->emergency_name_2;
                }
                if ($request->has('emergency_relation_2')) {
                    $candidate->emergency_relation_2 = $request->emergency_relation_2;
                }
                if ($request->has('emergency_contact_2')) {
                    $candidate->emergency_contact_2 = $request->emergency_contact_2;
                }
                if ($request->has('date_of_marriage_anniversary')) {
                    $candidate->date_of_marriage_anniversary = $request->date_of_marriage_anniversary;
                }
                if ($request->has('marital_status')) {
                    $candidate->marital_status = $request->marital_status;
                }
                if ($request->has('spouse_name_profession')) {
                    $candidate->spouse_name_profession = $request->spouse_name_profession;
                }
                if ($request->has('no_of_children')) {
                    $candidate->no_of_children = $request->no_of_children;
                }
                if ($request->has('father_name')) {
                    $candidate->father_name = $request->father_name;
                }
                if ($request->has('father_profession')) {
                    $candidate->father_profession = $request->father_profession;
                }
                if ($request->has('father_age')) {
                    $candidate->father_age = $request->father_age;
                }
                if ($request->has('mother_name')) {
                    $candidate->mother_name = $request->mother_name;
                }
                if ($request->has('mother_profession')) {
                    $candidate->mother_profession = $request->mother_profession;
                }
                if ($request->has('mother_age')) {
                    $candidate->mother_age = $request->mother_age;
                }
                if ($request->has('id_proof')) {
                    $candidate->id_proof = 1; // $request->id_proof;
                }
                if ($request->has('id_number')) {
                    $candidate->id_number = $request->id_number;
                }
                if ($request->has('id_type')) {
                    $candidate->id_type = $request->id_type;
                }

                if ($request->has('office_joining_date')) {
                    $candidate->office_joining_date = $request->office_joining_date;
                }

                if ($request->has('date_of_reliveing')) {
                    $candidate->date_of_reliveing = $request->date_of_reliveing;
                }

                if ($request->has('joining_salary')) {
                    $candidate->id_type = $request->joining_salary;
                }

                if ($request->has('current_salary')) {
                    $candidate->current_salary = $request->current_salary;
                }

                if ($request->has('company_relatives')) {
                    if (empty($request->company_relatives)) {
                        $request->company_relatives = [];
                    }
                    $candidate->company_relatives = json_encode(array_values($request->company_relatives)); // array
                }

                if ($request->has('employment_history')) {
                    if (empty($request->employment_history)) {
                        $request->employment_history = [];
                    }
                    $candidate->employment_history = json_encode(array_values($request->employment_history)); // array
                }

                if ($request->has('education')) {
                    if (empty($request->education)) {
                        $request->education = [];
                    }
                    $candidate->education = json_encode(array_values($request->education)); // array
                }

                if ($request->has('training')) {
                    if (empty($request->training)) {
                        $request->training = [];
                    }
                    $candidate->training = json_encode(array_values($request->training)); // array
                }

                if ($request->has('certifications')) {
                    if (empty($request->certifications)) {
                        $request->certifications = [];
                    }
                    $candidate->certifications = json_encode(array_values($request->certifications)); // array
                }

                if ($request->has('references')) {
                    if (empty($request->references)) {
                        $request->references = [];
                    }
                    $candidate->references = json_encode(array_values($request->references)); // array
                }

                if ($request->has('other_informations')) {
                    if (empty($request->other_informations)) {
                        $request->other_informations = [];
                    }
                    $candidate->other_informations = json_encode($request->other_informations); // array
                }

                if ($request->has('skype_id')) {
                    $candidate->skype_id = $request->skype_id;
                }

                if ($request->has('basecamp_id')) {
                    $candidate->basecamp_id = $request->basecamp_id;
                }

                if ($request->has('bank_account_holder_name')) {
                    $candidate->bank_account_holder_name = $request->bank_account_holder_name;
                }

                if ($request->has('bank_name')) {
                    $candidate->bank_name = $request->bank_name;
                }

                if ($request->has('bank_account_number')) {
                    $candidate->bank_account_number = $request->bank_account_number;
                }

                if ($request->has('bank_branch_name')) {
                    $candidate->bank_branch_name = $request->bank_branch_name;
                }

                if ($request->has('bank_city')) {
                    $candidate->bank_city = $request->bank_city;
                }

                if ($request->has('bank_ifsc')) {
                    $candidate->bank_ifsc = $request->bank_ifsc;
                }
                if ($request->has('facebook')) {
                    $candidate->facebook = $request->facebook;
                }
                if ($request->has('linkedin')) {
                    $candidate->linkedin = $request->linkedin;
                }
                if ($request->has('twitter')) {
                    $candidate->twitter = $request->twitter;
                }
                if ($request->has('instagram')) {
                    $candidate->instagram = $request->instagram;
                }

                if ($candidate->save()) {


                    $candidateData = Candidates::where('id', $candidate->candidate_id)->first();
                    // if ($request->updated_by != 'hr-emp') {
                    $data = [
                        'heading' => 'Employee Joining Form',
                        'candidate' => $candidate,
                        'candidate_questions' => $candidate_questions,
                        'token' => $request->on_candidate_id,
                        'candidateData' => $candidateData
                    ];

                  $filePath = public_path() . '/uploads/wgz-employees/HRM' . $candidate->id; 
                    if (!file_exists($filePath)) {
                          File::makeDirectory($filePath, 755, true);
                     }
                    $pdf = PDF::loadView('pdf.generate-joiningform', $data);

                    $pdfName = 'joining-form-' . time() . '.pdf';
                    $pdf->save($filePath . '/' . $pdfName);

                    $fieldData = ObTabFieldData::where('ob_candidate_id', $candidate->id)->where('field_id', 71)->first();
                    if (! $fieldData) {
                        $fieldData = new ObTabFieldData();
                    }
                    $fieldData->field_id = 71;
                    $fieldData->value = $pdfName;
                    $fieldData->ob_candidate_id = $candidate->id;
                    $fieldData->save();

                    // }

                    $message = '';
                    if ($request->updated_by == 'hr') {
                        $message = "Joining Details Added.";
                    } else if ($request->updated_by == 'hr-emp') {
                        $message = $request->updated_form;
                    } else {
                        $message = "Thank you for submit your details.";
                    }

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
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }
}
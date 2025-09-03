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
use Illuminate\Support\Facades\DB;



class OnboardProcessController extends Controller
{


    public function onboardCandidates(Request $request)
    {

        // $permissions = Session::get('permission');
        // Log::info('My permissions >>>>', ['total permissions are >', $permissions]);
        // if (!is_array($permissions) || !isset($permissions[0]) || !in_array('onboarding_list', $permissions[0])) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        $permissions = DB::table('permissions')
            ->pluck('permission_name') // only get permission names
            ->toArray();

        if (!in_array('Onboarding List', $permissions)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }


        $requests = OnboardRequests::pluck('candidate_name')->toArray();
        $candidate = ObCandidates::pluck('name')->toArray();
        $result = array_diff($candidate, $requests);

        $permission_role = Roles::find(Auth::user()->user_role);
      
        Log::info('My permission_role >>>>', [' permission_role are >', $permission_role]);
        
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


            Log::info('My viewLevel >>>>', [' viewLevel are >', $viewLevel]);

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

        Log::info('My transformed >>>>', [' transformed are >', $transformed]);
        Log::info('My freeze_status >>>>', [' freeze_status are >', Auth::user()->freeze_status]);
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
            Log::info('My onboardCandidates >>>>', ['total candidates are >', $data]);
        } else {
            Log::info('My allcandidates >>>>', ['total candidates are >']);
            return Redirect::route('allcandidates')->with('error', 'Something went wrong. Try again.');
        }
    }


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
                // 'references' => 'required|array|size:2',
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
                $ob_candidate_id = $id;
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
        }
        // refernces and other_information won't be working as with reference live site is also not working and for other_information
        // we don't have any kind of relation between candidateQuestions and Candidate table.
        elseif ($section === 'references') {
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
                        'candidate_id' => $ob_candidate_id,
                        'question_text' => $question['question'],
                        'answer_text' => $question['reason'], // Or whatever you want as the answer
                        // Add more fields only if they exist in your DB schema
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

            $message = $updated_by == 'hr' ? 'Joining Details Added.' : ($updated_by == 'hr-emp' ? ($request->updated_form ?? 'Form updated.') : 'Thank you for submitting your details.');

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


    public function onboardCandidatesView($candidate_id)
    {
        // Ensure folder exists
        $filePath = public_path() . '/uploads/wgz-employees/HRM' . $candidate_id;

        if (!File::exists($filePath)) {
            File::makeDirectory($filePath, 0777, true, true);
        }

        // Candidate data
        $candidate = ObCandidates::where('id', $candidate_id)->first();

        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        $candidateData = Candidates::where('id', $candidate->candidate_id)->first();
        $candidate_questions = CandidateQuestions::all();

        // Tabs + fields + field data
        $tabs = ObTabs::where('status', 1)
            ->with([
                'fields' => function ($q) {
                    $q->orderBy('sort', 'asc');
                },
                'fields.field',
                'fields.field.fielddata' => function ($query) use ($candidate_id) {
                    $query->where('ob_candidate_id', $candidate_id);
                }
            ])
            ->orderBy('sort', 'ASC')
            ->get();

        return response()->json([
            'candidate_id' => $candidate_id,
            'candidate' => $candidate,
            'candidateData' => $candidateData,
            'tabs' => $tabs,
            'candidate_questions' => $candidate_questions
        ]);
    }

    public function onboardingDownload($folder, $file)
    {
        $file_path = public_path() . '/uploads/wgz-employees/' . $folder . '/' . $file;
        return response()->download($file_path);
    }

      public function onboardingSaveFormPhotographData(Request $request)
    {
        $on_candidate_id = $request->on_candidate_id;

        // Create folder for files
        $filePath = public_path() . '/uploads/wgz-employees/HRM' . $on_candidate_id;

        if (! File::exists($filePath)) {
            File::makeDirectory($filePath, 0777, true, true);
        }

        $data = $request->image;
        $image_array_1 = explode(";", $data);
        $image_array_2 = explode(",", $image_array_1[1]);
        $data = base64_decode($image_array_2[1]);
        $image_name = 'photo-' . time() . '.png';

        $file = $filePath . '/' . $image_name;

        $fileDataMove = file_put_contents($file, $data);

        if ($fileDataMove) {
            $fieldData = ObTabFieldData::where('ob_candidate_id', $on_candidate_id)->where('field_id', 2)->first();

            if (! $fieldData) {
                $fieldData = new ObTabFieldData();
                $value = [];
            } else {
                $value = json_decode($fieldData->value);
            }

            $value[] = $image_name;

            $fieldData->field_id = 2;
            $fieldData->value = json_encode($value);
            $fieldData->ob_candidate_id = $on_candidate_id;
            $fieldData->save();

            return response()->json([
                'status' => 200,
                'message' => "Photograph Saved."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

      public function onboardingEmailTemp(Request $request)
    {
        $fieldData = ObTabFieldData::where('ob_candidate_id', $request->on_candidate_id)->where('field_id', $request->field_id)->first();
        if (! $fieldData) {
            $fieldData = new ObTabFieldData();
        }
        $field_id = $request->field_id;
        $candidate_id = $request->on_candidate_id;
        $fieldData->ob_candidate_id = $request->on_candidate_id;
        $fieldData->field_id = $field_id;

        $filePath = public_path() . '/uploads/wgz-employees/HRM' . $request->on_candidate_id;

        $candidate = ObCandidates::where('id', $candidate_id)->first();
        $candidateData = $candidate;

        $contentS = '';
        if ($field_id == 65) {

            $fieldDataContent = ObTabFieldData::where('ob_candidate_id', $request->on_candidate_id)->where('field_id', 25)->first();
            if ($fieldDataContent) {
                $contentS = $fieldDataContent->value;
            }

            $contentS = $request->textcontent;
        }

        $email_to = "";
        if ($field_id == 70) {
            $email_to = get_options('ca_email_email');
            $fieldDataContent = ObTabFieldData::where('ob_candidate_id', $request->on_candidate_id)->where('field_id', 60)->first();
            if (! $fieldDataContent) {
                $fieldDataContent = new ObTabFieldData();
            }
            $fieldDataContent->ob_candidate_id = $candidate_id;
            $fieldDataContent->field_id = 60;
            $fieldDataContent->value = 1;
            $fieldDataContent->updated_at = date('Y-m-d H:i:s');
            $fieldDataContent->save();
        }

        $fieldData->value = 1;
        $fieldData->updated_at = date('Y-m-d H:i:s');
        $fieldData->save();

        $data = $this->shortcodes($candidate, $candidateData, $contentS, $field_id);

        $heading = $data['subject'];
        $content = $data['content'];

        return view('modals.onboarding-emails', compact('email_to', 'heading', 'content'));
        // return view('modals.' . $request->emailtemp, compact('heading','content'));
    }

      /*
     * Delete form data
     *
     */
    public function onboardingDeleteData(Request $request)
    {
        $on_candidate_id = $request->on_candidate_id;
        $field_id = $request->field_id;
        $type = $request->type;
        $filename = $request->filename;

        $fieldData = ObTabFieldData::where('ob_candidate_id', $on_candidate_id)->where('field_id', $field_id)->first();
        if ($fieldData) {

            if ($type == 'multiple') {
                $value = json_decode($fieldData->value);
                $key = array_search($filename, $value);
                unset($value[$key]);
                $value = json_encode(array_values($value));
                $fieldData->value = $value;
                if ($fieldData->save()) {
                    return response()->json([
                        'status' => 200,
                        'message' => "File remove successfully."
                    ]);
                } else {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Something Wrong. Try Again.'
                    ]);
                }
            } else {

                if ($fieldData->delete()) {
                    return response()->json([
                        'status' => 200,
                        'message' => "File remove successfully."
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

    public function shortcodes($candidate, $candidateData, $contentS, $field_id)
    {
        $joiningDateTime = date('M d, Y H:i A', strtotime($candidate->date_of_joining));

        $departmentShort = Candidates::$departmentsShort[$candidate->department];
        $departmentFull = Candidates::$departments[$candidate->department];

        $emp_id = $candidate->office_employee_id;

        $fullname = $candidate->name;
        $firstname = explode(' ', $fullname);
        $firstname = $firstname[0];

        $CurrentDateFjSY = date('F, jS Y');
        $CurrentDatedmy = date('d-m-Y');
        $RefNo = 'WGT/' . $emp_id . '/' . $departmentShort;
        $EmployeeID = 'WGT-' . $emp_id;
        $Position = $candidate->job_title;
        $SalaryAnnual = $candidate->joining_salary;
        $SalaryMonthly = round($SalaryAnnual / 12);
        $Address = $candidate->permanent_address;

        $TotalExp = $candidate->total_experience;
        $UndertakingBond = 'Two years';
        if (($TotalExp > 0 && $TotalExp < 3)) {
            $UndertakingBond = 'One and half year';
        }

        $Department = $departmentFull;
        $DateofJoining = $joiningDateTime;

        $documentSample = array(
            8 => 'appointment_letter',
            10 => 'letter_of_undertaking',
            12 => 'job_agreement',
            14 => 'nda',
            65 => 'login_credentials',
            66 => 'important_details',
            67 => 'introductions',
            69 => 'warm_welcome',
            70 => "ca_email"
        );

        $documentSample = $documentSample[$field_id];

        // Generate letter
        $content = get_options($documentSample . '_content');
        $contentSubject = get_options($documentSample . '_heading');

        $code = [
            '{FirstName}',
            '{FullName}',
            '{CurrentDateFjSY}',
            '{CurrentDatedmy}',
            '{RefNo}',
            '{EmployeeID}',
            '{Position}',
            '{SalaryMonthly}',
            '{SalaryAnnual}',
            '{Address}',
            '{UndertakingBond}',
            '{Content}',
            '{Department}',
            '{DateofJoining}'
        ];
        $codevals = [
            $firstname,
            $fullname,
            $CurrentDateFjSY,
            $CurrentDatedmy,
            $RefNo,
            $EmployeeID,
            $Position,
            $SalaryAnnual,
            $SalaryMonthly,
            $Address,
            $UndertakingBond,
            $contentS,
            $Department,
            $DateofJoining
        ];

        $updateContent = str_replace($code, $codevals, $content);

        $updateSubject = str_replace($code, $codevals, $contentSubject);

        $data = [
            'title' => get_options($documentSample . '_heading'),
            'heading' => get_options($documentSample . '_heading'),
            'content' => $updateContent,
            'documentSample' => $documentSample,
            'subject' => $updateSubject
        ];
        return $data;
    }


      public function onboardingGenerateDoc(Request $request)
    {
        $fieldData = ObTabFieldData::where('ob_candidate_id', $request->on_candidate_id)->where('field_id', $request->field_id)->first();
        if (! $fieldData) {
            $fieldData = new ObTabFieldData();
        }
        $field_id = $request->field_id;
        $candidate_id = $request->on_candidate_id;
        $fieldData->ob_candidate_id = $request->on_candidate_id;
        $fieldData->field_id = $field_id;

        $filePath = public_path() . '/uploads/wgz-employees/HRM' . $request->on_candidate_id;

        $candidate = ObCandidates::where('id', $candidate_id)->first();
        $candidateData = $candidate->candidate;
        $contentS = '';
        $data = $this->shortcodes($candidate, $candidateData, $contentS, $field_id);

        $pdf = PDF::loadView('pdf.generate-document', $data);

        $pdfn = str_replace("_", "-", $data['documentSample']);

        $pdfName = $pdfn . '-' . time() . '.pdf';
        $pdf->save($filePath . '/' . $pdfName);

        $fieldData->value = $pdfName;

        $fieldData->updated_at = date('Y-m-d H:i:s');
        if ($fieldData->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Document generated."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


       /*
     * Send Employee joing form invite
     *
     */
    public function onboardingSendJoiningForm(Request $request)
    {
        $fieldData = ObTabFieldData::where('ob_candidate_id', $request->on_candidate_id)->where('field_id', $request->field_id)->first();
        if (! $fieldData) {
            $fieldData = new ObTabFieldData();
        }
        $fieldData->ob_candidate_id = $request->on_candidate_id;
        $fieldData->field_id = $request->field_id;
        $fieldData->value = 1;
        $fieldData->updated_at = date('Y-m-d H:i:s');

        if ($fieldData->save()) {

            $candidate = ObCandidates::where('id', $request->on_candidate_id)->first();
            $candidate->joining_form_status = 1;
            $candidate->save();

            $to_name = $candidate->name;
            $to_email = $candidate->email;

            $id = $request->on_candidate_id;
            $randomKey = Str::random(25);

            $token = base64_encode($randomKey . $id);

            $data = array(
                'name' => $to_name,
                'url' => route('joinigForm', $token)
            );

            Mail::send('emails.joining-form', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('HRM Joining Form');
            });

            if (! Mail::failures()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Joining form sent to candidate email."
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


    /*
     * Save Onboarding Form data
     *
     */
    public function onboardingSaveFormData(Request $request)
    { 

        $valArr = [];
        $valArrMsg = [];

        if ($request->file('wgz_field_2')) {
            $valArr['wgz_field_2'] = 'mimes:jpeg,jpg,png';
            $valArrMsg['wgz_field_2.mimes'] = 'Photograph field allowed jpeg, jpg, png images format';
        }

        if ($request->file('wgz_field_3')) {
            $valArr['wgz_field_3.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_3.*.mimes'] = 'Academic Record field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_4')) {
            $valArr['wgz_field_4.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_4.*.mimes'] = 'Pan Card field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_5')) {
            $valArr['wgz_field_5.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_5.*.mimes'] = 'Relieving Letter field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_6')) {
            $valArr['wgz_field_6.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_6.*.mimes'] = 'Experience Letter field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_7')) {
            $valArr['wgz_field_7.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_7.*.mimes'] = 'Salary Slips field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_9')) {
            $valArr['wgz_field_9.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_9.*.mimes'] = 'Appointment Letter field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_11')) {
            $valArr['wgz_field_11.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_11.*.mimes'] = 'Letter of Undertaking field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_13')) {
            $valArr['wgz_field_13.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_13.*.mimes'] = 'Job Agreement field allowed pdf, jpeg, jpg, png format';
        }

        if ($request->file('wgz_field_15')) {
            $valArr['wgz_field_15.*'] = 'mimes:pdf,jpeg,jpg,png';
            $valArrMsg['wgz_field_15.*.mimes'] = 'NDA field allowed pdf, jpeg, jpg, png format';
        }
        if ($request->file('wgz_field_73')) {
            $valArr['wgz_field_73'] = 'required';
            $valArrMsg['wgz_field_73.required'] = 'Please Add Aadhar Card photo';
        }

        $validator = Validator::make($request->all(), $valArr, $valArrMsg);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }


        // echo '<pre>';
        // print_r($request->all());
        // echo '</pre>';exit;

        $fields = ObTabFieldOptions::get();
        $on_candidate_id = $request->on_candidate_id;

        // Create folder for files
        $filePath = public_path() . '/uploads/wgz-employees/HRM' . $on_candidate_id;

        if (! File::exists($filePath)) {
            File::makeDirectory($filePath, 0777, true, true);
        }

        // exit();
        $tabfieldHtml = '';
        $isset = [];
        foreach ($fields as $field) {
            $value = '';
            $field_id = $field->id;
            $field_type = $field->type;

            $fieldData = ObTabFieldData::where('ob_candidate_id', $on_candidate_id)->where('field_id', $field_id)->first();
            if (! $fieldData) {
                $fieldData = new ObTabFieldData();
            }
            $postdata = $request->all();
            if (isset($postdata['wgz_field_' . $field_id])) {
                $isset[] = 'wgz_field_' . $field_id;
                switch ($field_type) {
                    case "1":
                        $value = $request->get('wgz_field_' . $field_id);
                        break;
                    case "2":
                        $value = $request->get('wgz_field_' . $field_id);
                        break;
                    case "3":
                        $value = $request->get('wgz_field_' . $field_id);
                        break;
                    case "4":
                        $value = $request->get('wgz_field_' . $field_id);
                        break;
                    case "5":
                       if ($request->hasFile('wgz_field_' . $field_id)) {
                            if (! $fieldData) {
                                $value = [];
                            } else {
                                $value = json_decode($fieldData->value);
                            }
                            $files = $request->file('wgz_field_' . $field_id);
                            foreach ($files as $file) {
                                $name = time() . '-' . $file->getClientOriginalName();
                                if ($file->move($filePath, $name)) {
                                    $value[] = $name;
                                }
                            }
                            $value = json_encode($value);
                        }


                        break;
                    case "6":
                        $value = $request->get('wgz_field_' . $field_id);
                        break;
                    case "7":

                        if ($request->hasFile('wgz_field_' . $field_id)) {
                            if (! $fieldData) {
                                $value = [];
                            } else {
                                $value = json_decode($fieldData->value);
                            }
                            $files = $request->file('wgz_field_' . $field_id);
                            foreach ($files as $file) {
                                $name = time() . '-' . $file->getClientOriginalName();
                                if ($file->move($filePath, $name)) {
                                    $value[] = $name;
                                }
                            }
                            $value = json_encode($value);
                        }

                        break;
                    default:
                        $value = $request->get('wgz_field_' . $field_id);
                }
            }

            if (! empty($value) || in_array($field_type, array(
                3
            ))) {
                $fieldData->field_id = $field_id;
                $fieldData->value = $value;
                $fieldData->ob_candidate_id = $on_candidate_id;
                $fieldData->save();
            }
        }


        return response()->json([
            'status' => 200,
            'message' => "Data successfully saved."
        ]);
    }

}

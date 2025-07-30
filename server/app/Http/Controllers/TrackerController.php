<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Candidates;
use App\Models\Roles;
use App\Models\Employees;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\CandidateStatus;
use App\Models\CandidateQuestions;


class TrackerController extends Controller
{
    // GET all candidates (filtered by permission)
    public function allCandidates(Request $request)
    {
        $user = Auth::user();
        $permissionRole = Roles::find($user->user_role);
        $query = Candidates::query();

        switch ($permissionRole->view) {
            case '2':
                $query->where('created_by', $user->id);
                break;
            case '3':
                $empIds = Employees::where('manager_id', $user->id)->pluck('id');
                $query->whereIn('created_by', $empIds);
                break;
            case '4':
                $empIds = Employees::where('manager_id', $user->id)->pluck('id')->push($user->id);
                $query->whereIn('created_by', $empIds);
                break;
            case '5':
                // unrestricted
                break;
            default:
                return response()->json(['message' => 'Unauthorized'], 403);
        }

        // search logic
        $searchTerm = $request->query('search');
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('full_name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('mobile_number', 'like', "%{$searchTerm}%")
                    ->orWhere('current_location', 'like', "%{$searchTerm}%");
            });
        }

        $perPage = $request->query('limit', 10);
        $page = $request->query('page', 1);

        $paginated = $query
            ->with(['candidate_status', 'educations', 'employments'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $data = $paginated->getCollection()->map(function ($c) use ($user, $permissionRole) {
            return [
                'id' => 'HRM' . $c->id,
                'full_name' => $c->full_name,
                'linked_in' => $c->linked_in ?: '-',
                'status' => $c->candidate_status->status_name ?? '',
                'education' => $c->educations->first()->professional_qualification ?? '',
                'current_employer' => $c->employments->first()->company_name ?? '',
                'created_at' => optional($c->created_at)?->format('d M, Y'),
                'date_of_interview' => optional($c->date_of_interview)?->format('d M, Y'),
                'email' => $c->email,
                'mobile_number' => $c->mobile_number,
                'notice_period' => $c->notice_period,
                'current_location' => $c->current_location,
                'action' => [
                    'view_url' => "/profile/{$c->profile_id}/view",
                    'edit_allowed' => $permissionRole->edit == '5' || $c->created_by == $user->id,
                    'edit_url' => "edit-candidate/{$c->id}",
                    'delete_allowed' => $permissionRole->delete == '5' || $c->created_by == $user->id,
                    'delete_url' => "/delete/{$c->id}",
                    'send_email_url' => "/send-email/{$c->id}"
                ]
            ];
        });

        // Log::info('My total_candidates >>>>',['total candidates are >', $data]);

        return response()->json([
            'data' => $data,
            'total' => $paginated->total(),
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
        ]);
    }

    // POST /check
    public function checkCandidateOLD(Request $request)
    {
        if ($request->has('email')) {
            $validator = Validator::make($request->all(), [
                'email' => 'regex:/(.+)@(.+)\.(.+)/i|unique:candidates,email'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => 401, 'message' => 'Email is invalid or already taken']);
            }
        }

        if ($request->has('mobile_number')) {
            $validator = Validator::make($request->all(), [
                'mobile_number' => 'digits:10|unique:candidates,mobile_number'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => 401, 'message' => 'Mobile number is invalid or already taken']);
            }
        }

        return response()->json(['status' => 200, 'message' => 'Valid']);
    }


   public function addCandidate()
    {
        $user = Auth::user();
        Log::info('Logged-in user', ['user' => $user]);

        $candidate_status = CandidateStatus::all();
        $candidate_questions = CandidateQuestions::all();
        $candidate_relationship = Candidates::$relationship;

        $permission_role = Roles::where('id', $user->user_role)->first();
        Log::info('Permission Role', ['permission_role' => $permission_role]);

        $can_add = $permission_role && $permission_role->add == '5';

        // =================== Assign To Logic (Dropdown) ===================
        $assign = collect(); // default empty collection

        if ($permission_role->add == '4') {
            $assign = Employees::where('manager_id', $user->id)
                ->orWhere('id', $user->id)
                ->select('id', 'name')
                ->get();
        } elseif ($permission_role->add == '5') {
            $all_roles = Roles::where('id', '!=', '2')->pluck('id')->toArray();
            $assign = Employees::whereIn('user_role', $all_roles)
                ->select('id', 'name')
                ->get();
        } else {
            $assign = Employees::where('manager_id', $user->id)
                ->select('id', 'name')
                ->get();
        }
        // ==================================================================

        Log::info('Assignable Employees', ['assign' => $assign]);

        return response()->json([
            'candidate_status' => $candidate_status,
            'candidate_questions' => $candidate_questions,
            'candidate_relationship' => $candidate_relationship,
            'can_add' => $can_add,
            'assignable_employees' => $assign,
        ]);
    }




    public function checkCandidate(Request $request)
    {
        $type = $request->type;

        if ($type === 'email' && $request->has('email')) {
            $validator = Validator::make($request->all(), [
                'email' => 'regex:/(.+)@(.+)\.(.+)/i|unique:candidates,email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Email already taken or invalid format',
                ]);
            }
        }

        if ($type === 'phone' && $request->has('mobile_number')) {
            $validator = Validator::make($request->all(), [
                'mobile_number' => 'digits:10|unique:candidates,mobile_number',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Mobile Number already taken or invalid',
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => '',
        ]);
    }


    public function addCandidatePost(Request $request)
    {
        $loginuser = Auth::user();

        if ($request->has('full_name')) {
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|regex:/^[a-zA-Z\s]+$/'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => false, 'message' => 'Name is required and must be valid'], 422);
            }
        }

        if ($request->has('linked_in')) {
            $validator = Validator::make($request->all(), [
                'linked_in' => 'nullable|regex:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => false, 'message' => 'LinkedIn URL is not valid'], 422);
            }
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = $loginuser->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please select to whom you would assign to'
                ], 401);
            }
            $created_by = $request->created_by;
        }

        try {
            $candidate = new Candidates();
            $candidate->user_id = $loginuser->id;
            $candidate->full_name = $request->get('full_name');
            $candidate->email = $request->get('email');
            $candidate->mobile_number = $request->get('mobile_number');
            $candidate->total_experience = $request->get('total_experience');
            $candidate->notice_period = $request->get('notice_period');
            $candidate->linked_in = $request->get('linked_in');
            $candidate->current_location = $request->get('current_location');
            $candidate->gender = $request->get('gender');
            $candidate->date_of_interview = $request->get('date');
            $candidate->position = $request->get('position');
            $candidate->profile_id = Str::random(16);
            $candidate->profile_token = Str::random(32);
            $candidate->remarks = $request->get('remarks');
            $candidate->created_by = $created_by;
            $candidate->status = 1;

            if ($request->has('date')) {
                $candidate->created_at = $request->get('date');
            }

            if ($request->hasFile('upload_cv')) {
                $file = $request->file('upload_cv');
                $name = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('uploads/cv/'), $name);
                $candidate->cv_file = $name;
            }

            $candidate->save();

            if ($request->input('submit') === 'send_mail') {
                $this->sendEmailCandidateProfile($candidate->id);
            }

            return response()->json([
                'status' => true,
                'message' => 'Candidate added successfully',
                'data' => $candidate
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Exception occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // POST /add
    public function addCandidatePostOLD29725(Request $request)
    {
        $user = Auth::user();
        $role = Roles::find($user->user_role);

        $createdBy = $role->add == '2' ? $user->id : ($request->created_by ?? null);
        if (!$createdBy) {
            return response()->json(['status' => 401, 'message' => 'Please assign to someone']);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email|unique:candidates,email',
            'mobile_number' => 'required|digits:10|unique:candidates,mobile_number',
            'linked_in' => 'nullable|regex:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $candidate = new Candidates();
        $candidate->user_id = $user->id;
        $candidate->full_name = $request->full_name;
        $candidate->email = $request->email;
        $candidate->mobile_number = $request->mobile_number;
        $candidate->notice_period = $request->notice_period;
        $candidate->linked_in = $request->linked_in;
        $candidate->current_location = $request->current_location;
        $candidate->gender = $request->gender;
        $candidate->profile_id = Str::random(16);
        $candidate->profile_token = Str::random(32);
        $candidate->position = $request->position;
        $candidate->remarks = $request->remarks;
        $candidate->date_of_interview = $request->date_of_interview;
        $candidate->created_by = $createdBy;
        $candidate->status = 1;

        if ($request->hasFile('upload_cv')) {
            $name = time() . '-' . $request->file('upload_cv')->getClientOriginalName();
            $request->file('upload_cv')->move(public_path('uploads/cv/'), $name);
            $candidate->cv_file = $name;
        }

        $candidate->save();

        if ($request->input('submit') === 'send_mail') {
            $this->sendEmailCandidateProfile($candidate->id);
        }

        return response()->json(['status' => 200, 'message' => 'Candidate added']);
    }

    // PUT /edit/{candidate_id}
    public function editCandidatePost(Request $request, $candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);

        $validator = Validator::make($request->all(), [
            'position' => 'required',
            'department' => 'required',
            'full_name' => 'required',
            'email' => "required|email|regex:/(.+)@(.+)\.(.+)/i|unique:candidates,email,$candidate_id",
            'gender' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $candidate->fill($request->only([
            'full_name',
            'email',
            'gender',
            'mobile_number',
            'position',
            'marital_status',
            'residence_address',
            'passport_number',
            'nationality',
            'dob',
            'age',
            'place_of_birth',
            'hobbies',
            'current_salary',
            'expected_salary',
            'remarks',
            'status',
            'date_of_interview',
            'interview_score',
            'interviewed_by',
            'sourcing',
            'department'
        ]));
        // Log::info('My total_candidates >>>>');
        $candidate->save();

        // You can also trigger updating skills, education, employments, etc., from here if needed.

        return response()->json(['status' => 200, 'message' => 'Candidate updated']);
    }

    // DELETE /delete/{candidate_id}
    public function deleteCandidate($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        $candidate->delete();

        return response()->json(['status' => 200, 'message' => 'Candidate deleted']);
    }

    // GET /send-email/{candidate_id}
    public function sendEmailCandidateProfile($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        $candidate->profile_token = Str::random(32);
        $candidate->profile_token_date = now()->addHours(48);
        $candidate->save();

        $to_email = $candidate->email;
        $to_name = $candidate->full_name;

        $data = [
            'url' => route('candidateProfile', $candidate->profile_token),
            'candidate_view_url' => route('candidateProfileView', $candidate->profile_id),
            'name' => $to_name,
        ];

        Mail::send('emails.candidate-profile', $data, function ($msg) use ($to_email, $to_name) {
            $msg->to($to_email, $to_name)->subject('Thank you for applying the job.');
        });

        return response()->json(['status' => 200, 'message' => 'Email sent']);
    }

    // GET /mail-to-hr
    public function mailToHr(Request $request)
    {
        $loginuser = Auth::user();
        $date = now()->format('Y-m-d');

        $candidates = Candidates::where('link_status', '0')
            ->whereDate('profile_token_date', $date)
            ->get();

        $data = ['candidates' => $candidates];
        Mail::send('emails.hr-mail', $data, function ($msg) use ($loginuser) {
            $msg->to($loginuser->email, $loginuser->name)->subject('Candidates not updated the profile');
        });

        return response()->json(['status' => 200, 'message' => 'Email sent to HR']);
    }
}

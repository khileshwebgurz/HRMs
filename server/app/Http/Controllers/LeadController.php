<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\FormsData;
use App\Models\FormRequests;
use App\Models\Forms;
use App\Models\Roles;
use App\Models\Candidates;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CareerDataExport;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    public function warmLeads(Request $request)
    {
        $user = Auth::user();
        $permission_role = Roles::find($user->user_role);

        if (!$permission_role || $permission_role->view == '1') {
            return response()->json([
                'success' => false,
                'message' => "You don't have permission to view. Please contact HR.",
                'data' => []
            ], 403);
        }

        $formRequestIds = FormRequests::where('form_id', 4)->pluck('id');

        // Get unique meta_keys for form fields
        $forms = FormsData::whereIn('form_request_id', $formRequestIds)
            ->get()
            ->unique('meta_key')
            ->pluck('meta_key');

        $search = $request->input('q', '');
        $filter = $request->input('status', '');

        $query = FormRequests::with('formData')->where('form_id', 4);
       
        if ($search !== '') {
            $matchedFormIds = FormsData::select('form_request_id')
                ->where('meta_value', 'like', '%' . $search . '%')
                ->groupBy('form_request_id')
                ->pluck('form_request_id');

            $query->whereIn('id', $matchedFormIds);
        }

        if ($filter !== '') {
            $query->where('job_application_status', 'like', '%' . $filter . '%');
        }

        $perPage = $request->input('per_page', 10);
        $leads = $query->orderBy('created_at', 'desc')->paginate($perPage);

         Log::info('my fucking query is >>',['leads'=> $leads]);


        // Transform each lead into a flat key-value array
        $transformedLeads = $leads->getCollection()->map(function ($lead) {
            $flat = [
                'id' => $lead->id,
                'created_at' => $lead->created_at->format('Y-m-d H:i:s'),
                'status' => $lead->job_application_status ?? 'Pending',
                'status_class' => $this->getStatusClass($lead->job_application_status),
            ];

            foreach ($lead->formData as $field) {
                $flat[$field->meta_key] = $field->meta_value;
            }

            return $flat;
        });

        return response()->json([
            'success' => true,
            'form_fields' => $forms,
            'data' => $transformedLeads,
            'total' => $leads->total(),
            'current_page' => $leads->currentPage(),
            'per_page' => $leads->perPage(),
        ]);
    }

    private function getStatusClass($status): string
    {
        $normalized = strtolower(trim((string)$status));

        return match ($normalized) {
            'shortlisted' => 'badge-success',
            'rejected' => 'badge-danger',
            'not interested', 'not_interested' => 'badge-dark',
            'pending' => 'badge-secondary',
            default => 'badge-secondary',
        };
    }

    public function viewForm(Request $request)
    {
        $id = $request->input('formid');
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $form = FormsData::where('form_request_id', $id)->get();

        return response()->json([
            'success' => true,
            'id' => $id,
            'form' => $form,
        ]);
    }

    public function followUp(Request $request)
    {
        $id = $request->input('formid');
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $formRequest = FormRequests::find($id);
        $formData = FormsData::where('form_request_id', $id)->get();

        return response()->json([
            'success' => true,
            'form_request' => $formRequest,
            'form_data' => $formData,
        ]);
    }

    public function changeStatus(Request $request)
    {
        $id = $request->input('formid');
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $formRequest = FormRequests::find($id);

        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        return response()->json([
            'success' => true,
            'form_request' => $formRequest,
        ]);
    }

    public function rejectPost(Request $request)
    {
        $id = $request->input('lead_id');
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $formRequest = FormRequests::find($id);
        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        $formRequest->job_application_status = '3'; // rejected code

        if ($formRequest->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Candidate Rejected."
            ]);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ]);
        }
    }

    public function bulkSendEmail(Request $request)
    {
        $rowsIds = $request->input('rows_ids');
        if (!$rowsIds || !is_array($rowsIds)) {
            return response()->json(['error' => 'Invalid or missing rows_ids'], 400);
        }

        $emails = implode(',', $rowsIds);

        // Instead of returning a view, return the emails to be used on frontend
        return response()->json([
            'success' => true,
            'emails' => $emails,
        ]);
    }

    public function bulkSendEmailSubmit(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email_to' => 'required',
        'email_subject' => 'required',
        'email_content' => 'required',
        'attachment' => 'nullable',
        'attachment.*' => 'file|max:5000', // allow multiple, optional
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'message' => $validator->errors()->first(),
        ]);
    }

    $email_to = explode(',', $request->input('email_to'));
    $email_subject = $request->input('email_subject');
    $email_content = $request->input('email_content');
    $attachments = $request->file('attachment'); // array or null

    foreach ($email_to as $to_email) {
        Mail::raw($email_content, function ($message) use ($email_subject, $to_email, $attachments) {
            $message->to($to_email)->subject($email_subject);

            if (!empty($attachments)) {
                foreach ((array) $attachments as $attachment) {
                    $message->attach($attachment->getRealPath(), [
                        'as' => $attachment->getClientOriginalName(),
                        'mime' => $attachment->getMimeType(),
                    ]);
                }
            }
        });
    }


    return response()->json([
        'status' => 200,
        'message' => "Email sent to selected users.",
    ]);
}


    public function shortlistedPost(Request $request)
    {
        $id = $request->input('lead_id');
        Log::info('my $id is >>',['id is >'=> $id]);
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $formRequest = FormRequests::find($id);

        Log::info('my $form request data is >>',['formRequest is >'=> $formRequest]);
        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        $formdata_name = FormsData::where('form_request_id', $id)->where('meta_key', 'name')->first();
        $formdata_email = FormsData::where('form_request_id', $id)->where('meta_key', 'email')->first();
        $formdata_phone = FormsData::where('form_request_id', $id)->where('meta_key', 'mobile')->first();
        $formdata_position = FormsData::where('form_request_id', $id)->where('meta_key', 'position')->first();

        $formRequest->job_application_status = '2'; 

        if ($formRequest->save()) {
            $to_name = $formdata_name->meta_value ?? 'Candidate';
            $to_email = $formdata_email->meta_value ?? null;

            if ($to_email) {
                $message = "Congratulations! You are Shortlisted. HR will contact you soon.";
                $data = [
                    'name' => $to_name,
                    'messagedata' => $message,
                ];
                Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_name, $to_email) {
                    $message->to($to_email, $to_name)->subject('Message from HRM');
                });
            }

            if (!Mail::failures()) {
                $candidate = new Candidates();
                $candidate->full_name = $formdata_name->meta_value ?? null;
                $candidate->email = $formdata_email->meta_value ?? null;
                $candidate->mobile_number = $formdata_phone->meta_value ?? null;
                $candidate->position = $formdata_position->meta_value ?? null;
                $candidate->status = '1';
                $candidate->profile_id = Str::random(16);
                if ($candidate->save()) {
                    return response()->json([
                        'status' => 200,
                        'message' => "Candidate Shortlisted."
                    ]);
                }
            }

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong while saving candidate. Try again.'
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Something went wrong. Try again.'
        ]);
    }

    public function notInterestedPost(Request $request)
    {
        $id = $request->input('lead_id');
        if (!$id) {
            return response()->json(['error' => 'Missing formid'], 400);
        }

        $formRequest = FormRequests::find($id);
        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        $formRequest->job_application_status = '4'; // not interested code

        if ($formRequest->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Candidate marked as not interested."
            ]);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ]);
        }
    }

    public function followUpPost(Request $request)
    {
        $id = $request->input('form_id');
        if (!$id) {
            return response()->json(['error' => 'Missing form_id'], 400);
        }

        // Example follow-up update (you can expand this as needed)
        $formRequest = FormRequests::find($id);
        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        $followUpDate = $request->input('interview_time');
        if ($followUpDate) {
            $formRequest->follow_up_date = $followUpDate;
        }

        if ($formRequest->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Follow-up date updated successfully.',
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Failed to update follow-up date.',
        ]);
    }

    public function changeStatusPost(Request $request)
    {
        $id = $request->input('form_id');
        $status = $request->input('jobstatus');

        if (!$id || !$status) {
            return response()->json(['error' => 'Missing form_id or jobstatus'], 400);
        }

        $formRequest = FormRequests::find($id);
        if (!$formRequest) {
            return response()->json(['error' => 'Form request not found'], 404);
        }

        $formdata_name = FormsData::where('form_request_id', $id)->where('meta_key', 'name')->first();
        $formdata_email = FormsData::where('form_request_id', $id)->where('meta_key', 'email')->first();
        $formdata_phone = FormsData::where('form_request_id', $id)->where('meta_key', 'mobile')->first();
        $formdata_position = FormsData::where('form_request_id', $id)->where('meta_key', 'position')->first();

        $formRequest->job_application_status = $status;

        if ($status == '1') { // shortlisted
            $to_name = $formdata_name->meta_value ?? 'Candidate';
            $to_email = $formdata_email->meta_value ?? null;

            if ($to_email) {
                $message = "Congratulations! You are Shortlisted";
                $data = [
                    'name' => $to_name,
                    'messagedata' => $message,
                ];

                Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_name, $to_email) {
                    $message->to($to_email, $to_name)->subject('Message from HRM');
                });
            }

            if (!Mail::failures()) {
                $candidate = new Candidates();
                $candidate->full_name = $formdata_name->meta_value ?? null;
                $candidate->email = $formdata_email->meta_value ?? null;
                $candidate->mobile_number = $formdata_phone->meta_value ?? null;
                $candidate->position = $formdata_position->meta_value ?? null;
                $candidate->status = '1';
                $candidate->profile_id = Str::random(16);
                $candidate->save();
            }
        }

        if ($formRequest->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Status Updated"
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Something went wrong. Try again.'
        ]);
    }

    public function exportCareer(Request $request)
    {
        $forms = Forms::get();
        $formRequestIds = FormRequests::where('form_id', 4)->pluck('id')->toArray();
        $metaKeys = FormsData::whereIn('form_request_id', $formRequestIds)->get()->unique('meta_key')->pluck('meta_key');

        $formRequests = FormRequests::with('formData')->where('form_id', 4)->latest()->get();

        $final = [];
        foreach ($formRequests as $request) {
            $v = $request->formData->toArray();
            $meta_keys = array_column($v, 'meta_key');
            $meta_values = array_column($v, 'meta_value');
            $final[] = array_combine($meta_keys, $meta_values);
        }

        $arr = [$metaKeys->toArray(), $final];

        return Excel::download(new CareerDataExport($arr), 'formsdata.xlsx');
    }
}

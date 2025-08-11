<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\FormsData;
use App\Models\FormRequests;
use App\Models\Forms;
use App\Models\Roles;
use App\Models\Candidates;
use App\Models\Employees;
use App\Exports\CareerDataExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Settings;
use PgSql\Lob;
use Validator;
use Session;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{


    public function warmLeads(Request $request)
    {

          //Log::info('My da eaddis >>>>', ['ussadader' => json_encode($request)]);
            $user = Auth::user();
            $permission_role = Roles::find($user->user_role);

            if (!$permission_role || $permission_role->view == '1') {
                return response()->json([
                    'status' => false,
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

            Log::info('transformedLeads>>>>', ['transformedLeads' => json_encode($transformedLeads)]);
               Log::info('forms>>>>', ['forms' => json_encode($forms)]);
                 
            return response()->json([
                'success' => true,
                'form_fields' => $forms,
                'data' => $transformedLeads,
                'total' => $leads->total(),
                'current_page' => $leads->currentPage(),
                'per_page' => $leads->perPage(),
            ]);
    }

    private function getStatusClass($status)
        {
            $normalized = strtolower(trim($status));

            switch ($normalized) {
                case 'shortlisted':
                    return 'badge-success';

                case 'rejected':
                    return 'badge-danger';

                case 'not interested':
                case 'not_interested': 
                    return 'badge-dark';

                case 'pending':
                    return 'badge-secondary';

                default:
                    return 'badge-secondary';
            }
        }


    public function viewForm(Request $request)
    {
        if ($request->ajax()) {
            $id = $request->get('formid');
            $form = FormsData::where('form_request_id', $id)->get();

            return response()->json([
                'id' => $id,
                'form' => $form,
            ]);
        }

        return response()->json(['error' => 'Bad Request'], 400);
    }

    public function followUp(Request $request)
    {
      if ($request->ajax()) {
        $id = $request->get('formid');
        $request = FormRequests::where('id', $id)->first();
        $form = FormsData::where('form_request_id', $id)->get();
        return view('modal.followup',compact('id','form','request'));
      }
    }

    public function changeStatus(Request $request)
    {
      if ($request->ajax()) {
        $id = $request->get('formid');
        $form = FormRequests::where('id', $id)->first();
      return view('modal.changestatus',compact('id','form'));
    }
    }

    public function rejectPost(Request $request)
    {
       if ($request->ajax()) {
        $id = $request->get('formid');
        $request = FormRequests::where('id', $id)->first();
        $request->job_application_status ='3';
         if ($request->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Candidate Rejected."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }

    }
    }


    public function bulkSendEmail(Request $request)
    {
        $rowsIds = $request->get('rows_ids');
        $type = $request->get('type');
        $page = $request->get('page');
       

        // if ($page == 'candidates') {
        // $allemails = Candidates::get();
        // }
        $emails = implode(',', $rowsIds);
        return view('modals.bulk_send_job_email', compact('emails'));
    }

     public function bulkSendEmailSubmit(Request $request)
    {
       
        $validator = Validator::make($request->all(), [
            'email_to' => 'required',
            'email_subject' => 'required',
            'email_content' => 'required',
            'attachment' => 'file|size:5000'
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
        $documents = $request->file('images');

        foreach ($email_to as $to_email) {

            $data = array(
                'email_subject' => $email_subject,
                'email_content' => $email_content,
                'document' => $documents
            );
            Mail::send('emails.bulk-email', $data, function ($message) use ($email_subject, $to_email , $documents) {
                $message->to($to_email)->subject($email_subject);
                if($documents){
                     foreach ($documents as $document){
                    $message->attach($document);
                }
                }
               
            });
        }

        return response()->json([
            'status' => 200,
            'message' => "Email send to selected users email address."
        ]);
    }


     public function shortlistedPost(Request $request)
    {
       if ($request->ajax()) {
        $id = $request->get('formid');
        $request = FormRequests::where('id', $id)->first();
        $formdata_name =FormsData::where('form_request_id', $id)->where('meta_key', 'name')->first();
        $formdata_email =FormsData::where('form_request_id', $id)->where('meta_key', 'email')->first();
        $formdata_phone =FormsData::where('form_request_id', $id)->where('meta_key', 'mobile')->first();
        $formdata_position =FormsData::where('form_request_id', $id)->where('meta_key', 'position')->first();
        $request->job_application_status ='2';
         if ($request->save()) {
            $to_name = $formdata_name->meta_value;
            $to_email = $formdata_email->meta_value;
            $message = "Congratulations! You are Shortlisted. HR will contact you soon.";
            $data = array(
                'name' => $to_name,
                'messagedata' => $message,
            );
            Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('Message from HRM');
            });

            if (! Mail::failures()) {
                $candidates = new Candidates();
                $candidates->full_name = $formdata_name->meta_value;
                $candidates->email = $formdata_email->meta_value;
                $candidates->mobile_number = $formdata_phone->meta_value;
                $candidates->position = $formdata_position->meta_value;
                $candidates->status = '1';
                $candidates->profile_id =Str::random(16);
                if($candidates->save()){
                    return response()->json([
                'status' => 200,
                'message' => "Candidate Shortlisted."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
                }
            }


    }
    }

    public function notinterestedPost(Request $request)
    {
       if ($request->ajax()) {
        $id = $request->get('formid');
        $request = FormRequests::where('id', $id)->first();
        $request->job_application_status ='4';
         if ($request->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Candidate is marked as not interested."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }

    }
    }

    public function followUpPost(Request $request)
    {
        $id = $request->get('form_id');
        if($request->has('test'))
        {
          $setting = Settings::where('key','follow_up_count')->first();
          $form = FormRequests::where('id', $id)->first();
          $form->follow_up_date = $request->interview_time;
          print_r($setting);die();
        }
        else
        {

        }
        
    }

    public function changeStatusPost(Request $request)
    {
        $id = $request->get('form_id');
        $status = $request->get('jobstatus');
        $formrequest = FormRequests::where('id', $id)->first();
        $formdata_name =FormsData::where('form_request_id', $id)->where('meta_key', 'name')->first();
        $formdata_email =FormsData::where('form_request_id', $id)->where('meta_key', 'email')->first();
        $formdata_phone =FormsData::where('form_request_id', $id)->where('meta_key', 'mobile')->first();
        $formdata_position =FormsData::where('form_request_id', $id)->where('meta_key', 'position')->first();
        $formrequest->job_application_status = $request->jobstatus;
        if($status == '1')
        {
            $to_name = $formdata_name->meta_value;
            $to_email = $formdata_email->meta_value;
            $message = "Congratulations! You are Shortlisted";
            $data = array(
                'name' => $to_name,
                'messagedata' => $message,
            );
            Mail::send('emails.send-message-candidate', $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)->subject('Message from HRM');
            });

            if (! Mail::failures()) {
                $candidates = new Candidates();
                $candidates->full_name = $formdata_name->meta_value;
                $candidates->email = $formdata_email->meta_value;
                $candidates->mobile_number = $formdata_phone->meta_value;
                $candidates->position = $formdata_position->meta_value;
                $candidates->status = '1';
                $candidates->profile_id =Str::random(16);
                $candidates->save();
            }
        }
        
        if ($formrequest->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Status Updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


  public function exportCareer(Request $request) 
    {

       $forms = Forms::get();
      $id = FormRequests::where('form_id', '=', 4)->pluck('id')->toArray();
      $data = FormsData::whereIn('form_request_id', $id)->get()->unique('meta_key')->pluck('meta_key');
        $y = FormRequests::with('formData')->where('form_id', '=', 4)->latest()->get();
        $cols = $data->toArray();
      foreach ($y as $value) {
            $v = $value->formData->toArray();
            $meta_keys = array_column($v, 'meta_key');
            $meta_values = array_column($v, 'meta_value');
            $final[] = array_combine($meta_keys, $meta_values);
      }
          $arr =[$cols,$final];
        return Excel::download(new CareerDataExport($arr), 'formsdata.xlsx');
    }

}

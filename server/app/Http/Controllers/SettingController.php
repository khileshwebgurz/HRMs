<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\Settings;
use App\Models\Helpdesk;
use App\Models\Employee_manager_team;
use App\Models\User;
use App\Models\Employees;
use App\Models\HelpdeskCategory;
use App\Models\Notifications;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{

    public function editSettings()
    {
        $settings = Settings::all();
        return response()->json(['status' => 200, 'data' => $settings]);
    }

    public function editSettingPost(Request $request)
    {
        $settings = $request->get('setting');

        foreach ($settings as $settingkey => $settingval) {
            $setting = Settings::where('key', $settingkey)->first();
            if (!$setting) {
                $setting = new Settings();
                $setting->key = $settingkey;
            }
            $setting->value = $settingval;
            $setting->updated_at = now();
            $setting->save();
        }

        return response()->json([
            'status' => 200,
            'message' => $request->get('form_name') . " updated."
        ]);
    }

    /** ================= EMPLOYEE TEAM ================== */
    public function employee_team()
    {
        $data = Employee_manager_team::latest()->get();

        $data->map(function ($row) {
            $employee = Employees::find($row->manager_name);
            $row->manager_name = $employee->name ?? '-';

            $emp = Employees::where('id', $row->created_by)->where('status', '1')->first();
            $row->created_by_name = $emp->name ?? '-';
            return $row;
        });

        return response()->json(['status' => 200, 'data' => $data]);
    }

    public function employee_team_add()
    {
        $employee = Employees::where('status', '1')->where('is_manager', '1')->get();
        return response()->json(['status' => 200, 'data' => $employee]);
    }

    public function employee_team_edit($id)
    {
        $employee_team = Employee_manager_team::find($id);
        $employee = Employees::where('status', '1')->where('is_manager', '1')->get();
        return response()->json([
            'status' => 200,
            'team' => $employee_team,
            'managers' => $employee
        ]);
    }

    public function employee_team_insert(Request $request)
    {

        $employee_team = new Employee_manager_team();
        $employee_team->team_name = $request->team_name;
        $employee_team->manager_name = $request->manager_name;
        $employee_team->created_by = Auth::id();
        $employee_team->save();
 
        return response()->json(['status' => 200, 'message' => 'Team created successfully']);
    }

    public function employee_team_update(Request $request, $id)
    {
        $tl_ids = $request->manager_name;
        $team_name = $request->team_name;

        $tl_name_email = Employees::where('id', $tl_ids)->where('status', '1')->first();
        $emp_name_email = Employees::where('manager_id', $tl_ids)->where('status', '1')->pluck('email', 'name')->toArray();
        $emp_id = Employees::where('manager_id', $tl_ids)->where('status', '1')->pluck('id')->toArray();

        $teamlead = Employee_manager_team::find($id);
        $mn = $teamlead->manager_name;

        $emp = Employees::where('manager_id', $mn)->where('status', '1')->pluck('id')->toArray();
        foreach ($emp as $values) {
            $emp_update = Employees::find($values);
            $emp_update->manager_id = $tl_ids;
            $emp_update->save();
        }

        $employee_team_update = Employee_manager_team::find($id);
        $employee_team_update->team_name = $team_name;
        $employee_team_update->manager_name = $tl_ids;
        $employee_team_update->created_by = Auth::id();
        $employee_team_update->update();

        // Send notification to new manager
        $noti = new Notifications();
        $noti->type_id = 'You Are New Manager';
        $noti->message = 'You have assigned new Manager.';
        $noti->page_id = $id;
        $noti->notify_to = $tl_ids;
        $noti->notify_from = Auth::id();
        $noti->notify_type = '2';
        $noti->save();

        // Send mail to manager
        if ($tl_name_email) {
            $tl_name = $tl_name_email->name;
            $tl_email = $tl_name_email->email;

            // $data = [
            //     'messagedata' => 'You have been appointed new manager.',
            //     'name' => $tl_name
            // ];
            // Mail::send('emails.employee_team_email', $data, function ($message) use ($tl_name, $tl_email) {
            //     $message->to($tl_email, $tl_name)->subject('Welcome! A new manager has just been assigned.');
            // });

            $data = [
                'messagedata' => 'You have been appointed new manager.',
                'name' => $tl_name,
                'team_name' => $team_name 
            ];
            Mail::send('emails.employee_team_email', $data, function ($message) use ($tl_name, $tl_email) {
                $message->to($tl_email, $tl_name)->subject('Welcome! A new manager has just been assigned.');
            });
            
        }

        // Notify employees
        foreach ($emp_id as $value) {
            $noti = new Notifications();
            $noti->type_id = 'Your New Manager';
            $noti->message = 'Now, ' . ($tl_name_email->name ?? '') . ' is your new manager.';
            $noti->page_id = $id;
            $noti->notify_to = $value;
            $noti->notify_from = Auth::id();
            $noti->notify_type = '3';
            $noti->notify_panel = '1';
            $noti->save();
        }

        return response()->json(['status' => 200, 'message' => 'Team updated successfully']);
    }

    public function employee_team_delete($id)
    {
        $employee_team_delete = Employee_manager_team::find($id);
        $employee_team_delete->delete();
        return response()->json(['status' => 200, 'message' => 'Team deleted successfully']);
    }

    /** ================= HELP DESK ================== */
    public function helpdesk()
    {
        $data = Helpdesk::latest()->get();

        $data->map(function ($row) {
            $category = HelpdeskCategory::find($row->category);
            $row->category_name = $category->category_name ?? '-';

            $emp = Employees::where('id', $row->created_by)->where('status', '1')->first();
            $row->created_by_name = $emp->name ?? '-';
            return $row;
        });

        return response()->json(['status' => 200, 'data' => $data]);
    }

    // public function helpdeskadd()
    // {
    //     $category = HelpdeskCategory::all();
    //     return response()->json(['status' => 200, 'categories' => $category]);
    // }

    public function helpdeskadd()
    {
        $category = HelpdeskCategory::all();
        return response()->json([
            'status' => 'success',
            'data' => $category
        ]);
    }


    public function helpinsert(Request $request)
    {
        $helpdesk = new Helpdesk();

       
        $helpdesk->question = $request->question;
        Log::info('question is ',['question'=> $helpdesk->question]);
        $helpdesk->answer = $request->answer;
        $helpdesk->category = $request->category;
        $helpdesk->created_by = Auth::id();
       
       
        $helpdesk->save();

         Log::info('id is ',['id'=>  $helpdesk->id]);
        return response()->json(['status' => 200, 'message' => 'Helpdesk entry added successfully']);
    }

    public function helpedit($id)
    {
        $helpedit = Helpdesk::find($id);
        $category = HelpdeskCategory::all();
        return response()->json(['status' => 200, 'helpdesk' => $helpedit, 'categories' => $category]);
    }

    public function helpupdate(Request $request, $id)
    {
        $helpdesk = Helpdesk::find($id);
        $helpdesk->question = $request->question;
        $helpdesk->answer = $request->answer;
        $helpdesk->category = $request->category;
        $helpdesk->update();

        return response()->json(['status' => 200, 'message' => 'Helpdesk entry updated successfully']);
    }

    public function helpdelete($id)
    {
        $helpdesk = Helpdesk::find($id);
        $helpdesk->delete();
        return response()->json(['status' => 200, 'message' => 'Helpdesk entry deleted successfully']);
    }

    public function helpdesk_search()
    {

        $categories = HelpdeskCategory::all();
        return response()->json(['status' => 200, 'categories' => $categories]);
    }

    // used this for searching
    public function helpdesk_search_query(Request $request)
    {
        $words = $request->search;
        $query = Helpdesk::where('question', 'like', '%' . $words . '%')->get();
        return response()->json(['status' => 200, 'data' => $query]);
    }

    public function helpdesk_search_answer($id)
    {
        $data_answer = Helpdesk::find($id);
        return response()->json(['status' => 200, 'data' => $data_answer]);
    }
}

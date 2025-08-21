<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Candidates;
use App\Models\CandidateImports;
use App\Imports\UserCsvImport;
use App\Imports\CandidateCsvImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;
use App\Models\Roles;
use App\Models\Employees;
use Illuminate\Support\Facades\Validator;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImportController extends Controller
{


    public function importUsers()
    {
        $loginuser = Auth::user();
        if (!in_array('import_users', Session::get('permission')[0])) {
            abort(404);
        }

        return view('users.bulk-import.user');
    }

    public function importUsersPost(Request $request)
    {
        $loginuser = Auth::user();
        $role = loginUserRole();
        if ($role != User::ROLE_ADMIN) {
            abort(404);
        }

        if ($files = $request->file('file')) {
            $file = $request->file('file');
            $validator = Validator::make([
                'file' => $file,
                'extension' => strtolower($file->getClientOriginalExtension())
            ], [
                'file' => 'required',
                'extension' => 'required|in:csv,xlsx'
            ]);

            if ($validator->fails()) {
                return back()->with('error', 'Please upload CSV or Xlsx format file only.');
            }
        } else {
            return back()->with('error', 'Please upload the file first.');
        }

        $csvUserImp = new UserCsvImport();
        Excel::import($csvUserImp, request()->file('file'));
        $totalRows = $csvUserImp->getRowCount();
        $success = $csvUserImp->getTotalSuccessCount();
        $failed = $csvUserImp->getRowFailCount();

        // Excel::import(new UserCsvImport(), request()->file('file'));
        $message = '<b>Total Rows:</b> ' . $totalRows . " | ";
        $message .= '<b>Success :</b> ' . $success . " | ";
        $message .= '<b>Fail :</b> ' . $failed;
        return redirect('users/all-users')->with('success', $message . "<br /> Users import successfully.");
    }



    public function importCandidates(Request $request)
    {

        // Permission check
        // if (!in_array('import_candidates', Session::get('permission')[0])) {
        //     return response()->json(['status' => 'error', 'message' => 'Permission denied.'], 403);
        // }

        $user = Auth::user();
        $role = Roles::find($user->user_role);
        $data = null;

        switch ($role->view) {
            case '2':
                $data = CandidateImports::where('user_id', $user->id);
                break;

            case '3':
                $employees = Employees::where('manager_id', $user->id)->pluck('id')->toArray();
                $data = CandidateImports::whereIn('user_id', $employees);
                break;

            case '4':
                $employees = Employees::where('manager_id', $user->id)
                    ->orWhere('id', $user->id)
                    ->pluck('id')
                    ->toArray();
                $data = CandidateImports::whereIn('user_id', $employees);
                break;

            case '5':
                $data = CandidateImports::query(); // all
                break;

            default:
                return response()->json(['status' => 'error', 'message' => 'Invalid view role.'], 400);
        }

        Log::info('my data value is >>', ['data is >>' => $data]);

        $imports = $data->latest()->get();
        Log::info('my import  value is >>', ['import is >>' => $imports]);
        // Transform for React Table
        $result = $imports->map(function ($item) use ($role) {

            return [
                'id' => $item->id,
                'file' => $item->file,
                'file_url' => asset('uploads/csv-import/' . $item->file),
                'total_rows' => $item->total ?? 0,
                'success_rows' => $item->success ?? 0,
                'fail_rows' => $item->failed ?? 0,
                'cron_status' => CandidateImports::$status[$item->cron_status] ?? 'Pending',
                'can_download' => $role->export == '1',
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }


    public function importCandidatesPost(Request $request)
    {
        $user = Auth::user();

        if (!$request->hasFile('file')) {
            return response()->json(['status' => 'error', 'message' => 'Please upload the file first.'], 400);
        }

        $file = $request->file('file');

        $validator = Validator::make([
            'file' => $file,
            'extension' => strtolower($file->getClientOriginalExtension()),
        ], [
            'file' => 'required|file',
            'extension' => 'required|in:csv,xlsx',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please upload CSV or XLSX format file only.',
            ], 422);
        }

        // Destination: public/uploads/csv-import
        $destinationPath = public_path('uploads/csv-import');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $fileName = time() . '-' . $file->getClientOriginalName();
        $file->move($destinationPath, $fileName);

        // Save import record
        $import = new CandidateImports();
        $import->file = $fileName;
        $import->user_id = $user->id;
        $import->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Candidate import file uploaded successfully.',
            'data' => [
                'file' => $fileName,
                'path' => url('uploads/csv-import/' . $fileName),
            ]
        ]);
    }

}
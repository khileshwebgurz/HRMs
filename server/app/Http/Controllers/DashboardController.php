<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Candidates;
use App\Models\Questions;
use App\Models\Employees;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Require authentication.
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

        public function dashboard()
        {
            $role = $this->loginUserRole(); 
            $loginUser = Auth::user();

            //Log::info('My >>>>', ['loginUser' => $loginUser]);

            $total_candidates = Candidates::count();

           // Log::info('My total_candidates >>>>', ['total_candidates' => $total_candidates]);

            $total_active_candidates = Candidates::whereIn('status', [2, 3, 4, 5, 7])->count();

             //  Log::info('My total_active_candidates >>>>', ['total_active_candidates' => $total_active_candidates]);
            $total_questions = Questions::where('status', '1')->count();

            //  Log::info('My total_questions >>>>', ['total_questions' => $total_questions]);
            $total_users = Employees::where('status', '1')->count();
             //   Log::info('My total_users >>>>', ['total_users' => $total_users]);
             
            return response()->json([
                'status' => 200,
                'data' => [
                    'total_candidates' => $total_candidates,
                    'total_active_candidates' => $total_active_candidates,
                    'total_questions' => $total_questions,
                    'total_users' => $total_users,
                ]
            ]);
        }

    
    private function loginUserRole()
    {
        return Auth::check() ? Auth::user()->user_role : '';
    }
}

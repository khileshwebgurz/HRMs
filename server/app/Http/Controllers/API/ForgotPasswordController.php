<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Models\Employees;
use Illuminate\Support\Facades\DB;
use App\Mail\PasswordResetMail;


class ForgotPasswordController extends Controller
{
   
    public function sendResetLinkEmail22(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        $resetUrl = env('FRONTEND_URL') . "/reset-password?email={$request->email}&token={$token}";

        Mail::to($request->email)->send(new PasswordResetMail($request->email, $resetUrl));

        return response()->json(['message' => 'Reset link sent to your email.']);
    }
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        // 👇 Add this line to generate the frontend reset URL
        $resetUrl = env('FRONTEND_URL') . "/reset-password?email={$request->email}&token={$token}";

        // Send the email and include $resetUrl
        Mail::send('emails.forgot-password', [
            'token' => $token,
            'email' => $request->email,
            'resetUrl' => $resetUrl // pass to the email view
        ], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset Password');
        });

        return response()->json(['message' => 'Reset link sent to your email.']);
    }
    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|exists:employees,email',
            'token'    => 'required',
            'password' => 'required|confirmed|min:6',
        ]);

        $reset = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            return response()->json(['message' => 'Invalid token!'], 400);
        }

        Employees::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
}

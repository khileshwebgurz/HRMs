<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Employees;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\Roles;
use App\Models\Permissions;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $employee = Employees::where('email', $request->email)->first();
        
        Log::info('My user emp  is >>>>', ['employee' => $employee]);

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check readiness_status
        if (!$employee->readiness_status) {
            return response()->json(['message' => 'User not ready. Complete readiness process first.'], 403);
        }

        // Get role and permissions
        $role = Roles::find($employee->user_role);

        $permissionIds = explode(',', trim($role->permissions, '[]'));
        $permissionSlugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();


        $token = $employee->createToken('AccessToken')->accessToken;

       


        $str =  str_replace(['[',']'], "", $permissionIds);
                $arr=[];
                foreach ($str as $permission)
                {
                     $all_permissions =Permissions::where('id',$permission)->first();
                     $slug = $all_permissions->slug;
                     $arr[] = $slug;
                }
        Session::push('permission',$arr);

        // Log::info('My permission data from login  is >>>>', ['permission' => Session::get('permission')]);

        // Send token in secure HttpOnly cookie and user data in response
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $employee->id,
                'email' => $employee->email,
                'name' => $employee->name,
                'role' => $role->name ?? null,
                'role_id' => $role->id ?? null,
                'user_role' => $employee->user_role,
                'permissions' => $permissionSlugs,
                'profile_pic' => $employee-> profile_pic,
            ]
        ])->cookie(
            'access_token',
            $token,
            60 * 24,
            null,
            null,
            true, // Secure (set to false if not using HTTPS locally)
            true, // HttpOnly
            false,
            'Strict'
        );
    }

    public function logout(Request $request)
    {

        $request->user()->token()->revoke();

        return response()->json(['message' => 'Logged out'])->cookie('access_token', '', -1);
    }
}

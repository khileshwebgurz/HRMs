<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckReadinessStatus
{
    public function handle(Request $request, Closure $next, ?string $guard = null)
    {
        $user = $guard ? Auth::guard($guard)->user() : Auth::user();

        if (!$user) {
            // If user is not authenticated, allow auth middleware to handle
            return $next($request);
        }

        if ($user->readiness_status) {
            return $next($request);
        }

        return response()->json([
            'status' => 403,
            'message' => 'User not ready. Complete readiness process first.',
            'redirect_url' => config('app.frontend_url') . '/company-policy'
        ], 403);
    }
}

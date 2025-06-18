<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class MatchOldPassword implements ValidationRule
{
    /**
     * Validate the password input against the authenticated user's password.
     *
     * @param  string  $attribute
     * @param  mixed   $value
     * @param  \Closure(string): void  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!Hash::check($value, Auth::user()->password)) {
            $fail('Your current password is not correct.');
        }
    }
}

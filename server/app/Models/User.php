<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $guard = 'employee';
    protected $table = 'employees';

    const ROLE_ADMIN = 1;

    const ROLE_RECRUITER = 2;

    const ROLE_HR = 3;

 
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'user_role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Laravel 10+ supports this
        ];
    }

    // ✅ Static role and gender mappings (as in Laravel 7 code)
    public static $gender = [
        1 => 'Male',
        2 => 'Female',
    ];

    public static $role = [
        1 => 'Admin (HR)',
        2 => 'Recruiter',
        // 3 => 'HR', // Uncomment if needed
    ];

    // ✅ Relationships
    public function role()
    {
        return $this->hasOne(Roles::class, 'id', 'user_role');
    }

    // ✅ Accessor to get gender label
    public function getGenderNameAttribute()
    {
        return self::$gender[$this->gender] ?? null;
    }

    // ✅ Accessor to get role label
    public function getRoleNameAttribute()
    {
        return self::$role[$this->user_role] ?? null;
    }

    // ✅ Static method to get formatted user data
    public static function getUserData($user)
    {
        return [
            'id' => $user->id,
            'name' => ucwords($user->name),
            'email' => $user->email,
            'phone' => $user->phone,
            'gender' => $user->gender,
            'gender_label' => self::$gender[$user->gender] ?? null,
            'role' => $user->user_role,
            'role_label' => self::$role[$user->user_role] ?? null,
        ];
    }
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
class Employees extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $guard = 'employee';
       public function obCandidates()
    {
        return $this->hasOne('App\Models\ObCandidates', 'id', 'employee_id');
    }


    protected $fillable = [
        'name',
        'email',
        'password',
        'user_role'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];
}
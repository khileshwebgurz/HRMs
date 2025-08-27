<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee_manager_team extends Model
{
    protected $table = 'employee_manager_team';
    protected $primaryKey = "id";
    // protected $fillable = ['id','employee_id','issue_type','issue_level','description'];

    public function manager()
    {
        // yaha 'manager_name' column me employee ka id store hai
        return $this->belongsTo(Employees::class, 'manager_name', 'id');
    }

}
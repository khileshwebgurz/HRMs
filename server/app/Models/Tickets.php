<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employees;

class Tickets extends Model
{
    protected $table = 'tickets';
    protected $primaryKey = "id";

    protected $fillable = [
        'id',
        'employee_id',
        'issue_type',
        'issue_level',
        'description'
    ];

    static $filterdata = [
        0 => 'Select Status',
        1 => 'Open',
        2 => 'Closed',
        3 => 'In Progress'
    ];

    public function employees_obj()
    {
        return $this->hasOne(Employees::class, 'id', 'employee_id');
    }
}

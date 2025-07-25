<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalarySlipsDetail extends Model
{
    protected $table = 'employee_salary_slips_detail';
    protected $primaryKey = "id";
    protected $fillable = ['id','employee_id','issue_type','issue_level','description'];

    static $emolument = [
        "basic" => [
            "label" => "Basic",
            "percentage" => "60"
        ],
        "hra" => [
            "label" => "House Rent Allowance(HRA)",
            "percentage" => "30"
        ],
        "conveyance_allowance" => [
            "label" => "Conveyance Allowance",
            "percentage" => "10"
        ],
        "other_incentives" => [
            "label" => "Other Incentives",
            "percentage" => "0"
        ]
        // ,
        // 'other_incentives' => 'Other Incentives',
        // 'gross_salary' => 'Gross Salary',
        // 'deductions' => 'Deductions',
        // 'fund' => 'Fund',
        // 'bonus' => 'Bonus',
        // 'cash' => 'Cash In Hand'
    ];
}

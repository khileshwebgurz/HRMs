<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyData extends Model
{
    protected $table = 'company_data'; // if your table is named company_data

    protected $fillable = [
        'name', 'address', 'email', 'phone', // adjust based on your table structure
    ];
}
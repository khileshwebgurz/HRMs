<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateEmployments extends Model
{
    protected $fillable = [
        'candidate_id',
        'company_name',
        'address',
        'contact_details',
        'date_from',
        'date_to',
        'position',
        'reason_of_leaving'
    ];
}

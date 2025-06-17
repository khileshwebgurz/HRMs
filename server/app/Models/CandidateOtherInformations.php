<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateOtherInformations extends Model
{

    protected $fillable = [
        'candidate_id',
        'question_id',
        'status',
        'reason'
    ];
}

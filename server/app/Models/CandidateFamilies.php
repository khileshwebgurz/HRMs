<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateFamilies extends Model
{

    protected $fillable = [
        'candidate_id',
        'name',
        'relationship',
        'age',
        'occupation',
        'name_of_employer'
    ];
}

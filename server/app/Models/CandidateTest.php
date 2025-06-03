<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateTest extends Model
{

    protected $table = 'candidate_test';

    static $status = [
        1 => 'Active',
        2 => 'Link Expired',
        3 => 'Completed'
    ];

    public function questions()
    {
        return $this->hasMany('App\Models\CandidateTestOptions', 'candidate_test_id');
    }

    public function candidate()
    {
        return $this->hasOne('App\Models\Candidates', 'id', 'candidate_id');
    }
}

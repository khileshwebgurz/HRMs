<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateImports extends Model
{

    static $status = [
        0 => 'Pending',
        1 => 'Start',
        2 => 'Finish'
    ];
}

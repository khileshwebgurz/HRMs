<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holidays extends Model
{
 protected $dates = ['created_at', 'updated_at', 'date_of_event'];
}

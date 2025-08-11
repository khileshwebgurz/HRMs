<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kyslik\ColumnSortable\Sortable;

class FormsData extends Model
{
       use Sortable;

    protected $table = 'forms_data';
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kyslik\ColumnSortable\Sortable;

class FormRequests extends Model
{
    use Sortable;

    protected $table = 'form_requests';

    public function formData()
    {
        return $this->hasMany(FormsData::class, 'form_request_id'); 
    }

    public $sortable = ['formData->meta_key'];
}

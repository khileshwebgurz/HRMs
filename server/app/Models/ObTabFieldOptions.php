<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObTabFieldOptions extends Model
{

    public function fielddata()
    {
        return $this->hasOne('App\Models\ObTabFieldData', 'field_id', 'id');
    }
}

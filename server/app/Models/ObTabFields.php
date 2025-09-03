<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObTabFields extends Model
{
    // Define the relationship with ObTabFieldOptions
    public function field()
    {
        return $this->hasMany(ObTabFieldOptions::class, 'field_id')
                    ->orderBy('sort', 'ASC');
    }
}

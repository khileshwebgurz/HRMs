<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryCategory extends Model
{
    //
     protected $table = 'inventory_categories';

      public function categories()
    {
        return $this->hasOne('App\Models\InventoryCategory', 'id', 'parent_category_id');
    }
}

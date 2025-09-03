<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryVendor extends Model
{
    //
     protected $table = 'inventory_vendors';
      protected $fillable = [
        'country_id', 'state_id', 'city_id',
        'gst_no', 'zip', 'address', 'is_deleted', 'created_by', 'name','email','phone','company_name'
    ];

}

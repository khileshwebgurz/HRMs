<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItems extends Model
{
    //
    protected $table = 'inventory_items';
    protected $fillable = ['name','quantity','in_stock','in_use','location'];

    public function category()
    {
        return $this->hasOne('App\Models\InventoryCategory', 'id', 'category_id');
    }
     public function subcategory()
    {
        return $this->hasOne('App\Models\InventoryCategory', 'id', 'subcategory_id');
    }
     public function vendor()
    {
        return $this->hasOne('App\Models\InventoryVendor', 'id', 'vendor_id');
    }
     public function employee()
    {
        return $this->hasOne('App\Models\Employees', 'id', 'employee_id');
    }
    public function room()
    {
        return $this->hasOne('App\Models\InventoryRooms', 'id', 'room_id');
    }
}

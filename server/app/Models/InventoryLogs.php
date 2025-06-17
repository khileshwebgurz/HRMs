<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryLogs extends Model
{
  protected $table = 'inventory_logs';
   public function item()
    {
        return $this->hasOne('App\Models\InventoryItems', 'id', 'item_id');
    }
    public function logs()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}

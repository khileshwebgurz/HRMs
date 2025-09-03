<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObTabs extends Model
{
    //

    // public function fields()
    // {
    //     return $this->hasManyThrough('App\ObTabFields', 'App\ObTabFieldRelations', 'tab_id', 'id', 'id', 'field_id');
    // }
    public function fields()
    {
        return $this->hasManyThrough(
            ObTabFields::class,         
            ObTabFieldRelations::class, 
            'tab_id',                   
            'id',                      
            'id',                       
            'field_id'                 
        );
    }
    
}

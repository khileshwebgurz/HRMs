<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObTabs extends Model
{
    public function fields()
{
    return $this->hasManyThrough(
        'App\Models\ObTabFields', // The related model
        ObTabFieldRelations::class, // The intermediate model
        'tab_id', // Foreign key on the intermediate model (ObTabFieldRelations)
        'id', // Foreign key on the related model (ObTabFields)
        'id', // Local key on the current model (ObTabs)
        'field_id' // Foreign key on the intermediate model (ObTabFieldRelations)
    );
}

}

<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;

class CareerDataExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
  protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->data);
    }  
}

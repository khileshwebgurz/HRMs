<?php
namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\InventoryItems;
use Validator;

class InventoryImport implements ToModel, WithHeadingRow
{

   private $total_rows = 0;

   private $success = 0;

   private $fail = 0;

    private $csvData = array();

    /**
     *
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        ++ $this->total_rows; /* Total rows increment */

     
            $data = $row;
            $inventory = new InventoryItems();

            $inventory->name = $data['items'];
            $inventory->in_stock = $data['in_stock'];
            $inventory->in_use = $data['in_use'];
            $inventory->quantity =$data['in_stock'] + $data['in_use'];
            $inventory->room_id = $data['location'];
            $inventory->notes = $data['remarks'];
            $inventory->category_id = $data['category'];
            $inventory->subcategory_id = $data['subcategory'];
            $inventory->status = '2';
            $inventory->save();
                 ++ $this->success; 
          
           
    }

    public function getCSVData(): array
    {
        return $this->csvData;
    }

    public function getTotalRowCount(): int
    {
        return $this->total_rows;
    }

    public function getTotalSuccessCount(): int
    {
        return $this->success;
    }

    public function getRowFailCount(): int
    {
        return $this->fail;
    }
}

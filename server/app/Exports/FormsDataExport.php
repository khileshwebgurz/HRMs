<?php
namespace App\Exports;

use App\Models\InventoryLogs;
use App\Models\User;
use App\Models\InventoryItems;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class FormsDataExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return InventoryLogs::all();
    }

     public function headings(): array
    {
        return [
            'Item Name',
            'Username',
            'Action',
            'Before Update',
            'After Update',
            'Message',
            'Date'
        ];
    }
    public function map($row): array
    {
    	$user_id = $row['user_id'];
    	$name = User::where('id',$user_id)->first();
        $item_id = $row['item_id'];
        $item = InventoryItems::where('id',$item_id)->first();
        $log_type= $row['log_type'];
        if($log_type == '1'){
        	$log = 'Delete';
        }
        elseif($log_type == '2'){
        	$log = 'Add';
        }
        else{
        	$log = 'Update';
        }
        $created_at = $row['created_at'];
        $date = date('d M, Y', strtotime($created_at));
        

        $fields = [
            $item->name,
            $name->name,
            $log,
            $row['before'],
            $row['after'],
            $row['message'],
            $date
           
        ];
        return $fields;
    }
}

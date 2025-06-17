<?php
namespace App\Exports;

use App\InventoryLogs;
use App\Models\User;
use App\Models\InventoryItems;
use App\Models\InventoryVendor;
use App\Models\InventoryRooms;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InventoryItemExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return InventoryItems::where('is_deleted', '0')->latest()->get();
    }

     public function headings(): array
    {
        return [
            'Item Name',
            'vendor',
            'Assigned User',
            'Total',
            'In Stock',
            'In Use',
            'Room Name',
            'Faulty',
            'Category Type',
            'Date',
            'Status'
        ];
    }
    public function map($row): array
    {        
         $vendor_id = $row['vendor_id'];
         if($vendor_id ){
            $vendor_query = InventoryVendor::where('id',$vendor_id)->first();
            $vendor =  $vendor_query->name;
         }
         else{
            $vendor = '-';
         }
         


    	$user_id = $row['user_id'];
        if($user_id){
            $name_query = User::where('id',$user_id)->first();
            $name = $name_query->name;
        }else{
            $name = '-';
        }
    	
        $item_id = $row['item_id'];
        $item = InventoryItems::where('id',$item_id)->first();

        $stock= $row['stock'];
        if($stock == '1'){
        	$stock = 'In Stock';
        }
        else{
        	$stock = 'Out of Stock';
        }

        $room_id= $row['room_id'];
       
         if($room_id){
           $room_query = InventoryRooms::where('id',$room_id)->first();  
           $room =$room_query->room_name;
         }else{
             $room = '-';
         }
        $faulty= $row['faulty'];
        if($faulty == '1'){
            $faulty = 'Yes';
        }
        else{
            $faulty = 'No';
        }

        $category= $row['category_type'];
        if($category == '0'){
            $category = 'Non- Consumable';
        }
        else{
            $category = 'Consumable';
        }

        $status= $row['status'];
        if($status == '1'){
            $status = 'Pending';
        }
        elseif($status == '2'){
            $status = 'Accept';
        }
        else{
            $status = 'Rejected';
        }

        $in_use = $row['in_use'];
        if($in_use == ' '){
            $in_use = '0';
        }
        
        $in_stock = $row['in_stock'];
        if($in_stock == ' '){
            $in_stock = '0';
        }



        $created_at = $row['created_at'];
        $date = date('d M, Y', strtotime($created_at));
        

        $fields = [
            $row['name'],
            $vendor,
            $name,
            $row['quantity'],
            $in_stock,
            $in_use,
            $room,
            $faulty,
            $category,
            $date,
            $status
        ];
        return $fields;
    }
}

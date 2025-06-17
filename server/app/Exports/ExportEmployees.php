<?php
namespace App\Exports;

use App\Models\Employees;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExportEmployees implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Employees::orderBy('name','ASC')->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Phone',
            'Gender'
        ];
    }
    public function map($row): array
    {        
         
        $gender= $row['gender'];
        if($gender == '1'){
            $gender = 'Male';
        }
        else{
            $gender = 'Female';
        }

       
        $fields = [
            $row['name'],
            $row['email'],
            $row['phone'],
            $gender
        ];
        return $fields;
    }
}

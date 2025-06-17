<?php
namespace App\Exports;

use App\Models\Candidates;
use App\Models\User;
use App\Models\CandidateStatus;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class CandidateCsvExport implements FromCollection, WithHeadings, WithMapping, WithEvents, WithStrictNullComparison
{

    protected $invoices;

    protected $items;

    public function __construct(array $data)
    {
        $this->items = $data;
    }

    public function registerEvents(): array
    {
        return [
            // handle by a closure.
            AfterSheet::class => function (AfterSheet $event) {

                $event->sheet->getStyle('A1:U1')
                    ->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB('d7d7d7');
                
                    
                    

                $departments = Candidates::$departments;
                $this->setDropdownVals($event, 'E', $departments);

                $genders = Candidates::$gender;
                $this->setDropdownVals($event, 'I', $genders);

                $status = CandidateStatus::select('id', 'status_name')->get()->toArray();
                $status = array_column($status, 'status_name');
                // print_r($status);exit;
                $this->setDropdownVals($event, 'M', $status);
            }
        ];
    }

    public function setDropdownVals($event, $drop_column, $options)
    {

        // get layout counts (add 1 to rows for heading row)
        $row_count = count($this->items) + 1;
        $column_count = count($this->items[0]);

        // set dropdown column
        // $drop_column = 'D';
        // set dropdown options
        // $options = Candidates::$departments;
        // set dropdown list for first data row
        $validation = $event->sheet->getCell("{$drop_column}2")->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setShowDropDown(true);
        $validation->setErrorTitle('Input error');
        $validation->setError('Value is not in list.');
        $validation->setPromptTitle('Pick from list');
        $validation->setPrompt('Please pick a value from the drop-down list.');
        $validation->setFormula1(sprintf('"%s"', implode(',', $options)));

        // clone validation to remaining rows
        for ($i = 3; $i <= $row_count; $i ++) {
            $event->sheet->getCell("{$drop_column}{$i}")->setDataValidation(clone $validation);
        }

        // set columns to autosize
        for ($i = 1; $i <= $column_count; $i ++) {
            $column = Coordinate::stringFromColumnIndex($i);
            $event->sheet->getColumnDimension($column)->setAutoSize(true);
        }
    }

    /**
     *
     * @return array
     */
    /*
     * public function registerEvents(): array
     * {
     * return [
     * AfterSheet::class => function (AfterSheet $event) {
     * $cellRange = 'A1:W1'; // All headers
     * $event->sheet->getDelegate()
     * ->getStyle($cellRange)
     * ->getFont()
     * ->setSize(14)
     * ->getColor()
     * ->setRGB("#f51010");
     * }
     * ];
     * }
     */

    /**
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // store the results for later use
        // $this->items = $this->items;
        // print_r($this->items);exit;
        return collect($this->items);
    }

    // here you select the row that you want in the file
    public function map($row): array
    {
        $fields = [
            $row['id'],
            $row['full_name'],
            $row['created_at'],
            $row['position'],
            $row['department'],
            $row['total_experience'],
            $row['total_relevant_experience'],
            $row['age'],
            $row['gender'],
           // $row['education'],
            $row['mobile_number'],
            $row['email'],
            $row['status'],
           // $row['current_employer'],
            $row['current_salary'],
            $row['expected_salary'],
            $row['date_of_interview'],
            $row['interviewed_by'],
            $row['interview_score'],
            $row['remarks']
        ];
        return $fields;
    }

    public function headings(): array
    {
        return [
            'Candidate ID',
            'Name',
            'Date Applied',
            'Position',
            'Department',
            'Total Exp',
            'Relevant Exp',
            'Age',
            'Gender',
          //  'Education',
            'Phone',
            'Email',
            'Status',
            //'Current Employer',
            'Current Salary',
            'Expected Salary',
            'Sourcing',
            'Date of Interview',
            'Interviewed',
            'Interview Score',
            'Remarks'
        ];
    }
}

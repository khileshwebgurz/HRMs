<?php

namespace App\Imports;
use App\Employees;
use App\ObCandidates;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EmployeesImport implements ToModel, WithHeadingRow
{
   private $total_rows = 0;

   private $success = 0;

   private $fail = 0;

    // private $csvData = array();

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
            $employees = new Employees();
            $employees->id = $data['emp_id'];
            $employees->name = $data['name'];
            $employees->email = $data['official_email_id'];
            $employees->phone = $data['mobile_number_of_the_person'];
            $employees->password = "sukhpal";
            $employees->gender = $data['gender'];
            if($employees->save())
            {

            $candidates = new ObCandidates();
            $candidates->name = $data['name'];
            $candidates->email = $data['official_email_id'];
            $candidates->phone = $data['mobile_number_of_the_person'];
            $candidates->department = $data['deptt'];
            $candidates->job_title = $data['designation'];
            $candidates->date_of_joining = $data['date_of_joining']; 
            $candidates->date_of_reliveing = $data['date_of_relieving']; 
            $candidates->skype_id = $data['skype_id']; 
            $candidates->basecamp_id = $data['bascamp_id']; 
            $candidates->bank_name = $data['bank_name']; 
            $candidates->bank_account_holder_name = $data['bank_ac_name']; 
            $candidates->bank_account_number = $data['bank_ac_no']; 
            $candidates->id_number = $data['pan']; 
            $candidates->office_employee_id = $data['emp_id'];
            $candidates->current_address = $data['current_address']; 
            $candidates->permanent_address = $data['permanent_address']; 
            $candidates->current_phone = $data['mobile_number_of_the_person']; 
            $candidates->emergency_name = $data['person_to_be_contacted_in_case_of_emergency']; 
            $candidates->emergency_relation = $data['relation']; 
            $candidates->emergency_contact = $data['contact_number_of_the_person_to_be_contacted']; 
            $candidates->emergency_name_2 = $data['secondary_contact_name']; 
            $candidates->emergency_contact_2 = $data['secondary_contact_number']; 
            $candidates->marital_status = $data['marital_status']; 
            $candidates->dob = $data['date_of_birth']; 
            $candidates->education = $data['qualification']; 
            $candidates->save();
            
            }
            
             ++ $this->success; 

                return $candidates;
        
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

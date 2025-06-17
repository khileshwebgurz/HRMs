<?php

namespace App\Imports;
use App\Employees;
use App\ObCandidates;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Validator;
class MailPasswordImport implements ToModel, WithHeadingRow
{
   private $total_rows = 0;

   private $success = 0;

   private $fail = 0;


   /**
     * Transform a date value into a Carbon object.
     *
     * @return \Carbon\Carbon|null
     */
    public function transformDate($value, $format = 'Y-m-d')
    {
        try {
            return \Carbon\Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value));
        } catch (\ErrorException $e) {
            return \Carbon\Carbon::createFromFormat($format, $value);
        }
    }


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
		  
		  
		  $validator = Validator::make($row, [
           'official_email_id' => 'required|unique:employees,email',
		   
           'emp_id' => 'required|unique:employees,id'
            
        ]);
        
        // $this->csvData[] = $row;
        
        if (! $validator->fails()) { 
		$data = $row;
$data['official_email_id'] = str_replace(' ','',$data['official_email_id']);
           
            $employees = new Employees();
            $employees->id = $data['emp_id'];
            $employees->name = $data['name'];
            $employees->email = $data['official_email_id'];
            // $employees->gender = $data['gender'];
            $employees->token = Str::random(32);
            if($employees->save())
			{

				$candidates = new ObCandidates();
				$candidates->name = $data['name'];
				$candidates->email = $data['official_email_id'];
        if($data['deptt'] == 'Digital Marketing')
        {
          $candidates->department = '1';
        }
        elseif($data['deptt'] == 'Business Development')
        {
          $candidates->department = '2';
        }
        elseif($data['deptt'] == 'Mobile Development')
        {
          $candidates->department = '3';
        }
        elseif($data['deptt'] == 'Web Designing')
        {
          $candidates->department = '4';
        }
        elseif($data['deptt'] == 'HR')
        {
          $candidates->department = '5';
        }
        elseif($data['deptt'] == 'Admin')
        {
          $candidates->department = '6';
        }
        elseif($data['deptt'] == 'Quality')
        {
          $candidates->department = '7';
        }
        elseif($data['deptt'] == 'Web Developmen')
        {
          $candidates->department = '8';
        }
        elseif($data['deptt'] == 'Online Marketing')
        {
          $candidates->department = '9';
        }
        else
        {
          $candidates->department = '9';
        }




				
				$candidates->job_title = $data['designation'];
				$candidates->date_of_joining = $this->transformDate($data['date_of_joining'])->format('Y-m-d'); 
				$candidates->office_employee_id = $data['emp_id'];
				// $candidates->date_of_reliveing = $data['date_of_relieving']; 
				// $candidates->skype_id = $data['skype_id']; 
				// $candidates->basecamp_id = $data['bascamp_id']; 
				// $candidates->bank_name = $data['bank_name']; 
				// $candidates->bank_account_holder_name = $data['bank_ac_name']; 
				// $candidates->bank_account_number = $data['bank_ac_no']; 
				// $candidates->id_number = $data['pan']; 
				// $candidates->office_employee_id = $data['emp_id'];
				// $candidates->current_address = $data['current_address']; 
				// $candidates->permanent_address = $data['permanent_address']; 
				// $candidates->current_phone = $data['mobile_number_of_the_person']; 
				// $candidates->emergency_name = $data['person_to_be_contacted_in_case_of_emergency']; 
				// $candidates->emergency_relation = $data['relation']; 
				// $candidates->emergency_contact = $data['contact_number_of_the_person_to_be_contacted']; 
				// $candidates->emergency_name_2 = $data['secondary_contact_name']; 
				// $candidates->emergency_contact_2 = $data['secondary_contact_number']; 
				// $candidates->marital_status = $data['marital_status']; 
				// $candidates->dob = $data['date_of_birth']; 
				// $candidates->education = $data['qualification']; 
			   if($candidates->save()) 
			   {
					$to_name = $data['name'];
					$to_email = $data['official_email_id'];
					$data = array(
						'name' => $data['name'],
						'invite_link_accept' => route('setPasswordEmployee', [
							'accept',
						   $employees->token
						]),
						'invite_link_declined' => route('setPasswordEmployee', [
							'declined',
							$employees->token
						])
					);

					Mail::send('emails.employee-invite', $data, function ($message) use ($to_name, $to_email) {
						$message->to($to_email, $to_name)->subject('Welcome to HRM');
					});
					if (! Mail::failures()) {
						return $employees;
					} else {
					   return $employees;
					}
				}
			}
			++ $this->success; 
			
			 } else {
				++ $this->fail; // Fail rows increment //
			}
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

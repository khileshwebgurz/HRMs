<?php
namespace App\Exports;

use App\Models\Employees;
use App\Models\EmployeeAttendance;
use App\Models\ObCandidates;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SalaryCsvExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Employees::where('status','1')->get();
    }

    public function map($row): array
    {
        $candidate = ObCandidates::where('office_employee_id', $row['id'])->first();
        $type_code = 'PAB_VENDOR';
        $payment_mode = 'NEFT';
        $debit_acc = $candidate['bank_account_number'];
        $name = $row['name'];
        $bank_acc_no = $candidate['bank_account_number'];
        $ifsc = $candidate['bank_ifsc'];

        // $from = date('2021-07-26');
        // $to = date('2021-08-25');
        if(date('d') >= '26')
        {
            $from = date('Y-m-d', strtotime(date('Y'.'-'.'m'.'-26'). ' - 1 month'));
            $to = date('Y-m-d', strtotime(date('Y'.'-'.'m'.'-25'). ''));
        }
        // if(date('d') <= '25')
        else
        {
            $from = date('Y-m-d', strtotime(date('Y'.'-'.'m'.'-26'). ' - 2 month'));
            $to = date('Y-m-d', strtotime(date('Y'.'-'.'m'.'-25'). ' - 1 month'));
        }
        $arr=[];
        $leave = EmployeeAttendance::where('employee_id', $row['id'])->whereBetween('clock_date', [$from, $to])->distinct()->where('status','L')->get()->unique('clock_date')->count();
        $absent = EmployeeAttendance::where('employee_id', $row['id'])->whereBetween('clock_date', [$from, $to])->distinct()->where('status','A')->get()->unique('clock_date')->count();
        $half_leave = EmployeeAttendance::where('employee_id', $row['id'])->whereBetween('clock_date', [$from, $to])->distinct()->where('status','HL')->get()->unique('clock_date')->count() /2;
        $short_leave = EmployeeAttendance::where('employee_id', $row['id'])->whereBetween('clock_date', [$from, $to])->distinct()->where('status','SL')->get()->unique('clock_date')->count() /4;
        array_push($arr,$leave,$absent,$half_leave, $short_leave);
        $arr = array_sum($arr);
        // if($arr <= noofleaves())
        // {
        //     $sum = '0';
        // }
        // else
        // {
        //     $sum = $arr - noofleaves();
        // }
        $total = noofworkingdays() - $arr;
        // $working = noofworkingdays() - $total;
        $emp = $row['salary']/noofworkingdays();
        $final_salary = $total * $emp;
        if(empty($final_salary))
        {
            $amount = '0';
        }else{
            $amount = round($final_salary, 2);
        }

        $debit_narr = '-';
        $credit_narr = '-';
        $mobile = $row['phone'];
        $email = $row['email'];
        $remark = '-';
        $pay_date = date("d-m-Y");
        $ref_no = '-';
        $add_info1 = '-';
        $add_info2 = '-';
        $add_info3 = '-';
        $add_info4 = '-';
        $add_info5 = '-';
        $lei_no = '-';

        $fields = [
            $type_code,
            $payment_mode,
            $debit_acc,
            $name,
            $bank_acc_no,
            $ifsc,
            $amount,
            $debit_narr,
            $credit_narr,
            $mobile,
            $email,
            $remark,
            $pay_date,
            $ref_no,
            $add_info1,
            $add_info2,
            $add_info3,
            $add_info4,
            $add_info5,
            $lei_no
           
        ];
        return $fields;
    }

    public function headings(): array
    {
        return [
            'PYMT_PROD_TYPE_CODE',
            'PYMT_MODE',
            'DEBIT_ACC_NO',
            'BNF_NAME',
            'BENE_ACC_NO',
            'BENE_IFSC',
            'AMOUNT',
            'DEBIT_NARR',
            'CREDIT_NARR',
            'MOBILE_NUM',
            'EMAIL_ID',
            'REMARK',
            'PYMT_DATE',
            'REF_NO',
            'ADDL_INFO1',
            'ADDL_INFO2',
            'ADDL_INFO3',
            'ADDL_INFO4',
            'ADDL_INFO5',
            'LEI_NUMBER'
        ];
    }
}

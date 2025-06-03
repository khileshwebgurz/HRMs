<?php



use App\Models\ObTabFieldOptions;
use App\Models\ObTabFieldData;
use App\Models\Employees;
// echo send_message();exit;
function getEmployeeProgress($id)
{
    $totalCount = ObTabFieldOptions::where('progress', 1)->count();

    $perfield = 100 / $totalCount;

    $optionsSingle = ObTabFieldOptions::selectRaw('id')->where('progress', 1)
        ->whereIn('type', [
            1,
            2,
            3,
            4
        ])
        ->get();

    $singleFields = array_column($optionsSingle->toArray(), 'id');

    $totalSingle = ObTabFieldData::whereIn('field_id', $singleFields)->where('ob_candidate_id', $id)
        ->whereNotNull('value')
        ->count();

    $optionsMultiple = ObTabFieldOptions::selectRaw('id')->where('progress', 1)
        ->whereIn('type', [
            5,
            7
        ])
        ->get();

    $multipleFields = array_column($optionsMultiple->toArray(), 'id');

    $totalMultiple = ObTabFieldData::whereIn('field_id', $multipleFields)->where('ob_candidate_id', $id)
        ->whereNotNull('value')
        ->get();

    $totalMultipleCount = array();
    foreach ($totalMultiple as $mk => $mv) {
        if (! empty($mv->value)) {
            $vals = json_decode($mv->value);

            if (count($vals) > 0) {
                $totalMultipleCount[] = 1;
            }
        }
    }
    $totalMultiple = count($totalMultipleCount);
    $totalFieldData = $totalSingle + $totalMultiple;

    $progress = $perfield * $totalFieldData;

    return round($progress);
}



function getTeamListByManagerId($manager_id)
{
    $employees = Employees::where('manager_id', $manager_id)->get();
    return $employees;
}


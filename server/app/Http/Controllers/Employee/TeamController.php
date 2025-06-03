<?php

namespace App\Http\Controllers\Employee;

use App\Models\ObCandidates;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Employees;


class TeamController extends Controller
{
    public function getTeamTree()
    {
        
        $current = Employees::with('obCandidates')
            ->where('status', '1')
            ->find(Auth::id());
        
        
       
        $upliner = Employees::with('obCandidates')
            ->where('status', '1')
            ->find($current->manager_id);

        $tree = $this->buildTree($current->id);

        return response()->json([
            'upliner' => $upliner,
            'current' => $current,
            'tree' => $tree,
        ]);
    }

    private function buildTree($managerId)
    {
       
        $employees = Employees::with('obCandidates')
            ->where('status', '1')
            ->where('manager_id', $managerId)
            ->get();
      
        $tree = [];
        foreach ($employees as $emp) {

            $tree[] = [
                'id' => $emp->id,
                'name' => $emp->name,
                'gender' => $emp->gender,
                'profile_pic' => $emp->profile_pic,
                // Access job_title from the correct relationship: obCandidates
                'job_title' => $emp->obCandidates->job_title ?? '-',
                'children' => $this->buildTree($emp->id),
            ];
        }

        return $tree;
    }
}
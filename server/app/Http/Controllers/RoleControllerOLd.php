<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Roles;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\RpForms;
use App\Models\RpFormFields;
use App\Models\RpFieldPermissions;
use App\Models\Permissions;


class RoleControllerOld extends Controller
{

    public function getPermissions()
    {
        $permissions = DB::table('permissions')->select('id', 'permission_name')->get();

        return response()->json([
            'status' => 200,
            'data' => $permissions
        ]);
    }
    
    public function allRoles(Request $request): JsonResponse
    {

        $currentUser = Auth::user();

        if (!$currentUser || $currentUser->user_role != 1) {
            return response()->json([
                'message' => 'Unauthorized access. Only Super Admin can view all roles.'
            ], 403);

        }

        $roles = Roles::all();

        //Log::info('roles Response', ['data' => $roles]);

        $dataTable = DataTables::of($roles)
            ->addIndexColumn()
            ->addColumn('view', fn($row) => $this->renderDropdown($row, 'view'))
            ->addColumn('edit', fn($row) => $this->renderDropdown($row, 'edit'))
            ->addColumn('add', fn($row) => $this->renderDropdown($row, 'add'))
            ->addColumn('delete', fn($row) => $this->renderDropdown($row, 'delete'))
            ->addColumn('import', fn($row) => $this->renderToggleIcon($row, 'import'))
            ->addColumn('export', fn($row) => $this->renderToggleIcon($row, 'export'))
            ->addColumn('actions', fn($row) => $this->renderActions($row)) // ✅ Add action buttons
            ->rawColumns(['view', 'edit', 'add', 'delete', 'import', 'export', 'actions']);

        $response = $dataTable->toArray();

        //Log::info('DataTables Response', ['data' => $response]);

        return response()->json($response);
    }

    public function addRolePost(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_name' => 'required|unique:roles|max:50',
                'permissions' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->errors()->first()
                ]);
            }

            $role = new Roles();
            $role->role_name = $request->role_name;
            $role->permissions = json_encode($request->permissions); // Save array
            $role->view = $request->view ?? 1;
            $role->edit = $request->edit ?? 1;
            $role->add = $request->add ?? 1;
            $role->delete = $request->delete ?? 1;
            $role->import = $request->import ?? 0;
            $role->export = $request->export ?? 0;
            $role->created_by = Auth::id();

            if ($role->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => "New Role Added"
                ]);
            }

            return response()->json([
                'status' => 500,
                'message' => 'Failed to save role'
            ]);
        } catch (\Exception $e) {
            Log::error('Role creation error', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 500,
                'message' => 'Server Error: ' . $e->getMessage()
            ]);
        }
    }


    private function renderDropdown($row, string $type): string
    {
        $value = $row->$type;
        $icons = [
            1 => 'no-data.png',
            2 => 'my-data.png',
            3 => 'reporties-data.png',
            4 => 'reporties-my-data.png',
            5 => 'all-data.png'
        ];

        $titles = [
            1 => 'no-data',
            2 => 'my-data',
            3 => 'reporties-data',
            4 => 'reporties+my-data',
            5 => 'all-data'
        ];

        $currentIcon = $icons[$value] ?? 'no-data.png';

        $html = '<div class="dropdown roles-dropdown">';
        $html .= '<a title="' . $titles[$value] . '" href="javascript:void(0)" role="button" data-toggle="dropdown"><img src="/hrm/public/dist/img/2021/icons/' . $currentIcon . '" alt="" /></a>';
        $html .= '<div class="dropdown-menu roles-list">';

        foreach ($icons as $id => $icon) {
            $html .= '<a class="dropdown-item view" title="' . $titles[$id] . '" href="javascript:void(0)" data-id="' . $row->id . '" id="' . $id . '" data-type="' . $type . '">
                <img src="/hrm/public/dist/img/2021/icons/' . $icon . '" alt="" /></a>';
        }

        $html .= '</div></div>';

        return $html;
    }

    private function renderToggleIcon($row, string $type): string
    {
        $value = $row->$type;
        $icon = $value == 1 ? 'tick-icon.png' : 'cross-icon.png';
        $title = $value == 1 ? 'yes' : 'no';

        return '<a class="view" title="' . $title . '" href="javascript:void(0)" data-id="' . $row->id . '" id="' . $value . '" data-type="' . $type . '">
            <img src="/hrm/public/dist/img/2021/icons/' . $icon . '" alt="" /></a>';
    }

    private function renderActions($row): string
    {
        $currentUser = Auth::user();

        
        if ($currentUser && $currentUser->user_role == 1) {
            $viewBtn = '<a href="javascript:void(0)" class="btn btn-sm btn-info view-role" data-id="' . $row->id . '">View</a> ';
            $editBtn = '<a href="javascript:void(0)" class="btn btn-sm btn-primary edit-role" data-id="' . $row->id . '">Edit</a> ';
            $deleteBtn = '<a href="javascript:void(0)" class="btn btn-sm btn-danger delete-role" data-id="' . $row->id . '">Delete</a>';

            return '<div class="btn-group">' . $viewBtn . $editBtn . $deleteBtn . '</div>';
        }

        return ''; 
    }


    public function deleteRole($id)
    {
        try {
            $role = Roles::findOrFail($id);
            $role->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Role deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Delete role error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Server error while deleting role'
            ], 500);
        }
    }

   
    public function getRoleById($id)
    {
        try {
            $role = Roles::findOrFail($id);
            return response()->json([
                'status' => 200,
                'data' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found'
            ], 404);
        }
    }

    
    public function updateRole(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_name' => 'required|max:50|unique:roles,role_name,' . $id,
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->errors()->first()
                ]);
            }

            $role = Roles::findOrFail($id);
            $role->role_name = $request->role_name;
            $role->view = $request->view ?? 1;
            $role->edit = $request->edit ?? 1;
            $role->add = $request->add ?? 1;
            $role->delete = $request->delete ?? 1;
            $role->import = $request->import ?? 0;
            $role->export = $request->export ?? 0;
            $role->permissions = json_encode($request->permissions ?? []);

            $role->save();

            return response()->json([
                'status' => 200,
                'message' => 'Role updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Server error: ' . $e->getMessage()
            ]);
        }
    }

    // public function getAssignedPermissions($role_id)
    // {
    //     $role = Roles::findOrFail($role_id);
    //     $allPermissions = Permissions::all();
    //     $assignedPermissions = explode(',', $role->permissions); 

    //     return response()->json([
    //         'status' => 200,
    //         'role' => $role,
    //         'permissions' => $allPermissions,
    //         'assigned_permissions' => $assignedPermissions,
    //     ]);
    // }

    // public function assignPermissionPost(Request $request)
    // {
       
    //     $validated = $request->validate([
    //         'role_id' => 'required|exists:roles,id',
    //         'permissions' => 'nullable|array',
    //         'permissions.*' => 'integer|exists:permissions,id',
    //     ]);

    //       Log::info('roles Response', ['data' => $validated]);
    //     $role = Roles::findOrFail($validated['role_id']);

    //     $role->permissions = implode(',', $validated['permissions'] ?? []);
        
    //     if ($role->save()) {
    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Permissions assigned successfully.',
    //         ]);
    //     }

    //     return response()->json([
    //         'status' => 500,
    //         'message' => 'Failed to assign permissions. Try again.',
    //     ]);
    // }


      public function getFieldPermissions($role_id)
    {
        $fields = RpFormFields::with('form')->get();

        $data = $fields->map(function ($field) use ($role_id) {
            $permission = RpFieldPermissions::where('role_id', $role_id)
                            ->where('rp_form_id', $field->rp_form_id)
                            ->where('rp_field_id', $field->id)
                            ->first();

            return [
                'id' => $field->id,
                'form_name' => $field->form->form_name ?? '',
                'field_name' => $field->parent_id == 0 ? 'Basic Information' : $field->field_name,
                'is_parent' => $field->parent_id == 0,
                'rp_form_id' => $field->rp_form_id,
                'view' => $permission->view ?? '1',
                'edit' => $permission->edit ?? '1',
            ];
        });

        return response()->json(['status' => 200, 'data' => $data]);
    }

    public function updateFieldPermission(Request $request, $role_id)
    {
        $validated = $request->validate([
            'rp_form_id' => 'required|integer',
            'rp_field_id' => 'required|integer',
            'type' => 'required|in:view,edit',
            'value' => 'required|in:1,2,3,4,5'
        ]);

        $permission = RpFieldPermissions::updateOrCreate(
            [
                'role_id' => $role_id,
                'rp_form_id' => $validated['rp_form_id'],
                'rp_field_id' => $validated['rp_field_id'],
            ],
            [
                $validated['type'] => $validated['value'],
            ]
        );

        return response()->json(['status' => 200, 'message' => 'Field Permission Updated']);
    }
    

 
    
}

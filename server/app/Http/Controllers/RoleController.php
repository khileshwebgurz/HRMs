<<<<<<< Updated upstream
=======
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use Illuminate\Support\Facades\Auth;
use App\Models\RpFormFields;
use Illuminate\Support\Facades\Validator;
use App\Models\RpFieldPermissions;
use App\Models\RpForms;

use Laravel\Passport\Passport;

class RoleController extends Controller
{
    
    public function allRoles(Request $request)
    {
        $currentUser = Auth::user();

       if (!$currentUser || $currentUser->user_role != 1) {
            return response()->json([
                'message' => 'Unauthorized access. Only Super Admin can view all roles.'
            ], 403);

        }

        $roles = Roles::all();
        return response()->json([
            'status' => 200,
            'data' => $roles
        ]);
    }

    // Add new role - API endpoint
    public function addRolePost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_name' => 'required|unique:roles|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        $role = new Roles();
        $role->role_name = $request->role_name;
        $role->permissions = 'Null';
        $role->created_by = Auth::id();

        if ($role->save()) {
            return response()->json([
                'status' => 200,
                'message' => "New Role Added",
                'data' => $role
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ], 401);
    }

    // Assign permissions to role - API endpoint
    public function assignPermissionPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        $role = Roles::find($request->role_id);
        $role->permissions = implode(",", $request->permissions);

        if ($role->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Permissions assigned successfully",
                'data' => $role
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ], 401);
    }

    // Get permissions for a role - API endpoint
    public function getRolePermissions($role_id)
    {
        $role = Roles::findOrFail($role_id);
        $permissions = Permissions::all();
        $rolePermissions = explode(",", $role->permissions);

        return response()->json([
            'status' => 200,
            'role' => $role,
            'permissions' => $permissions,
            'role_permissions' => $rolePermissions
        ]);
    }

    // Get form fields with permissions - API endpoint
    public function getFormFieldsWithPermissions($role_id)
    {
        $role = Roles::findOrFail($role_id);
        $fields = RpFormFields::with(['form', 'permissions' => function($q) use ($role_id) {
            $q->where('role_id', $role_id);
        }])->get();

        return response()->json([
            'status' => 200,
            'data' => $fields
        ]);
    }

    // Update role permissions (view, edit, add, delete, import, export) - API endpoint
    public function updateRolePermission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'type' => 'required|in:view,edit,add,delete,import,export',
            'permission_id' => 'required_if:type,view,edit,add,delete|integer|between:1,5',
            'value' => 'required_if:type,import,export|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        $role = Roles::find($request->role_id);
        $current_user_role = Roles::find(Auth::user()->user_role);

        if ($current_user_role->edit != '5') {
            return response()->json([
                'status' => 403,
                'message' => "You don't have permission to edit this"
            ], 403);
        }

        $type = $request->type;
        $permission_id = $request->permission_id;
        $value = $request->value;

        switch ($type) {
            case 'view':
                if (!($permission_id <= $role->edit || $permission_id <= $role->delete || $permission_id <= $role->add)) {
                    $role->view = $permission_id;
                } else {
                    $role->view = $permission_id;
                    $role->edit = $permission_id;
                    $role->add = $permission_id;
                    $role->delete = $permission_id;
                }
                break;
                
            case 'edit':
                if (!($role->view >= $permission_id)) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Edit Permission cannot be greater than View Permission'
                    ], 401);
                }
                $role->edit = $permission_id;
                break;
                
            case 'add':
                if (!($role->view >= $permission_id)) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Add Permission cannot be greater than View Permission'
                    ], 401);
                }
                $role->add = $permission_id;
                break;
                
            case 'delete':
                if (!($role->view >= $permission_id)) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Delete Permission cannot be greater than View Permission'
                    ], 401);
                }
                $role->delete = $permission_id;
                break;
                
            case 'import':
                $role->import = $value ? '1' : '0';
                break;
                
            case 'export':
                $role->export = $value ? '1' : '0';
                break;
        }

        if ($role->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Role Permission Updated",
                'data' => $role
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ], 401);
    }

    // Update field permissions - API endpoint
    public function updateFieldPermission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'field_id' => 'required|exists:rp_form_fields,id',
            'role_id' => 'required|exists:roles,id',
            'form_id' => 'required|exists:rp_forms,id',
            'type' => 'required|in:view,edit',
            'permission_id' => 'required|integer|between:1,5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        $field_id = $request->field_id;
        $role_id = $request->role_id;
        $form_id = $request->form_id;
        $permission_id = $request->permission_id;
        $type = $request->type;

        $field_permission = RpFieldPermissions::firstOrNew([
            'rp_form_id' => $form_id,
            'rp_field_id' => $field_id,
            'role_id' => $role_id
        ]);

        if ($type == 'view') {
            if (!($permission_id <= $field_permission->edit)) {
                $field_permission->view = $permission_id;
            } else {
                $field_permission->view = $permission_id;
                $field_permission->edit = $permission_id;
            }
        } elseif ($type == 'edit') {
            if (!($field_permission->view >= $permission_id)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Edit Permission cannot be greater than View Permission'
                ], 401);
            }
            $field_permission->edit = $permission_id;
        }

        if ($field_permission->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Field Permission Updated",
                'data' => $field_permission
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ], 401);
    }

    // Get all permissions for module assignment - API endpoint
    public function getAllPermissions($role_id)
    {
        $role = Roles::findOrFail($role_id);
        $permissions = Permissions::all();
        $rolePermissions = explode(",", $role->permissions);

        return response()->json([
            'status' => 200,
            'role' => $role,
            'permissions' => $permissions,
            'role_permissions' => $rolePermissions
        ]);
    }

    // Bulk update module permissions - API endpoint
    public function updateModulePermissions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        $role = Roles::find($request->role_id);
        $role->permissions = implode(",", $request->permissions);

        if ($role->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Module Permissions Updated",
                'data' => $role
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ], 401);
    }
}
>>>>>>> Stashed changes

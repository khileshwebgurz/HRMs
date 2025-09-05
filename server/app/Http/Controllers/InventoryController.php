<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InventoryCategory;
use App\Models\InventoryVendor;
use App\Models\InventoryItems;
use App\Models\InventoryRooms;
use App\Models\Notifications;
use App\Models\Employees;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\InventoryLogs;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Auth;
use App\Models\Roles;
use App\Exports\InventoryItemExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\FormsDataExport;
use App\Imports\InventoryImport;
use Illuminate\Support\Facades\Log;
use Session;
use Illuminate\Support\Facades\Validator;
use Redirect;

class InventoryController extends Controller
{
    public function allCategoriesOLD(Request $request)
    {
        // if(!in_array('category_management', Session::get('permission')[0])){
        //     abort(404);
        // }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $category = InventoryCategory::with('categories')->where('created_by', Auth::user()->id)->where('is_deleted', '0')->where('parent_category_id', '!=', 0)->latest()->get();
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $category = InventoryCategory::with('categories')->whereIn('created_by', $employees)->where('is_deleted', '0')->where('parent_category_id', '!=', 0)->latest()->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $category = InventoryCategory::with('categories')->whereIn('created_by', $employees)->where('is_deleted', '0')->where('parent_category_id', '!=', 0)->latest()->get();
        } elseif ($permission_role->view == '5') {
            $category = InventoryCategory::with('categories')->where('is_deleted', '0')->where('parent_category_id', '!=', 0)->latest()->get();
        }

        if ($request->ajax()) {
            return DataTables::of($category)->addIndexColumn()

                ->editColumn('parent_category_id', function ($row) {
                    if ($row->categories) {
                        $name = $row->categories->category_name;
                        return $name;
                    } else {
                        return '-';
                    }
                })
                ->addColumn('action', function ($row) {
                    $loginuser = Auth::user();
                    $btn = '<div class="btn-group btn-group-sm">';
                    $id = Auth::user()->id;
                    $created_by = $row->created_by;
                    $manager =  Employees::where('id', $created_by)->first();
                    $permission_role = Roles::where('id', Auth::user()->user_role)->first();

                    if ($permission_role->edit == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editcategory', $row->id) . '">
                           <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                         </a> ';
                        }
                    } elseif ($permission_role->edit == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editcategory', $row->id) . '">
                           <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                         </a> ';
                        }
                    } elseif ($permission_role->edit == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editcategory', $row->id) . '">
                           <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                         </a> ';
                        }
                    } elseif ($permission_role->edit == '5') {
                        $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editcategory', $row->id) . '">
                           <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                         </a> ';
                    }








                    if ($permission_role->delete == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deletecategory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                             <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                         </a>';
                        }
                    } elseif ($permission_role->delete == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deletecategory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                             <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                         </a>';
                        }
                    } elseif ($permission_role->delete == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deletecategory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                             <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                         </a>';
                        }
                    } elseif ($permission_role->delete == '5') {
                        $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deletecategory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                             <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                         </a>';
                    }


                    $btn .= '</div>';
                    return $btn;
                })
                ->rawColumns([
                    'action'
                ])
                ->make(true);
        }
        return view('inventory.category.all-category');
    }

    public function allCategories(Request $request)
    {
        Log::info('my user role is >');
        Log::info('my user role is >', ['user role' => Auth::user()]);
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        $userId = Auth::user()->id;


        if ($permission_role->view == '2') {
            $category = InventoryCategory::with('categories')
                ->where('created_by', $userId)
                ->where('is_deleted', '0')
                ->where('parent_category_id', '!=', 0)
                ->latest()
                ->get();
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', $userId)->pluck('id')->toArray();
            $category = InventoryCategory::with('categories')
                ->whereIn('created_by', $employees)
                ->where('is_deleted', '0')
                ->where('parent_category_id', '!=', 0)
                ->latest()
                ->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', $userId)
                ->orWhere('id', $userId)
                ->pluck('id')
                ->toArray();
            $category = InventoryCategory::with('categories')
                ->whereIn('created_by', $employees)
                ->where('is_deleted', '0')
                ->where('parent_category_id', '!=', 0)
                ->latest()
                ->get();
        } elseif ($permission_role->view == '5') {
            $category = InventoryCategory::with('categories')
                ->where('is_deleted', '0')
                ->where('parent_category_id', '!=', 0)
                ->latest()
                ->get();
        } else {
            $category = collect(); // no data if no valid permission
        }


        $responseData = $category->map(function ($row) use ($permission_role, $userId) {
            $created_by = $row->created_by;
            $manager = Employees::where('id', $created_by)->first();

            // Parent category name
            $parentCategory = $row->categories ? $row->categories->category_name : '-';

            // Action buttons (we return JSON instead of HTML now)
            $actions = [
                'can_edit'   => false,
                'can_delete' => false,
                'edit_url'   => null,
                'delete_url' => null,
            ];

            // ---- EDIT permissions ----
            if ($permission_role->edit == '2' && $userId == $created_by) {
                $actions['can_edit'] = true;
            } elseif ($permission_role->edit == '3' && $userId == $manager->manager_id) {
                $actions['can_edit'] = true;
            } elseif ($permission_role->edit == '4' && ($userId == $manager->manager_id || $userId == $created_by)) {
                $actions['can_edit'] = true;
            } elseif ($permission_role->edit == '5') {
                $actions['can_edit'] = true;
            }

            if ($actions['can_edit']) {
                $actions['edit_url'] = route('editcategory', $row->id);
            }

            // ---- DELETE permissions ----
            if ($permission_role->delete == '2' && $userId == $created_by) {
                $actions['can_delete'] = true;
            } elseif ($permission_role->delete == '3' && $userId == $manager->manager_id) {
                $actions['can_delete'] = true;
            } elseif ($permission_role->delete == '4' && ($userId == $manager->manager_id || $userId == $created_by)) {
                $actions['can_delete'] = true;
            } elseif ($permission_role->delete == '5') {
                $actions['can_delete'] = true;
            }

            if ($actions['can_delete']) {
                $actions['delete_url'] = route('deletecategory', $row->id);
            }

            return [
                'id'                => $row->id,
                'category_name'     => $row->category_name,
                'parent_category'   => $parentCategory,
                'created_by'        => $row->created_by,
                'actions'           => $actions,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $responseData,
        ]);
    }
    // public function editCategoryOLD(Request $request, $cat_id)
    // {
    //     $category = InventoryCategory::where('id', $cat_id)->with('categories')->first();
    //     $categoryId = InventoryCategory::where('parent_category_id', '0')->orderBy('category_name', 'ASC')->get();
    //     $name = $category->parent_category_id;
    //     return view('inventory.category.edit-category', compact('category', 'categoryId', 'name'));
    // }

    public function editCategory(Request $request, $cat_id)
    {
        $category = InventoryCategory::where('id', $cat_id)
            ->with('categories')
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $categoryId = InventoryCategory::where('parent_category_id', '0')
            ->orderBy('category_name', 'ASC')
            ->get();

        $name = $category->parent_category_id;

        return response()->json([
            'success' => true,
            'category' => $category,
            'categoryId' => $categoryId,
            'name' => $name
        ]);
    }


    public function deleteCategoryOLD($cat_id)
    {

        $category = InventoryCategory::findOrFail($cat_id);
        if ($category) {
            $category->is_deleted = "1";
            if ($category->save()) {
                return redirect()->route('allcategories')->with('success', 'category deleted.');
            } else {
                return redirect()->route('allusers')->with('error', 'Something wrong. Try again.');
            }
        }
    }

    public function deleteCategory($cat_id)
    {
        $category = InventoryCategory::find($cat_id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $category->is_deleted = "1";

        if ($category->save()) {
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Something went wrong. Try again.'
        ], 500);
    }

    public function editCategoryPost(Request $request)
    {
        Log::info('the whole request is >>>', ['request' => $request->all()]);
        $catid = $request->cat_id;
        $category = InventoryCategory::where('id', $catid)->first();
        $validator = Validator::make(
            $request->all(),
            [
                'category_name' => 'required'
            ],
            [
                'category_name.required' => 'Please add category'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $category->category_name = $request->category_name;
        $category->parent_category_id = $request->parent_category_id;

        // $user->user_role = $request->user_role;

        if ($category->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Category  Updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    public function addCategoriesOLD(Request $request)
    {
        $category = InventoryCategory::where('parent_category_id', '0')->where('is_deleted', '0')->orderBy('category_name', 'ASC')->get();
        $parent = InventoryCategory::latest('id')->first();
        return view('inventory.category.add-category', compact('category', 'parent'));
    }

    public function addCategories(Request $request)
    {
        $categories = InventoryCategory::where('parent_category_id', '0')
            ->where('is_deleted', '0')
            ->orderBy('category_name', 'ASC')
            ->get();

        $parent = InventoryCategory::latest('id')->first();

        $roles = Roles::where('id', Auth::user()->user_role)->first();

        if ($roles->add == '4') {
            $assign = Employees::where('manager_id', Auth::user()->id)
                ->orWhere('id', Auth::user()->id)
                ->get();
        } elseif ($roles->add == '5') {
            $all_roles = Roles::where('id', '!=', '2')->pluck('id')->toArray();
            $assign = Employees::whereIn('user_role', $all_roles)->get();
        } else {
            $assign = Employees::where('manager_id', Auth::user()->id)->get();
        }

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'parent' => $parent,
            'roles'      => $roles,
            'assign'     => $assign
        ]);
    }


    public function addCategoriesPost(Request $request)
    {
        // $loginuser = Auth::user();
        $category = new InventoryCategory();
        $validator = Validator::make(
            $request->all(),
            [
                'parent_category_id' => 'required',
                'category_name' => 'required'
            ],
            [
                'parent_category_id.required' => 'Please Select Category',
                'category_name.required' => 'Please add subcategory'
            ]

        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }



        $count =  InventoryCategory::where('category_name', $request->category_name)->where('parent_category_id', $request->parent_category_id)->count();
        if ($count > 0) {
            return response()->json([
                'status' => 401,
                'message' => 'subcategory already exists'
            ]);
        }

        $category->category_name = $request->category_name;
        $category->parent_category_id = $request->parent_category_id;
        $category->created_by = $created_by;

        if ($category->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Category added"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    public function allVendorsOLD(Request $request)
    {
        // if(!in_array('vendor_management', Session::get('permission')[0])){
        //     abort(404);
        // }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $vendor = InventoryVendor::where('created_by', Auth::user()->id)->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $vendor = InventoryVendor::whereIn('created_by', $employees)->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $vendor = InventoryVendor::whereIn('created_by', $employees)->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '5') {
            $vendor = InventoryVendor::where('is_deleted', '0')->latest()->get();
        }
        if ($request->ajax()) {

            return DataTables::of($vendor)->addIndexColumn()

                ->addColumn('action', function ($row) {
                    $id = Auth::user()->id;
                    $created_by = $row->created_by;
                    $manager =  Employees::where('id', $created_by)->first();
                    $permission_role = Roles::where('id', Auth::user()->user_role)->first();
                    $btn = '<div class="btn-group btn-group-sm">';
                    if ($permission_role->edit == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editvendor', $row->id) . '">
                               <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editvendor', $row->id) . '">
                               <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editvendor', $row->id) . '">
                               <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '5') {
                        $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editvendor', $row->id) . '">
                               <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                   </a> ';
                    }


                    if ($permission_role->delete == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon px-6" title="Delete" href="' . route('deletevendor', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                           <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                      </a>';
                        }
                    } elseif ($permission_role->delete == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon px-6" title="Delete" href="' . route('deletevendor', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                          <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                       </a>';
                        }
                    } elseif ($permission_role->delete == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon px-6" title="Delete" href="' . route('deletevendor', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                           <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                        </a>';
                        }
                    } elseif ($permission_role->delete == '5') {
                        $btn .= '<a class="btn btn-danger site-icon delete-icon px-6" title="Delete" href="' . route('deletevendor', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                      <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                  </a>';
                    }



                    $btn .= '</div>';
                    return $btn;
                })
                ->rawColumns([
                    'action'
                ])
                ->make(true);
        }
        return view('inventory.vendor.all-vendors');
    }

    public function allVendors(Request $request)
    {
        $user = Auth::user();
        $permission_role = Roles::where('id', $user->user_role)->first();

        // Vendors query based on role "view" permissions
        if ($permission_role->view == '2') {
            $vendor = InventoryVendor::where('created_by', $user->id)
                ->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', $user->id)->pluck('id')->toArray();
            $vendor = InventoryVendor::whereIn('created_by', $employees)
                ->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', $user->id)
                ->orWhere('id', $user->id)
                ->pluck('id')->toArray();
            $vendor = InventoryVendor::whereIn('created_by', $employees)
                ->where('is_deleted', '0')->latest()->get();
        } elseif ($permission_role->view == '5') {
            $vendor = InventoryVendor::where('is_deleted', '0')->latest()->get();
        } else {
            $vendor = collect(); // empty collection if no access
        }

        // Transform vendors and attach permissions for frontend
        $vendorsData = $vendor->map(function ($row) use ($user, $permission_role) {
            $created_by = $row->created_by;
            $manager = Employees::find($created_by);

            $canEdit = false;
            $canDelete = false;

            // edit permissions
            if ($permission_role->edit == '2' && $user->id == $created_by) {
                $canEdit = true;
            } elseif ($permission_role->edit == '3' && $user->id == ($manager->manager_id ?? null)) {
                $canEdit = true;
            } elseif ($permission_role->edit == '4' && ($user->id == $manager->manager_id || $user->id == $created_by)) {
                $canEdit = true;
            } elseif ($permission_role->edit == '5') {
                $canEdit = true;
            }

            // delete permissions
            if ($permission_role->delete == '2' && $user->id == $created_by) {
                $canDelete = true;
            } elseif ($permission_role->delete == '3' && $user->id == ($manager->manager_id ?? null)) {
                $canDelete = true;
            } elseif ($permission_role->delete == '4' && ($user->id == $manager->manager_id || $user->id == $created_by)) {
                $canDelete = true;
            } elseif ($permission_role->delete == '5') {
                $canDelete = true;
            }

            Log::info('the rows are ', ['rows' => $row]);

            return [
                'id'           => $row->id,
                'name'         => $row->name,
                'created_by'   => $row->created_by,
                'company_name' => $row->company_name,
                'email' => $row->email,
                'phone' => $row->phone,
                'is_deleted'   => $row->is_deleted,
                'can_edit'     => $canEdit,
                'can_delete'   => $canDelete,
                'created_at'   => $row->created_at,
                'updated_at'   => $row->updated_at,
            ];
        });

        return response()->json([
            'vendors' => $vendorsData,
        ]);
    }



    public function addVendors(Request $request)
    {
        $data['countries'] = Country::get(["name", "id"]);

        return view('inventory.vendor.add-vendor', $data);
    }

    public function addVendorsPostOLD(Request $request)
    {
        $vendor = new InventoryVendor();


        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|unique:inventory_vendors|max:50|regex:/^[a-zA-Z\s]+$/',
                'email' => 'required|unique:inventory_vendors|regex:/(.+)@(.+)\.(.+)/i',
                'phone' => 'digits:10|unique:inventory_vendors|numeric',
                'gst_no' => 'required|nullable|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
                'zip' => 'nullable|regex:/^[0-9]{3,7}$/',
                'country' => 'required',
                'state' => 'required'
            ],
            [
                'name.required' => 'Please enter the Name',
                'name.regex' => 'Please enter valid name',
                'email.required' => 'Please enter an email',
                'email.regex' => 'Please enter valid email',
                'phone.digits' => 'Please enter 10 digit number',
                'phone.unique' => 'The Phone Number has already been taken',
                'country.required' => 'Please select the Country',
                'state.required' => 'Please select the State'
            ]

        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }
        $state_id = $request->state;
        $gg = $request->gst_no;


        $an = file_get_contents("http://sheet.gstincheck.ml/check/5cd36e6878834d58d3d175a88775c545/" . $gg);
        $obj = json_decode($an);
        $flag = $obj->{'flag'};
        if ($flag != '1') {
            return response()->json([
                'status' => 401,
                'message' => 'Gst Number is invalid'
            ]);
        }


        $sub = substr($gg, 0, 2);
        if ($sub != '') {
            if ($state_id != '') {
                $state = State::where('id', $state_id)->first();
                $code = $state->gst_state_code;
                if ($sub != $code) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Gst State Code does not match'
                    ]);
                } else {
                    $vendor->name = $request->name;
                    $vendor->email = $request->email;
                    $vendor->phone = $request->phone;
                    $vendor->company_name = $request->company_name;
                    $vendor->gst_no = $request->gst_no;
                    $vendor->zip = $request->zip;
                    $vendor->address = $request->address;
                    $vendor->country_id = $request->country;
                    $vendor->state_id = $request->state;
                    $vendor->city_id = $request->city;
                    $vendor->created_by = $created_by;

                    if ($vendor->save()) {
                        return response()->json([
                            'status' => 200,
                            'message' => "Vendor added"
                        ]);
                    } else {
                        return response()->json([
                            'status' => 401,
                            'message' => 'Something Wrong. Try Again.'
                        ]);
                    }
                }
            }
        } else {
            $vendor->name = $request->name;
            $vendor->email = $request->email;
            $vendor->phone = $request->phone;
            $vendor->company_name = $request->company_name;
            $vendor->gst_no = $request->gst_no;
            $vendor->zip = $request->zip;
            $vendor->address = $permanent_address;
            $vendor->country_id = $request->country;
            $vendor->state_id = $request->state;
            $vendor->city_id = $request->city;
            if ($vendor->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Vendor added"
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        }
    }

    public function addVendorsPost(Request $request)
    {

        Log::info('sdjd');
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|unique:inventory_vendors|max:50|regex:/^[a-zA-Z\s]+$/',
                'email' => 'required|unique:inventory_vendors|regex:/(.+)@(.+)\.(.+)/i',
                'phone' => 'digits:10|unique:inventory_vendors|numeric',
                'gst_no' => 'required|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
                'zip' => 'nullable|regex:/^[0-9]{3,7}$/',

                // 🔹 Fix: use *_id instead of plain country/state/city
                'country_id' => 'required|exists:countries,id',
                // 'state_id'   => 'required|exists:states,id',
                // 'city_id'    => 'required|exists:cities,id',
            ],
            [
                'name.required' => 'Please enter the Name',
                'email.required' => 'Please enter an email',
                'phone.digits' => 'Please enter 10 digit number',
                'country_id.required' => 'Please select the Country',
                // 'state_id.required'   => 'Please select the State',
                // 'city_id.required'    => 'Please select the City',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }

        // Permission check
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        $created_by = $permission_role->add == '2'
            ? Auth::user()->id
            : ($request->created_by ?? null);

        if (!$created_by) {
            return response()->json([
                'status' => 401,
                'message' => 'Please select to whom you would assign to'
            ]);
        }


        // need to uncomment later 

        // GST validation
        // $gst = $request->gst_no;
        // $apiResponse = file_get_contents("http://sheet.gstincheck.ml/check/5cd36e6878834d58d3d175a88775c545/" . $gst);
        // $gstData = json_decode($apiResponse);
        // if (!$gstData || $gstData->flag != '1') {
        //     return response()->json([
        //         'status' => 401,
        //         'message' => 'GST Number is invalid'
        //     ]);
        // }

        // // GST state code match
        // $sub = substr($gst, 0, 2);
        // $state = State::find($request->state_id);
        // if ($state && $sub != $state->gst_state_code) {
        //     return response()->json([
        //         'status' => 401,
        //         'message' => 'GST State Code does not match'
        //     ]);
        // }




        // Save vendor
        $vendor = new InventoryVendor();
        Log::info('the name is ', ['name' => $request->name]);

        $vendor->fill([
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'company_name' => $request->company_name,
            'gst_no'      => '07AAXXX1234A1Z5', //gst number passed static pass -> $gst
            'zip'         => $request->zip,
            'address'     => $request->address,
            'country_id'  => $request->country_id,
            'state_id'    => $request->state_id,
            'city_id'     => $request->city_id,
            'created_by'  => $created_by,
        ]);


        if ($vendor->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Vendor added successfully'
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something went wrong. Try again.'
        ]);
    }

    // public function editVendorOLD(Request $request, $vendor_id)
    // {
    //     $vendor = InventoryVendor::where('id', $vendor_id)->first();
    //     $country_id = $vendor->country_id;
    //     $state_id = $vendor->state_id;
    //     $city_id = $vendor->city_id;
    //     $states = State::where('country_id', $country_id)->get();
    //     $cities = City::where('state_id', $state_id)->get();
    //     $data['countries'] = Country::get(["name", "id"]);

    //     return view('inventory.vendor.edit-vendor', $data, compact('vendor', 'country_id', 'state_id', 'city_id', 'states', 'cities'));
    // }

    public function editVendor(Request $request, $vendor_id)
    {
        $vendor = InventoryVendor::where('id', $vendor_id)->first();
        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }


        $country_id = $vendor->country_id;
        $current_country = Country::where('id', $country_id)->get(['id', 'name']);
        $state_id = $vendor->state_id;
        $current_state = State::where('id', $state_id)->get(['id', 'name']);
        $city_id = $vendor->city_id;
        $current_city = City::where('id', $city_id)->get(['id', 'name']);

        $states = State::where('country_id', $country_id)->get(["id", "name"]);
        $cities = City::where('state_id', $state_id)->get(["id", "name"]);
        $countries = Country::get(["id", "name"]);


        Log::info('my states is ', ['states is' => $current_country]);

        return response()->json([
            "vendor" => $vendor,
            "country_id" => $country_id,
            "current_country" => $current_country,
            "current_state" => $current_state,
            "current_city" => $current_city,
            "state_id" => $state_id,
            "city_id" => $city_id,
            "states" => $states,
            "cities" => $cities,
            "countries" => $countries,
        ]);
    }


    public function editVendorPostOLD(Request $request)
    {
        $vendorid = $request->vendor_id;
        $vendor = InventoryVendor::where('id', $vendorid)->first();

        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:50|regex:/^[a-zA-Z\s]+$/',
                'email' => 'required|regex:/(.+)@(.+)\.(.+)/i',
                'phone' => 'digits:10|numeric',
                'gst_no' => 'nullable|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
                'zip' => 'nullable|regex:/^[0-9]{3,7}$/',
                'country' => 'required',
                'state' => 'required'
            ],
            [
                'name.required' => 'Please enter the Name',
                'name.regex' => 'Please enter valid name',
                'email.required' => 'Please enter an email',
                'email.regex' => 'Please enter valid email',
                'phone.digits' => 'Please enter 10 digit number',
                'country.required' => 'Please select the Country',
                'state.required' => 'Please select the State'
            ]

        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $state_id = $request->state;
        $gg = $request->gst_no;

        if ($gg) {
            $an = file_get_contents("http://sheet.gstincheck.ml/check/5cd36e6878834d58d3d175a88775c545/" . $gg);
            $obj = json_decode($an);
            $flag = $obj->{'flag'};
            if ($flag != '1') {
                return response()->json([
                    'status' => 401,
                    'message' => 'Gst Number is invalid'
                ]);
            }
        } else {
            $vendor->name = $request->name;
            $vendor->email = $request->email;
            $vendor->phone = $request->phone;
            $vendor->company_name = $request->company_name;
            $vendor->gst_no = $request->gst_no;
            $vendor->zip = $request->zip;
            $vendor->address = $request->address;
            $vendor->country_id = $request->country;
            $vendor->state_id = $request->state;
            $vendor->city_id = $request->city;

            if ($vendor->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Vendor Updated"
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        }

        $sub = substr($gg, 0, 2);
        if ($sub != '') {
            if ($state_id != '') {
                $state = State::where('id', $state_id)->first();
                $code = $state->gst_state_code;
                if ($sub != $code) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Gst State Code does not match'
                    ]);
                } else {
                    $vendor->name = $request->name;
                    $vendor->email = $request->email;
                    $vendor->phone = $request->phone;
                    $vendor->company_name = $request->company_name;
                    $vendor->gst_no = $request->gst_no;
                    $vendor->zip = $request->zip;
                    $vendor->address = $request->address;
                    $vendor->country_id = $request->country;
                    $vendor->state_id = $request->state;
                    $vendor->city_id = $request->city;

                    if ($vendor->save()) {
                        return response()->json([
                            'status' => 200,
                            'message' => "Vendor Updated"
                        ]);
                    } else {
                        return response()->json([
                            'status' => 401,
                            'message' => 'Something Wrong. Try Again.'
                        ]);
                    }
                }
            }
        } else {
            $vendor->name = $request->name;
            $vendor->email = $request->email;
            $vendor->phone = $request->phone;
            $vendor->company_name = $request->company_name;
            $vendor->gst_no = $request->gst_no;
            $vendor->zip = $request->zip;
            $vendor->address = $request->address;
            $vendor->country_id = $request->country;
            $vendor->state_id = $request->state;
            $vendor->city_id = $request->city;
            if ($vendor->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => "Vendor Updated"
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        }
    }


    public function editVendorPost(Request $request)
    {
        $vendorid = $request->id;
        $vendor = InventoryVendor::where('id', $vendorid)->first();
        Log::info('my request is >>', ['request' => $request->all()]);
        if (!$vendor) {
            return response()->json([
                'status' => 404,
                'message' => 'Vendor not found'
            ]);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:50|regex:/^[a-zA-Z\s]+$/',
                'email' => 'required|regex:/(.+)@(.+)\.(.+)/i',
                'phone' => 'digits:10|numeric',
                'zip' => 'nullable|regex:/^[0-9]{3,7}$/',
                'country_id' => 'required',
                // 'state_id' => 'required'
            ],
            [
                'name.required' => 'Please enter the Name',
                'name.regex' => 'Please enter valid name',
                'email.required' => 'Please enter an email',
                'email.regex' => 'Please enter valid email',
                'phone.digits' => 'Please enter 10 digit number',
                'country_id.required' => 'Please select the Country',
                // 'state_id.required' => 'Please select the State'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }

        // update vendor
        $vendor->name = $request->name;
        $vendor->email = $request->email;
        $vendor->phone = $request->phone;
        $vendor->company_name = $request->company_name;
        $vendor->gst_no = $request->gst_no;
        $vendor->zip = $request->zip;
        $vendor->address = $request->address;
        $vendor->country_id = $request->country_id;
        $vendor->state_id = $request->state_id;
        $vendor->city_id = $request->city_id;

        if ($vendor->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Vendor Updated"
            ]);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try Again.'
            ]);
        }
    }




    // public function deleteVendorOLD($vendor_id)
    // {
    //     $vendor = InventoryVendor::findOrFail($vendor_id);
    //     if ($vendor) {
    //         $vendor->is_deleted = "1";
    //         if ($vendor->save()) {
    //             return redirect()->route('allvendors')->with('success', 'Vendor deleted.');
    //         } else {
    //             return redirect()->route('allvendors')->with('error', 'Something wrong. Try again.');
    //         }
    //     }
    // }

    public function deleteVendor($vendor_id)
    {
        $vendor = InventoryVendor::findOrFail($vendor_id);

        if ($vendor) {
            $vendor->is_deleted = "1";
            if ($vendor->save()) {
                return response()->json(['status' => 200, 'message' => 'Vendor deleted successfully.']);
            } else {
                return response()->json(['status' => 500, 'message' => 'Something went wrong. Try again.']);
            }
        }
    }

    public function allInventoriesOLD(Request $request)
    {
        if (!in_array('inventory_management', Session::get('permission')[0])) {
            abort(404);
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->where('created_by', Auth::user()->id)->where('is_deleted', '0');
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->whereIn('created_by', $employees)->where('is_deleted', '0');
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->whereIn('created_by', $employees)->where('is_deleted', '0');
        } elseif ($permission_role->view == '5') {
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->where('is_deleted', '0');
        }
        if ($request->ajax()) {

            $data = $data->whereIn('status', [1, 2, 3])->orderBy('created_at', 'desc')->get();


            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('category_id', function ($row) {
                    $id = $row->category_id;
                    if ($id != null) {
                        $cat = $row->category->category_name;
                        return $cat;
                    } elseif ($id == null) {
                        return '-';
                    }
                })
                ->editcolumn('subcategory_id', function ($row) {
                    $id = $row->subcategory_id;
                    if ($id != null) {
                        $subcat = $row->subcategory->category_name;
                        return $subcat;
                    } elseif ($id == null) {
                        return '-';
                    }
                })
                ->editcolumn('vendor_id', function ($row) {
                    $id = $row->vendor_id;
                    if ($id != null) {
                        $vendor = $row->vendor->name;
                        return $vendor;
                    } elseif ($id == null) {
                        return '-';
                    }
                })

                ->editcolumn('status', function ($row) {
                    $btn = '<div class="btn-group btn-group-sm appbtns"  id="reqbtn-' . $row->id . '">';
                    if ($row->status == 2) {
                        $btn .= '<a class="btn btn-info site-main-btn">Approved</a>';
                    } else if ($row->status == 1) {
                        $btn  .= '<a class="btn btn-warning">Pending</a>';
                    } else {
                        $btn .= '<a class="btn btn-danger">Declined</a>';
                    }
                    $btn .= '</div>';
                    return $btn;
                })


                ->rawColumns([
                    'category_id',
                    'subcategory_id',
                    'vendor',
                    'status'
                ])
                ->make(true);
        }
        return view('inventory.all-inventory');
    }


    public function allInventories(Request $request)
    {
        try {
            // Permission check
            // if (!in_array('inventory_management', Session::get('permission')[0])) {
            //     return response()->json([
            //         'status' => 403,
            //         'message' => 'Forbidden: You do not have access to inventory management'
            //     ], 403);
            // }

            // Get role
            $permission_role = Roles::where('id', Auth::user()->user_role)->first();

            // Query builder based on role view
            if ($permission_role->view == '2') {
                $data = InventoryItems::with('category', 'subcategory', 'vendor')
                    ->where('created_by', Auth::user()->id)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '3') {
                $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
                $data = InventoryItems::with('category', 'subcategory', 'vendor')
                    ->whereIn('created_by', $employees)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '4') {
                $employees = Employees::where('manager_id', Auth::user()->id)
                    ->orWhere('id', Auth::user()->id)
                    ->pluck('id')
                    ->toArray();
                $data = InventoryItems::with('category', 'subcategory', 'vendor')
                    ->whereIn('created_by', $employees)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '5') {
                $data = InventoryItems::with('category', 'subcategory', 'vendor')
                    ->where('is_deleted', '0');
            } else {
                return response()->json([
                    'status' => 403,
                    'message' => 'Forbidden: Invalid role permission'
                ], 403);
            }

            // Filter + fetch records
            $data = $data->whereIn('status', [1, 2, 3])
                ->orderBy('created_at', 'desc')
                ->get();

            // Transform response (like your editColumn logic)
            $response = $data->map(function ($row) {
                return [
                    'id' => $row->id,
                    'category' => $row->category?->category_name ?? '-',
                    'subcategory' => $row->subcategory?->category_name ?? '-',
                    'vendor' => $row->vendor?->name ?? '-',
                    'status' => $row->status == 2
                        ? 'Approved'
                        : ($row->status == 1 ? 'Pending' : 'Declined'),
                    'created_by' => $row->created_by,
                    'created_at' => $row->created_at,
                ];
            });

            return response()->json([
                'status' => 200,
                'count' => $response->count(),
                'data' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    
    public function addInventoryOLD(Request $request)
    {
        $s = InventoryCategory::all()->where('parent_category_id', '=', '0')->where('is_deleted', '0');
        $vendors = InventoryVendor::orderBy('name', 'ASC')->get();
        return view('inventory.add-inventory', compact('s', 'vendors'));
    }
    public function  addAjaxInventoryOLD(Request $request, $id)
    {
        $cat_id = $request->id;
        $subcategories = InventoryCategory::where('parent_category_id', '=', $cat_id)->get();
        return response()->json([
            'category' => $subcategories
        ]);
    }

    public function addInventoryPostOLD(Request $request)
    {
        $loginuser = Auth::user();
        $inventory = new InventoryItems();
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|unique:inventory_items',
                'category' => 'required',
                'subcategory' => 'required',
                'vendor' => 'nullable',
                'category_type' => 'required',
                'quantity' => 'required',
                'upload_warrenty_card' => 'max:2048|mimes:jpeg,png,jpg',
                'bill_upload' => 'max:2048|mimes:jpeg,png,jpg',
            ],
            [
                'name.required' => 'Please enter an Item name',
                'category.required' => 'Please select Category',
                'subcategory.required' => 'Go to category management and add the corresponding subcategory first',
                'category_type.required' => 'Please select item type',
                'quantity.required' => 'Please add some quantity',
                'upload_warrenty_card.uploaded' => 'Warrenty Card size should not exceed upto 2mb',
                'bill_upload.max' => 'Bill Size should not exceed upto 2mb',
                'bill_upload.mimes' => 'Bill extension not allowed',
                'bill_upload.uploaded' => 'Bill size should not exceed upto 2mb',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }

        $inventory->name = $request->name;
        $inventory->category_id = $request->category;
        $inventory->subcategory_id = $request->subcategory;
        $inventory->hardware_type = $request->hardwaretype;
        $inventory->notes = $request->notes;
        $inventory->vendor_id = $request->vendor;
        $inventory->room_id = '0';
        $inventory->employee_id = '0';
        $inventory->category_type = $request->category_type;
        $inventory->quantity = $request->quantity;
        $inventory->in_stock = $request->quantity;
        $inventory->created_by = $created_by;
        if ($file = $request->file('upload_warrenty_card')) {
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/warrenty/', $name)) {
                $inventory->upload_warrenty_card = $name;
            }
        }

        if ($file = $request->file('bill_upload')) {
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/bills/', $name)) {
                $inventory->bill_upload = $name;
            }
        }

        if ($inventory->save()) {
            $getchange =  $inventory->toArray();
            $after = implode("\n", array_map(
                function ($v, $k) {
                    return $k . ':' . $v;
                },
                $getchange,
                array_keys($getchange)
            ));

            $noti = new Notifications();
            $noti->type_id = 'inventory_approval_request';
            $noti->message = ' inventory request ';
            $noti->page_id = '2';
            $noti->notify_to = $loginuser->id;
            $noti->save();

            $logs = new InventoryLogs();
            $logs->user_id = $loginuser->id;
            $logs->item_id = $inventory->id;
            $logs->message = 'Item ' . $inventory->name . ' is added by ' . $loginuser->name . '';
            $logs->log_type = '2';
            $logs->before = "-";
            $logs->after = $after;
            $logs->ip_address = $_SERVER['SERVER_ADDR'];
            $logs->port_number = $_SERVER['SERVER_PORT'];
            $logs->device_name = gethostname();
            $logs->browser_detail = $_SERVER['HTTP_USER_AGENT'];
            $logs->save();


            return response()->json([
                'status' => 200,
                'message' => "Inventory added"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    public function addInventory(Request $request)
    {
        try {
            $categories = InventoryCategory::where('parent_category_id', 0)
                ->where('is_deleted', '0')
                ->get();

            $vendors = InventoryVendor::orderBy('name', 'ASC')->get();

            return response()->json([
                'status' => 200,
                'categories' => $categories,
                'vendors' => $vendors,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addAjaxInventory(Request $request, $id)
    {
        try {
            $subcategories = InventoryCategory::where('parent_category_id', $id)->get();

            return response()->json([
                'status' => 200,
                'category' => $subcategories,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addInventoryPost11(Request $request)
    {
        try {
            $loginuser = Auth::user();

            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required|unique:inventory_items',
                    'category' => 'required',
                    'subcategory' => 'required',
                    'vendor' => 'nullable',
                    'category_type' => 'required',
                    'quantity' => 'required|numeric|min:1',
                    'upload_warrenty_card' => 'nullable|mimes:jpeg,png,jpg|max:2048',
                    'bill_upload' => 'nullable|mimes:jpeg,png,jpg|max:2048',
                ],
                [
                    'name.required' => 'Please enter an Item name',
                    'category.required' => 'Please select Category',
                    'subcategory.required' => 'Go to category management and add the corresponding subcategory first',
                    'category_type.required' => 'Please select item type',
                    'quantity.required' => 'Please add some quantity',
                    'upload_warrenty_card.max' => 'Warrenty Card size should not exceed upto 2mb',
                    'bill_upload.max' => 'Bill Size should not exceed upto 2mb',
                    'bill_upload.mimes' => 'Bill extension not allowed',
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()->first(),
                ], 401);
            }

            $permission_role = Roles::where('id', $loginuser->user_role)->first();
            if ($permission_role->add == '2') {
                $created_by = $loginuser->id;
            } else {
                if (empty($request->created_by)) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Please select to whom you would assign to',
                    ], 401);
                }
                $created_by = $request->created_by;
            }

            $inventory = new InventoryItems();
            $inventory->name = $request->name;
            $inventory->category_id = $request->category;
            $inventory->subcategory_id = $request->subcategory;
            $inventory->hardware_type = $request->hardwaretype;
            $inventory->notes = $request->notes;
            $inventory->vendor_id = $request->vendor;
            $inventory->room_id = 0;
            $inventory->employee_id = 0;
            $inventory->category_type = $request->category_type;
            $inventory->quantity = $request->quantity;
            $inventory->in_stock = $request->quantity;
            $inventory->created_by = $created_by;

            // ✅ File upload
            if ($file = $request->file('upload_warrenty_card')) {
                $name = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('uploads/warrenty/'), $name);
                $inventory->upload_warrenty_card = $name;
            }

            if ($file = $request->file('bill_upload')) {
                $name = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('uploads/bills/'), $name);
                $inventory->bill_upload = $name;
            }

            if ($inventory->save()) {
                // ✅ Track changes
                $getchange = $inventory->toArray();
                $after = implode("\n", array_map(
                    fn ($v, $k) => $k . ':' . $v,
                    $getchange,
                    array_keys($getchange)
                ));

                // ✅ Notification
                $noti = new Notifications();
                $noti->type_id = 'inventory_approval_request';
                $noti->message = 'Inventory request';
                $noti->page_id = '2';
                $noti->notify_to = $loginuser->id;
                $noti->save();

                // ✅ Logs
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' is added by ' . $loginuser->name;
                $logs->log_type = '2';
                $logs->before = "-";
                $logs->after = $after;
                $logs->ip_address = request()->ip();
                $logs->port_number = request()->getPort();
                $logs->device_name = gethostname();
                $logs->browser_detail = $request->header('User-Agent');
                $logs->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory added successfully',
                    'data' => $inventory,
                ]);
            }

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addInventoryPost(Request $request)
    {
        try {
            // ✅ Validation
            $validator = Validator::make($request->all(), [
                'name'          => 'required|string|max:255',
                'category'      => 'required|integer',
                'subcategory'   => 'required|integer',
                'vendor'        => 'required|integer',
                'category_type' => 'required|string',
                'hardware_type' => 'required|string|max:255', // 👈 Important
                'quantity'      => 'required|integer|min:1',
                'notes'         => 'nullable|string',
                'created_by'    => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 401,
                    'message' => $validator->errors()->first()
                ], 401);
            }

            // ✅ Create inventory item
            $inventory = new InventoryItems();
            $inventory->name          = $request->name;
            $inventory->category_id   = $request->category;
            $inventory->subcategory_id= $request->subcategory;
            $inventory->vendor_id     = $request->vendor;
            $inventory->category_type = $request->category_type;
            $inventory->hardware_type = $request->hardware_type; // 👈 Now stored correctly
            $inventory->quantity      = $request->quantity;
            $inventory->in_stock      = $request->quantity;
            $inventory->notes         = $request->notes ?? null;
            $inventory->room_id       = $request->room_id ?? 0;
            $inventory->employee_id   = $request->employee_id ?? 0;
            $inventory->created_by    = $request->created_by;
            $inventory->is_deleted    = 0;

            if ($inventory->save()) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Inventory item added successfully',
                    'data'    => $inventory
                ], 200);
            } else {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Failed to add inventory item'
                ], 500);
            }

        } catch (Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function inventoryRequestold(Request $request)
    {
        // if(!in_array('inventory_requests', Session::get('permission')[0])){
        //     abort(404);
        // }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->where('created_by', Auth::user()->id)->where('is_deleted', '0');
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->whereIn('created_by', $employees)->where('is_deleted', '0');
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->whereIn('created_by', $employees)->where('is_deleted', '0');
        } elseif ($permission_role->view == '5') {
            $data = InventoryItems::with('category', 'subcategory', 'vendor')->where('is_deleted', '0');
        }


        if ($request->ajax()) {

            if (!empty($request->startdate) && !empty($request->startdate)) {
                $data->whereBetween('created_at', [$request->startdate . ' 00:00:00', $request->enddate . ' 23:59:59']);
            }
            $data = $data->whereIn('status', [1, 2]);
            $data = $data->get();
            return DataTables::of($data)->addIndexColumn()
                ->editcolumn('category_id', function ($row) {
                    $id = $row->category_id;
                    if ($id != null) {
                        $cat = $row->category->category_name;
                        return $cat;
                    } elseif ($id == null) {
                        return '-';
                    }
                })
                ->editcolumn('subcategory_id', function ($row) {
                    $id = $row->subcategory_id;
                    if ($id != null) {
                        $subcat = $row->subcategory->category_name;
                        return $subcat;
                    } elseif ($id == null) {
                        return '-';
                    }
                })
                ->editcolumn('vendor_id', function ($row) {
                    $id = $row->vendor_id;
                    if ($id != null) {
                        $vendor = $row->vendor->name;
                        return $vendor;
                    } elseif ($id == null) {
                        return '-';
                    }
                })
                ->editcolumn('employee_id', function ($row) {
                    $id = $row->employee_id;
                    if ($id == 0) {
                        return '-';
                    } else {
                        return $row->employee->name;
                    }
                })
                ->editcolumn('stock', function ($row) {
                    $stock = $row->stock;
                    $in_stock = $row->in_stock;
                    if ($stock == 1) {
                        if ($in_stock == 0) {
                            return 'Out of Stock';
                        } else {
                            return 'In Stock';
                        }
                    } else {
                        return 'Out of Stock';
                    }
                })
                ->editcolumn('room_id', function ($row) {
                    $id = $row->room_id;
                    if ($id == 0) {
                        return '-';
                    } else {
                        return $row->room->room_name;
                    }
                })
                ->editcolumn('faulty', function ($row) {
                    $fault = $row->faulty;
                    if ($fault == 1) {
                        return 'Yes';
                    } else {
                        return 'No';
                    }
                })
                ->editcolumn('category_type', function ($row) {
                    $category = $row->category_type;
                    if ($category == 0) {
                        return 'Non-Consumable';
                    } else {
                        return 'Consumables';
                    }
                })
                ->editcolumn('created_at', function ($row) {
                    $date = $row->created_at;
                    return $date->format('Y-m-d');
                })

                ->editcolumn('status', function ($row) {
                    if ($row->status == 2) {
                        $btn = 'Approved';
                    } else if ($row->status == 3) {
                        $btn = 'Declined';
                    } else {
                        $btn = 'Pending';
                    }
                    return $btn;
                })
                ->addColumn('action', function ($row) {
                    $id = Auth::user()->id;
                    $created_by = $row->created_by;
                    $manager =  Employees::where('id', $created_by)->first();
                    $permission_role = Roles::where('id', Auth::user()->user_role)->first();
                    $btn = '<div class="btn-group btn-group-sm appbtns"  id="reqbtn-' . $row->id . '">';
                    if (in_array($row->status, [
                        2,
                        3
                    ])) {
                        if ($row->status == 2) {
                            $btn .= '<li style="list-style:none;" class="nav-item dropdown"><a class="btn-sm btn-success site-main-btn"
                    data-toggle="dropdown">Action<i
                        class="fas fa-sort-down pl-1" style="vertical-align: text-top;"></i>
                      </a>
                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">';

                            if ($permission_role->edit == '2') {
                                if ($id == $created_by) {
                                    $btn .= '<a href="' . route('editinventory', $row->id) . '"
                                  class="dropdown-item"> Edit </a>';
                                }
                            } elseif ($permission_role->edit == '3') {
                                if ($id == $manager->manager_id) {
                                    $btn .= '<a href="' . route('editinventory', $row->id) . '"
                                  class="dropdown-item"> Edit </a>';
                                }
                            } elseif ($permission_role->edit == '4') {
                                if ($id == $manager->manager_id || $id == $created_by) {
                                    $btn .= '<a href="' . route('editinventory', $row->id) . '"
                                  class="dropdown-item"> Edit </a>';
                                }
                            } elseif ($permission_role->edit == '5') {
                                $btn .= '<a href="' . route('editinventory', $row->id) . '"
                                  class="dropdown-item"> Edit </a>';
                            }

                            if ($permission_role->delete == '2') {
                                if ($id == $created_by) {
                                    $btn .= '<a href="' . route('deleteinventory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')"
                            class="dropdown-item"> Delete </a>';
                                }
                            } elseif ($permission_role->delete == '3') {
                                if ($id == $manager->manager_id) {
                                    $btn .= '<a href="' . route('deleteinventory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')"
                            class="dropdown-item"> Delete </a>';
                                }
                            } elseif ($permission_role->delete == '4') {
                                if ($id == $manager->manager_id || $id == $created_by) {
                                    $btn .= '<a href="' . route('deleteinventory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')"
                            class="dropdown-item"> Delete </a>';
                                }
                            } elseif ($permission_role->delete == '5') {
                                $btn .= '<a href="' . route('deleteinventory', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')"
                            class="dropdown-item"> Delete </a>';
                            }



                            if ($row->category_type == 0) {
                                if ($row->stock == 1) {
                                    $btn .= '<a href="' . route('allocation', $row->id) . '" class="dropdown-item"> Allocate </a>';
                                } else {
                                    $btn .= '<a href="' . route('deallocation', $row->id) . '" class="dropdown-item">Deallocate</a>';
                                }
                            } else {
                                $btn .= '<a href="' . route('managestock', $row->id) . '" class="dropdown-item"> Manage Stock </a>';
                            }


                            if ($row->faulty == 0) {
                                $btn .= '<a href="' . route('faulty', $row->id) . '" class="dropdown-item"> Faulty </a> 
                    </div></li>';
                            } else {

                                $btn .= '<a href="' . route('faultless', $row->id) . '" class="dropdown-item">Faultless</a> 
                       </div></li>';
                            }


                            $btn .= '</div>';
                            return $btn;
                        } else {
                            $btn .= 'Declined';
                        }
                    } else {
                        $btn .= '<a class="btn btn-success approvalModalClick" data-notes="' . $row->reason . '" data-type="accept" title="Yes" data-id="' . $row->id . '" href="javascript:void(0)"  >Approve</a>';
                        $btn .= '<a class="btn btn-danger" href="' . route('declineinventory', $row->id) . '" >Decline</a>';
                    }
                    $btn .= '</div>';
                    return $btn;
                })

                ->rawColumns([
                    'category_id',
                    'subcategory_id',
                    'vendor',
                    'status',
                    'action'

                ])
                ->make(true);
        }
        return view('inventory.inventory-requests');
    }

    public function inventoryRequest(Request $request)
    {
        try {
            $loginuser = Auth::user();
            $permission_role = Roles::where('id', $loginuser->user_role)->first();

            // ✅ Apply role-based visibility
            if ($permission_role->view == '2') {
                $data = InventoryItems::with(['category', 'subcategory', 'vendor', 'employee', 'room'])
                    ->where('created_by', $loginuser->id)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '3') {
                $employees = Employees::where('manager_id', $loginuser->id)->pluck('id')->toArray();
                $data = InventoryItems::with(['category', 'subcategory', 'vendor', 'employee', 'room'])
                    ->whereIn('created_by', $employees)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '4') {
                $employees = Employees::where('manager_id', $loginuser->id)
                    ->orWhere('id', $loginuser->id)
                    ->pluck('id')->toArray();
                $data = InventoryItems::with(['category', 'subcategory', 'vendor', 'employee', 'room'])
                    ->whereIn('created_by', $employees)
                    ->where('is_deleted', '0');
            } elseif ($permission_role->view == '5') {
                $data = InventoryItems::with(['category', 'subcategory', 'vendor', 'employee', 'room'])
                    ->where('is_deleted', '0');
            } else {
                return response()->json([
                    'status' => 403,
                    'message' => 'You do not have permission to view inventory requests'
                ], 403);
            }

            // ✅ Date filter
            if (!empty($request->startdate) && !empty($request->enddate)) {
                $data->whereBetween('created_at', [$request->startdate . ' 00:00:00', $request->enddate . ' 23:59:59']);
            }

            // ✅ Only approved/pending items
            $data = $data->whereIn('status', [1, 2])->get();

            // ✅ Transform response (same logic as editColumn in Blade)
            $response = $data->map(function ($row) use ($loginuser, $permission_role) {
                return [
                    'id' => $row->id,
                    'name' => $row->name,
                    'category' => $row->category?->category_name ?? '-',
                    'subcategory' => $row->subcategory?->category_name ?? '-',
                    'vendor' => $row->vendor?->name ?? '-',
                    'employee' => $row->employee_id == 0 ? '-' : $row->employee?->name,
                    'room' => $row->room_id == 0 ? '-' : $row->room?->room_name,
                    'stock_status' => $row->stock == 1 ? ($row->in_stock == 0 ? 'Out of Stock' : 'In Stock') : 'Out of Stock',
                    'faulty' => $row->faulty == 1 ? 'Yes' : 'No',
                    'category_type' => $row->category_type == 0 ? 'Non-Consumable' : 'Consumables',
                    'created_at' => $row->created_at?->format('Y-m-d'),
                    'status' => $row->status == 2 ? 'Approved' : ($row->status == 3 ? 'Declined' : 'Pending'),
                ];
            });

            return response()->json([
                'status' => 200,
                'message' => 'Inventory requests fetched successfully',
                'data' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function declineInventoryRequestold(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => 'Reason field is required.'
            ]);
        }

        $loginuser = Auth::user();
        $inventory = InventoryItems::where('id', $request->get_approval_id)->first();
        if ($inventory) {
            $inventory->status = 3;
            // $empdb->approved_time = $loginuser->iddate;
            $ss = 'Declined';

            if ($inventory->save()) {

                // This needs to be dynamically.
                $manager_id = $loginuser->manager_id;
                $hr = 1;

                // Notification for admin
                $noti = new Notifications();
                $noti->type_id = 'inventory_approval_request';
                $noti->message = 'Your Inventory request has been Declined.';
                $noti->page_id = '2';
                $noti->notify_to = $loginuser->id;
                $noti->save();


                return response()->json([
                    'status' => 200,
                    'message' => "Successfully updated."
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something Wrong. Try Again.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    public function declineInventoryRequest(Request $request)
    {
        try {
            // ✅ Validation
            $validator = Validator::make($request->all(), [
                'get_approval_id' => 'required|integer|exists:inventory_items,id',
                'notes' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()->first()
                ], 401);
            }

            $inventory = InventoryItems::where('id', $request->get_approval_id)->first();

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory item not found.'
                ], 404);
            }

            // ✅ Update only status (no reason column in DB)
            $inventory->status = 3; // Declined
            $ss = 'Declined';

            if ($inventory->save()) {
                // ✅ Notification
                $noti = new Notifications();
                $noti->type_id = 'inventory_approval_request';
                $noti->message = 'Your Inventory request has been Declined.';
                $noti->page_id = '2';
                $noti->notify_to = $inventory->created_by;
                $noti->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory request declined successfully.',
                    'data' => [
                        'id' => $inventory->id,
                        'name' => $inventory->name,
                        'status' => $ss,
                        'reason' => $request->notes // only in response, not DB
                    ]
                ], 200);
            }

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }



    public function approveInventoryRequestold(Request $request)
    {
        $loginuser = Auth::user();
        foreach ($request->rows_ids as $row_id) {
            $empdb = InventoryItems::where('id', $row_id)->first();
            if ($empdb) {
                $empdb->status = 2;
                if ($empdb->save()) {
                    // Notification for admin
                    $noti = new Notifications();
                    $noti->type_id = 'inventory_approval_request';
                    $noti->message = 'Your inventory request has been approved.';
                    $noti->page_id = '2';
                    $noti->notify_to = $loginuser->id;
                    $noti->save();

                    $logs = new InventoryLogs();
                    $logs->user_id = $loginuser->id;
                    $logs->item_id = $empdb->id;
                    $logs->message = 'Item ' . $empdb->name . ' is aprroved by ' . $loginuser->name . '';
                    $logs->log_type = '3';
                    $logs->ip_address = $_SERVER['SERVER_ADDR'];
                    $logs->port_number = $_SERVER['SERVER_PORT'];
                    $logs->device_name = gethostname();
                    $logs->browser_detail = $_SERVER['HTTP_USER_AGENT'];
                    $logs->save();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => "Successfully updated."
        ]);
    }


    public function approveInventoryRequest(Request $request)
    {
        try {
            // ✅ Validation
            $validator = Validator::make($request->all(), [
                'rows_ids' => 'required|array|min:1',
                'rows_ids.*' => 'integer|exists:inventory_items,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 401,
                    'message' => $validator->errors()->first()
                ], 401);
            }

            $loginuser = Auth::user();
            $updatedItems = [];

            foreach ($request->rows_ids as $row_id) {
                $empdb = InventoryItems::where('id', $row_id)->first();

                if ($empdb) {
                    // ✅ Log "before" status
                    $beforeStatus = $empdb->status;

                    // ✅ Update inventory
                    $empdb->status = 2; // Approved
                    if ($empdb->save()) {

                        // ✅ Notification for creator
                        $noti = new Notifications();
                        $noti->type_id = 'inventory_approval_request';
                        $noti->message = 'Your inventory request has been approved.';
                        $noti->page_id = '2';
                        $noti->notify_to = $empdb->created_by ?? $loginuser->id;
                        $noti->save();

                        // ✅ Log action
                        $logs = new InventoryLogs();
                        $logs->user_id       = $loginuser->id;
                        $logs->item_id       = $empdb->id;
                        $logs->message       = 'Item ' . $empdb->name . ' is approved by ' . $loginuser->name;
                        $logs->log_type      = '3';
                        $logs->before        = $beforeStatus;    // Previous status
                        $logs->after         = $empdb->status;   // New status
                        $logs->ip_address    = request()->ip();
                        $logs->port_number   = request()->getPort();
                        $logs->device_name   = gethostname();
                        $logs->browser_detail = request()->header('User-Agent');
                        $logs->save();

                        $updatedItems[] = [
                            'id'     => $empdb->id,
                            'name'   => $empdb->name,
                            'status' => 'Approved'
                        ];
                    }
                }
            }

            return response()->json([
                'status'  => 200,
                'message' => "Successfully updated.",
                'data'    => $updatedItems
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }



    public function editInventoryold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::with('category', 'subcategory', 'vendor')->where('id', $inventory_id)->first();
        $allitems = InventoryCategory::where('parent_category_id', '0')->get();
        $vendors = InventoryVendor::orderBy('name', 'ASC')->get();
        $rooms = InventoryRooms::orderBy('room_name', 'ASC')->get();
        return view('inventory.edit-inventory', compact('inventory', 'vendors', 'allitems', 'rooms'));
    }

    public function  editAjaxInventoryold(Request $request, $id)
    {
        $cat_id = $request->id;
        $subcategories = InventoryCategory::where('parent_category_id', '=', $cat_id)->get();
        return response()->json([
            'category' => $subcategories
        ]);
    }

    public function editInventoryPostold(Request $request)
    {
        $loginuser = Auth::user();
        $inventoryid = $request->inventory_id;
        $inventory = InventoryItems::where('id', $inventoryid)->first();
        $quantity = $inventory->quantity;
        $stock = $inventory->in_stock;

        $original = $inventory->getOriginal();
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'category' => 'required',
                'subcategory' => 'required',
                'vendor' => 'nullable',
                'upload_warrenty_card' => 'max:2048|mimes:jpeg,png,jpg',
                'bill_upload' => 'max:2048|mimes:jpeg,png,jpg',
            ],
            [
                'name.required' => 'Please enter an Item name',
                'category.required' => 'Please select Category',
                'subcategory.required' => 'Go to Category Management and add the corresponding Subcategory first',
                'upload_warrenty_card.uploaded' => 'Warrenty Card size should not exceed upto 2mb',
                'bill_upload.max' => 'Bill Size should not exceed upto 2mb',
                'bill_upload.mimes' => 'Bill extension not allowed',
                'bill_upload.uploaded' => 'Bill size should not exceed upto 2mb',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $inventory->name = $request->name;
        $inventory->category_id = $request->category;
        $inventory->subcategory_id = $request->subcategory;
        $inventory->hardware_type = $request->hardwaretype;
        $inventory->notes = $request->notes;
        $inventory->vendor_id = $request->vendor;
        $inventory->category_type = $request->category_type;
        $inventory->quantity = $request->quantity + $quantity;

        $inventory->in_stock = $request->quantity + $stock;
        $inventory->room_id = $request->room_id;

        if ($file = $request->file('upload_warrenty_card')) {
            $path = public_path() . '/uploads/warrenty/';
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/warrenty/', $name)) {
                if ($inventory->upload_warrenty_card != ''  && $inventory->upload_warrenty_card != null) {
                    unlink($path . $inventory->upload_warrenty_card);
                }
                $inventory->upload_warrenty_card = $name;
            }
        }

        if ($file = $request->file('bill_upload')) {
            $path = public_path() . '/uploads/bills/';
            $name = time() . '-' . $file->getClientOriginalName();
            if ($file->move(public_path('/') . 'uploads/bills/', $name)) {
                if ($inventory->bill_upload != ''  && $inventory->bill_upload != null) {
                    unlink($path . $inventory->bill_upload);
                }
                $inventory->bill_upload = $name;
            }
        }



        if ($inventory->save()) {
            //before and after update
            $getchange =  $inventory->getChanges();
            $after = implode("\n", array_map(
                function ($v, $k) {
                    return $k . ':' . $v;
                },
                $getchange,
                array_keys($getchange)
            ));
            $result = array_intersect_key($original, $getchange);
            $before =  implode("\n", array_map(
                function ($v, $k) {
                    return $k . ':' . $v;
                },
                $result,
                array_keys($result)
            ));

            //addto logs
            $logs = new InventoryLogs();
            $logs->user_id = $loginuser->id;
            $logs->item_id = $inventory->id;
            $logs->message = 'Item ' . $inventory->name . ' is Updated by ' . $loginuser->name . '';
            $logs->log_type = '3';
            $logs->after = $after;
            $logs->before = $before;
            $logs->ip_address = $_SERVER['SERVER_ADDR'];
            $logs->port_number = $_SERVER['SERVER_PORT'];
            $logs->device_name = gethostname();
            $logs->browser_detail = $_SERVER['HTTP_USER_AGENT'];
            $logs->save();


            return response()->json([
                'status' => 200,
                'message' => "Inventory Updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    

    public function editInventory(Request $request, $inventory_id)
    {
        try {
            $inventory = InventoryItems::with('category', 'subcategory', 'vendor')
                ->where('id', $inventory_id)
                ->first();

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory item not found'
                ], 404);
            }

            $allitems = InventoryCategory::where('parent_category_id', '0')->get();
            $vendors = InventoryVendor::orderBy('name', 'ASC')->get();
            $rooms = InventoryRooms::orderBy('room_name', 'ASC')->get();

            return response()->json([
                'status'   => 200,
                'inventory' => $inventory,
                'categories' => $allitems,
                'vendors'    => $vendors,
                'rooms'      => $rooms
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function editAjaxInventory(Request $request, $id)
    {
        try {
            $subcategories = InventoryCategory::where('parent_category_id', $id)->get();

            return response()->json([
                'status' => 200,
                'category' => $subcategories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function editInventoryPost(Request $request)
    {
        try {
            $loginuser = Auth::user();
            $inventoryid = $request->inventory_id;

            // ✅ Fetch inventory
            $inventory = InventoryItems::where('id', $inventoryid)->first();
            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found'
                ], 404);
            }

            $quantity = $inventory->quantity;
            $stock = $inventory->in_stock;
            $original = $inventory->getOriginal();

            // ✅ Validation
            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required',
                    'category' => 'required',
                    'subcategory' => 'required',
                    'vendor' => 'nullable',
                    'hardwaretype' => 'nullable',
                    'category_type' => 'nullable',
                    'quantity' => 'nullable|integer',
                    'room_id' => 'nullable',
                    'upload_warrenty_card' => 'nullable|max:2048|mimes:jpeg,png,jpg',
                    'bill_upload' => 'nullable|max:2048|mimes:jpeg,png,jpg',
                ],
                [
                    'name.required' => 'Please enter an Item name',
                    'category.required' => 'Please select Category',
                    'subcategory.required' => 'Go to Category Management and add the corresponding Subcategory first',
                    'upload_warrenty_card.uploaded' => 'Warrenty Card size should not exceed 2MB',
                    'bill_upload.max' => 'Bill Size should not exceed 2MB',
                    'bill_upload.mimes' => 'Bill extension not allowed',
                    'bill_upload.uploaded' => 'Bill size should not exceed 2MB',
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()->first()
                ], 401);
            }

            // ✅ Update inventory fields (use existing values if request is missing)
            $inventory->name = $request->name ?? $inventory->name;
            $inventory->category_id = $request->category ?? $inventory->category_id;
            $inventory->subcategory_id = $request->subcategory ?? $inventory->subcategory_id;
            $inventory->hardware_type = $request->hardwaretype ?? $inventory->hardware_type ?? 'N/A';
            $inventory->notes = $request->notes ?? $inventory->notes;
            $inventory->vendor_id = $request->vendor ?? $inventory->vendor_id;
            $inventory->category_type = $request->category_type ?? $inventory->category_type ?? 0;
            $inventory->quantity = isset($request->quantity) ? $quantity + $request->quantity : $inventory->quantity;
            $inventory->in_stock = isset($request->quantity) ? $stock + $request->quantity : $inventory->in_stock;
            $inventory->room_id = $request->room_id ?? $inventory->room_id;

            // ✅ File Uploads
            if ($file = $request->file('upload_warrenty_card')) {
                $path = public_path('uploads/warrenty/');
                $name = time() . '-' . $file->getClientOriginalName();
                $file->move($path, $name);

                if (!empty($inventory->upload_warrenty_card) && file_exists($path . $inventory->upload_warrenty_card)) {
                    unlink($path . $inventory->upload_warrenty_card);
                }

                $inventory->upload_warrenty_card = $name;
            }

            if ($file = $request->file('bill_upload')) {
                $path = public_path('uploads/bills/');
                $name = time() . '-' . $file->getClientOriginalName();
                $file->move($path, $name);

                if (!empty($inventory->bill_upload) && file_exists($path . $inventory->bill_upload)) {
                    unlink($path . $inventory->bill_upload);
                }

                $inventory->bill_upload = $name;
            }

            // ✅ Save inventory
            if ($inventory->save()) {

                // ✅ Track Changes
                $getchange = $inventory->getChanges();
                $after = implode("\n", array_map(fn($v, $k) => $k . ':' . $v, $getchange, array_keys($getchange)));
                $result = array_intersect_key($original, $getchange);
                $before = implode("\n", array_map(fn($v, $k) => $k . ':' . $v, $result, array_keys($result)));

                // ✅ Log Action
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' is Updated by ' . $loginuser->name;
                $logs->log_type = '3';
                $logs->after = $after;
                $logs->before = $before;
                $logs->ip_address = request()->ip();
                $logs->port_number = request()->getPort();
                $logs->device_name = gethostname();
                $logs->browser_detail = request()->header('User-Agent');
                $logs->save();

                return response()->json([
                    'status' => 200,
                    'message' => "Inventory Updated",
                    'data' => $inventory
                ], 200);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something went wrong. Try again.'
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


    public function deleteInventoryold($inventory_id)
    {
        $loginuser = Auth::user()->id;
        $loginusername = Auth::user()->name;
        $inventory = InventoryItems::findOrFail($inventory_id);
        $inventoryid = InventoryItems::where('id', $inventory_id)->first();
        $name = $inventoryid->name;
        if ($inventory) {
            $inventory->is_deleted = "1";
            $inventory->save();
            $logs = new InventoryLogs();
            $logs->user_id = $loginuser;
            $logs->item_id = $inventory_id;
            $logs->message = 'Item ' . $name . ' is deleted by ' . $loginusername . '';

            $logs->log_type = '1';
            $logs->ip_address = $_SERVER['SERVER_ADDR'];
            $logs->port_number = $_SERVER['SERVER_PORT'];
            $logs->device_name = gethostname();
            $logs->browser_detail = $_SERVER['HTTP_USER_AGENT'];
            $logs->save();
            return redirect()->route('inventoryrequests')->with('success', 'Inventory deleted.');
        } else {
            return redirect()->route('inventoryrequests')->with('error', 'Something wrong. Try again.');
        }
    }

    public function deleteInventory($inventory_id)
    {
        try {
            $loginuser = Auth::user()->id;
            $loginusername = Auth::user()->name;

            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $name = $inventory->name;

            // Soft delete
            $inventory->is_deleted = "1";
            $inventory->save();

            // Log action
            $logs = new InventoryLogs();
            $logs->user_id = $loginuser;
            $logs->item_id = $inventory_id;
            $logs->message = 'Item ' . $name . ' is deleted by ' . $loginusername;
            $logs->log_type = '1';
            $logs->ip_address = request()->ip();
            $logs->port_number = request()->getPort();
            $logs->device_name = gethostname();
            $logs->browser_detail = request()->header('User-Agent');

            // Add default values to NOT NULL columns
            $logs->before = 'Deleted Inventory: ' . $name;
            $logs->after = 'N/A';

            $logs->save();

            return response()->json([
                'status' => 200,
                'message' => 'Inventory deleted successfully.',
                'data' => $inventory
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }



    public function deleteWarrentyCardold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        $path = public_path() . '/uploads/warrenty/';
        unlink($path . $inventory->upload_warrenty_card);
        $inventory->upload_warrenty_card = null;
        $inventory->save();
        return Redirect::back();
    }

    public function deleteBillUploadold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        $path = public_path() . '/uploads/bills/';
        unlink($path . $inventory->bill_upload);
        $inventory->bill_upload = null;
        $inventory->save();
        return Redirect::back();
    }

    public function deleteWarrentyCard(Request $request, $inventory_id)
    {
        try {
            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $path = public_path('uploads/warrenty/');

            // Delete file if exists
            if ($inventory->upload_warrenty_card && file_exists($path . $inventory->upload_warrenty_card)) {
                unlink($path . $inventory->upload_warrenty_card);
            }

            // Update DB
            $inventory->upload_warrenty_card = null;
            $inventory->save();

            return response()->json([
                'status' => 200,
                'message' => 'Warrenty card deleted successfully.',
                'data' => $inventory
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteBillUpload(Request $request, $inventory_id)
    {
        try {
            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $path = public_path('uploads/bills/');

            // Delete file if exists
            if ($inventory->bill_upload && file_exists($path . $inventory->bill_upload)) {
                unlink($path . $inventory->bill_upload);
            }

            // Update DB
            $inventory->bill_upload = null;
            $inventory->save();

            return response()->json([
                'status' => 200,
                'message' => 'Bill upload deleted successfully.',
                'data' => $inventory
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }


    public function allRoomsOLD(Request $request)
    {
        // if(!in_array('cabin_management', Session::get('permission')[0])){
        //         abort(404);
        // }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $rooms = InventoryRooms::where('created_by', Auth::user()->id)->where('is_deleted', '0')->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $rooms = InventoryRooms::whereIn('created_by', $employees)->where('is_deleted', '0')->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $rooms = InventoryRooms::whereIn('created_by', $employees)->where('is_deleted', '0')->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '5') {
            $rooms = InventoryRooms::where('is_deleted', '0')->orderBy('created_at', 'desc');
        }
        if ($request->ajax()) {

            return DataTables::of($rooms)->addIndexColumn()
                ->addColumn('action', function ($row) {
                    $loginuser = Auth::user();
                    $id = Auth::user()->id;
                    $created_by = $row->created_by;
                    $manager =  Employees::where('id', $created_by)->first();
                    $permission_role = Roles::where('id', Auth::user()->user_role)->first();
                    $btn = '<div class="btn-group btn-group-sm">';
                    if ($permission_role->edit == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editroom', $row->id) . '">     <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editroom', $row->id) . '">     <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editroom', $row->id) . '">     <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                        }
                    } elseif ($permission_role->edit == '5') {
                        $btn .= '<a class="btn btn-success site-icon pencil-icon" title="Edit" href="' . route('editroom', $row->id) . '">     <figure>
                               <img src="' . asset("/dist/img/2021/icons/pencil.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/pencil-white.png") . '" alt="editor">
                            </figure>
                        </a> ';
                    }


                    if ($permission_role->delete == '2') {
                        if ($id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteroom', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                              <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                          </a>';
                        }
                    } elseif ($permission_role->delete == '3') {
                        if ($id == $manager->manager_id) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteroom', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                              <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                          </a>';
                        }
                    } elseif ($permission_role->delete == '4') {
                        if ($id == $manager->manager_id || $id == $created_by) {
                            $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteroom', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                              <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                          </a>';
                        }
                    } elseif ($permission_role->delete == '5') {
                        $btn .= '<a class="btn btn-danger site-icon delete-icon" title="Delete" href="' . route('deleteroom', $row->id) . '" onclick="return confirm(\'Are you sure You want to delete?\')">
                              <figure>
                                 <img src="' . asset("/dist/img/2021/icons/delete.png") . '" alt="editor"><img src="' . asset("/dist/img/2021/icons/delete-white.png") . '" alt="editor">
                            </figure>
                          </a>';
                    }

                    $btn .= '</div>';
                    return $btn;
                })
                ->rawColumns([
                    'action'
                ])
                ->make(true);
        }
        return view('inventory.rooms.all-rooms');
    }


    public function allRooms(Request $request)
    {
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();

        // Role-based room visibility
        if ($permission_role->view == '2') {
            $rooms = InventoryRooms::where('created_by', Auth::user()->id)
                ->where('is_deleted', '0')
                ->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)
                ->pluck('id')
                ->toArray();
            $rooms = InventoryRooms::whereIn('created_by', $employees)
                ->where('is_deleted', '0')
                ->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)
                ->orWhere('id', Auth::user()->id)
                ->pluck('id')
                ->toArray();
            $rooms = InventoryRooms::whereIn('created_by', $employees)
                ->where('is_deleted', '0')
                ->orderBy('created_at', 'desc');
        } elseif ($permission_role->view == '5') {
            $rooms = InventoryRooms::where('is_deleted', '0')
                ->orderBy('created_at', 'desc');
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission denied'
            ], 403);
        }

        $rooms = $rooms->get();

        // Format data with action buttons logic
        $roomsData = $rooms->map(function ($row) use ($permission_role) {
            $loginuser = Auth::user();
            $id = $loginuser->id;
            $created_by = $row->created_by;
            $manager = Employees::where('id', $created_by)->first();

            $actions = [];

            // --- Edit Permission ---
            if ($permission_role->edit == '2' && $id == $created_by) {
                $actions[] = "Edit Allowed (Owner)";
            } elseif ($permission_role->edit == '3' && $id == optional($manager)->manager_id) {
                $actions[] = "Edit Allowed (Manager)";
            } elseif ($permission_role->edit == '4' && ($id == optional($manager)->manager_id || $id == $created_by)) {
                $actions[] = "Edit Allowed (Owner/Manager)";
            } elseif ($permission_role->edit == '5') {
                $actions[] = "Edit Allowed (All)";
            }

            // --- Delete Permission ---
            if ($permission_role->delete == '2' && $id == $created_by) {
                $actions[] = "Delete Allowed (Owner)";
            } elseif ($permission_role->delete == '3' && $id == optional($manager)->manager_id) {
                $actions[] = "Delete Allowed (Manager)";
            } elseif ($permission_role->delete == '4' && ($id == optional($manager)->manager_id || $id == $created_by)) {
                $actions[] = "Delete Allowed (Owner/Manager)";
            } elseif ($permission_role->delete == '5') {
                $actions[] = "Delete Allowed (All)";
            }

            return [
                'id' => $row->id,
                'room_name' => $row->room_name ?? null,
                'created_by' => $row->created_by,
                'created_at' => $row->created_at,
                'permissions' => $actions
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $roomsData->count(),
            'data' => $roomsData
        ], 200);
    }

    public function addRoomOLD(Request $request)
    {
        return view('inventory.rooms.add-room');
    }
    public function addRoomPostOLD(Request $request)
    {
        // $loginuser = Auth::user();
        $room = new InventoryRooms();
        $validator = Validator::make(
            $request->all(),
            [
                'room_name' => 'required|unique:inventory_rooms|max:50'
            ],
            [
                'room_name.required' => 'Please enter Cabin Name'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->add == '2') {
            $created_by = Auth::user()->id;
        } else {
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Please select to whom you would assign to'
                ]);
            }
            $created_by = $request->created_by;
        }

        $room->room_name = $request->room_name;
        $room->created_by = $created_by;
        if ($room->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Cabin added"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


     public function addRoom(Request $request)
    {
        return response()->json([
            'status' => 200,
            'message' => 'Use POST /api/all-rooms/add-room to create a new room',
            'fields_required' => ['room_name', 'created_by (optional depending on role)']
        ]);
    }

    /**
     * Store a new room
     */
    public function addRoomPost(Request $request)
    {
        // Validate request
        $validator = Validator::make(
            $request->all(),
            [
                'room_name' => 'required|unique:inventory_rooms|max:50'
            ],
            [
                'room_name.required' => 'Please enter Cabin Name'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first()
            ], 422);
        }

        $permission_role = Roles::where('id', Auth::user()->user_role)->first();

        if ($permission_role->add == '2') {
            // user can only assign to themselves
            $created_by = Auth::user()->id;
        } else {
            // role allows assigning to others
            if (empty($request->created_by)) {
                return response()->json([
                    'status' => 422,
                    'message' => 'Please select to whom you would assign to'
                ], 422);
            }
            $created_by = $request->created_by;
        }

        $room = new InventoryRooms();
        $room->room_name = $request->room_name;
        $room->created_by = $created_by;

        if ($room->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Cabin added successfully',
                'data' => [
                    'id' => $room->id,
                    'room_name' => $room->room_name,
                    'created_by' => $room->created_by,
                    'created_at' => $room->created_at
                ]
            ], 200);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ], 500);
        }
    }

    public function editRoomOLD(Request $request, $room_id)
    {
        $room = InventoryRooms::where('id', $room_id)->first();
        return view('inventory.rooms.edit-room', compact('room'));
    }
    public function editRoomPostOLD(Request $request)
    {
        $roomid = $request->room_id;
        $room = InventoryRooms::where('id', $roomid)->first();
        $validator = Validator::make(
            $request->all(),
            [
                'room_name' => 'required|unique:inventory_rooms,room_name,' . $roomid
            ],
            [
                'room_name' => 'Please enter Cabin Name'
            ]

        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        $room->room_name = $request->room_name;
        // $user->user_role = $request->user_role;

        if ($room->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Cabin name updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

     public function editRoom(Request $request, $room_id)
    {
        $room = InventoryRooms::where('id', $room_id)->first();

        if (!$room) {
            return response()->json([
                'status' => 404,
                'message' => 'Room not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Room fetched successfully',
            'data' => $room
        ], 200);
    }

    /**
     * Update a room
     */
    public function editRoomPost(Request $request)
    {
        $roomid = $request->room_id;
        $room = InventoryRooms::where('id', $roomid)->first();

        if (!$room) {
            return response()->json([
                'status' => 404,
                'message' => 'Room not found'
            ], 404);
        }

        // Validation (unique except this ID)
        $validator = Validator::make(
            $request->all(),
            [
                'room_name' => 'required|unique:inventory_rooms,room_name,' . $roomid
            ],
            [
                'room_name.required' => 'Please enter Cabin Name'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first()
            ], 422);
        }

        $room->room_name = $request->room_name;

        if ($room->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Cabin name updated",
                'data' => [
                    'id' => $room->id,
                    'room_name' => $room->room_name,
                    'updated_at' => $room->updated_at
                ]
            ], 200);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try Again.'
            ], 500);
        }
    }

    public function deleteRoomOLD($room_id)
    {

        $inventory = InventoryRooms::findOrFail($room_id);
        if ($inventory) {
            $inventory->is_deleted = "1";
            if ($inventory->save()) {
                return redirect()->route('allrooms')->with('success', 'Cabin deleted');
            } else {
                return redirect()->route('allrooms')->with('error', 'Something wrong. Try again.');
            }
        }
    }



    public function deleteRoom($room_id)
    {
        try {
            $inventory = InventoryRooms::findOrFail($room_id);

            // Mark as deleted instead of hard delete
            $inventory->is_deleted = "1";

            if ($inventory->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Cabin deleted successfully'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Something went wrong. Try again.'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    public function addParentCategoryold(Request $request)
    {

        return view('inventory.category.add-parent-category');
    }

    public function addParentCategoryPostold(Request $request)
    {
        $category = new InventoryCategory();
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|unique:inventory_categories'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $category->category_name = $request->category_name;
        $category->parent_category_id = '0';

        if ($category->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Parent Category added"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    public function addParentCategory(Request $request)
    {
        return response()->json([
            'status' => 200,
            'message' => 'API is ready. Use POST to add a new parent category.'
        ], 200);
    }

    public function addParentCategoryPost(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_name' => 'required|unique:inventory_categories,category_name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            $category = new InventoryCategory();
            $category->category_name = $request->category_name;
            $category->parent_category_id = 0;

            if ($category->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Parent Category added successfully.',
                    'data' => $category
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Something went wrong. Try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


    public function allocationold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        $rooms = InventoryRooms::where('is_deleted', '0')->get();
        $employees = Employees::get();
        return view('inventory.allocate-inventory', compact('inventory', 'rooms', 'employees'));
    }

    public function allocationPostold(Request $request)
    {
        $id = $request->inventory_id;
        $inventory = InventoryItems::where('id', $id)->first();
        $validator = Validator::make($request->all(), [
            'room_id' => 'required',
        ], [
            'room_id.required' => 'Room name is required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $inventory->room_id = $request->room_id;
        $inventory->employee_id = $request->employee_id;
        if ($inventory->category_type == '0') {
            $inventory->stock = "0";
        } else {
            $inventory->stock = "1";
        }

        if ($inventory->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Inventory Allocated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }



    public function allocation(Request $request, $inventory_id)
    {
        try {
            $inventory = InventoryItems::where('id', $inventory_id)->first();

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $rooms = InventoryRooms::where('is_deleted', '0')->get();
            $employees = Employees::all();

            return response()->json([
                'status' => 200,
                'message' => 'Allocation data fetched successfully.',
                'data' => [
                    'inventory' => $inventory,
                    'rooms' => $rooms,
                    'employees' => $employees
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


     public function allocationPost(Request $request)
    {
        try {
            $id = $request->inventory_id;
            $inventory = InventoryItems::where('id', $id)->first();

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            // ✅ Validation
            $validator = Validator::make($request->all(), [
                'room_id' => 'required',
            ], [
                'room_id.required' => 'Room name is required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // ✅ Update inventory allocation
            $inventory->room_id = $request->room_id;
            $inventory->employee_id = $request->employee_id;

            if ($inventory->category_type == '0') {
                $inventory->stock = "0";
            } else {
                $inventory->stock = "1";
            }

            if ($inventory->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory allocated successfully.',
                    'data' => $inventory
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Something went wrong. Try again.'
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deallocationold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        if ($inventory) {
            $inventory->room_id = "0";
            $inventory->employee_id = "0";
            $inventory->stock = "1";
            if ($inventory->save()) {
                return redirect()->route('inventoryrequests')->with('success', 'Inventory Deallocated.');
            } else {
                return redirect()->route('inventoryrequests')->with('error', 'Something wrong. Try again.');
            }
        }
    }

    public function declineInventoryold(Request $request, $inventory_id)
    {
        $loginuser = Auth::user();
        $inventory = InventoryItems::findOrFail($inventory_id);
        if ($inventory) {
            $inventory->status = "3";
            if ($inventory->save()) {
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' is Declined by ' . $loginuser->name . '';
                $logs->log_type = '3';
                $logs->ip_address = $_SERVER['SERVER_ADDR'];
                $logs->port_number = $_SERVER['SERVER_PORT'];
                $logs->device_name = gethostname();
                $logs->browser_detail = $_SERVER['HTTP_USER_AGENT'];
                $logs->save();
                return redirect()->route('inventoryrequests')->with('success', 'Inventory Declined');
            } else {
                return redirect()->route('inventoryrequests')->with('error', 'Something wrong. Try again.');
            }
        }
    }

    public function deallocation(Request $request, $inventory_id)
    {
        try {
            $inventory = InventoryItems::where('id', $inventory_id)->first();

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $inventory->room_id = "0";
            $inventory->employee_id = "0";
            $inventory->stock = "1";

            if ($inventory->save()) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory deallocated successfully.',
                    'data' => $inventory
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Something went wrong. Try again.'
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

   
    public function declineInventory(Request $request, $inventory_id)
    {
        try {
            $loginuser = Auth::user();
            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            // Keep track of old status before update
            $beforeStatus = $inventory->status;

            $inventory->status = "3"; // Declined

            if ($inventory->save()) {
                // ✅ Log action with before/after
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id ?? null;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' is Declined by ' . ($loginuser->name ?? 'System');
                $logs->log_type = '3';
                $logs->before = $beforeStatus ?? '';  // <-- FIX: set before
                $logs->after = $inventory->status;    // <-- FIX: set after
                $logs->ip_address = request()->ip();
                $logs->port_number = $request->server('SERVER_PORT');
                $logs->device_name = gethostname();
                $logs->browser_detail = $request->server('HTTP_USER_AGENT');
                $logs->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory declined successfully.',
                    'data' => $inventory
                ], 200);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Something went wrong. Try again.'
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


    public function getState(Request $request)
    {
        $data['states'] = State::where("country_id", $request->country_id)
            ->get(["name", "id"]);
        return response()->json($data);
    }

    public function getCity(Request $request)
    {
        $data['cities'] = City::where("state_id", $request->state_id)
            ->get(["name", "id"]);
        return response()->json($data);
    }

    public function faultyold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        if ($inventory) {
            $inventory->faulty = "1";
            $inventory->room_id = "3";
            if ($inventory->save()) {
                return redirect()->route('inventoryrequests')->with('success', 'Faulty Inventory');
            } else {
                return redirect()->route('inventoryrequests')->with('error', 'Something wrong. Try again.');
            }
        }
    }

    public function faultlessold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();
        if ($inventory) {
            $inventory->faulty = "0";
            $inventory->room_id = "3";
            if ($inventory->save()) {
                return redirect()->route('inventoryrequests')->with('success', 'Inventory is free of fault');
            } else {
                return redirect()->route('inventoryrequests')->with('error', 'Something wrong. Try again.');
            }
        }
    }

    public function faulty(Request $request, $inventory_id)
    {
        try {
            $loginuser = Auth::user();
            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $beforeStatus = $inventory->faulty;

            $inventory->faulty = "1";  // Mark as faulty
            $inventory->room_id = "3";

            if ($inventory->save()) {
                // ✅ Log the change
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id ?? null;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' marked as Faulty by ' . ($loginuser->name ?? 'System');
                $logs->log_type = '4'; // custom type for faulty
                $logs->before = $beforeStatus ?? '';
                $logs->after = $inventory->faulty;
                $logs->ip_address = $request->ip();
                $logs->port_number = $request->server('SERVER_PORT');
                $logs->device_name = gethostname();
                $logs->browser_detail = $request->server('HTTP_USER_AGENT');
                $logs->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory marked as faulty.',
                    'data' => $inventory
                ], 200);
            }

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }


    public function faultless(Request $request, $inventory_id)
    {
        try {
            $loginuser = Auth::user();
            $inventory = InventoryItems::find($inventory_id);

            if (!$inventory) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Inventory not found.'
                ], 404);
            }

            $beforeStatus = $inventory->faulty;

            $inventory->faulty = "0";  // Mark as faultless
            $inventory->room_id = "3";

            if ($inventory->save()) {
                // ✅ Log the change
                $logs = new InventoryLogs();
                $logs->user_id = $loginuser->id ?? null;
                $logs->item_id = $inventory->id;
                $logs->message = 'Item ' . $inventory->name . ' marked as Faultless by ' . ($loginuser->name ?? 'System');
                $logs->log_type = '5'; // custom type for faultless
                $logs->before = $beforeStatus ?? '';
                $logs->after = $inventory->faulty;
                $logs->ip_address = $request->ip();
                $logs->port_number = $request->server('SERVER_PORT');
                $logs->device_name = gethostname();
                $logs->browser_detail = $request->server('HTTP_USER_AGENT');
                $logs->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Inventory marked as faultless.',
                    'data' => $inventory
                ], 200);
            }

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong. Try again.'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function allLogsold(Request $request)
    {
        // if(!in_array('inventory_logs', Session::get('permission')[0])){
        //     abort(404);
        // }
        $permission_role = Roles::where('id', Auth::user()->user_role)->first();
        if ($permission_role->view == '2') {
            $logs = InventoryLogs::where('user_id', Auth::user()->id)->latest()->get();
        } elseif ($permission_role->view == '3') {
            $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
            $logs = InventoryLogs::whereIn('user_id', $employees)->latest()->get();
        } elseif ($permission_role->view == '4') {
            $employees = Employees::where('manager_id', Auth::user()->id)->orWhere('id', Auth::user()->id)->pluck('id')->toArray();
            $logs = InventoryLogs::whereIn('user_id', $employees)->latest()->get();
        } elseif ($permission_role->view == '5') {
            $logs = InventoryLogs::latest()->get();
        }

        if ($request->ajax()) {
            return DataTables::of($logs)->addIndexColumn()
                ->editColumn('item_id', function ($row) {
                    $itemname = $row->item->name;
                    return $itemname;
                })

                ->editColumn('user_id', function ($row) {
                    $name = $row->logs->name;
                    return $name;
                })
                ->editColumn('before', function ($row) {
                    if ($row->before) {
                        $name = urldecode($row->before);
                        return $name;
                    } else {
                        return '-';
                    }
                })
                ->editColumn('after', function ($row) {
                    if ($row->after) {
                        $name = urldecode($row->after);
                        return $name;
                    } else {
                        return '-';
                    }
                })
                ->editColumn('log_type', function ($row) {
                    $logs = $row->log_type;
                    if ($logs == '1') {
                        return 'Delete';
                    } elseif ($logs == '2') {
                        return 'Add';
                    } else {
                        return 'Update';
                    }
                })
                ->editColumn('created_at', function ($row) {
                    return date('d M, Y', strtotime($row->created_at));
                })
                ->make(true);
        }
        return view('inventory.all-inventory-logs');
    }



    public function allLogs(Request $request)
    {
        try {
            $permission_role = Roles::where('id', Auth::user()->user_role)->first();

            if (!$permission_role) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Permission role not found'
                ], 403);
            }

            if ($permission_role->view == '2') {
                $logs = InventoryLogs::where('user_id', Auth::user()->id)->latest()->get();
            } elseif ($permission_role->view == '3') {
                $employees = Employees::where('manager_id', Auth::user()->id)->pluck('id')->toArray();
                $logs = InventoryLogs::whereIn('user_id', $employees)->latest()->get();
            } elseif ($permission_role->view == '4') {
                $employees = Employees::where('manager_id', Auth::user()->id)
                    ->orWhere('id', Auth::user()->id)
                    ->pluck('id')->toArray();
                $logs = InventoryLogs::whereIn('user_id', $employees)->latest()->get();
            } elseif ($permission_role->view == '5') {
                $logs = InventoryLogs::latest()->get();
            } else {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized to view logs'
                ], 403);
            }

            // Transform logs like DataTables formatting
            $formattedLogs = $logs->map(function ($row, $index) {
                return [
                    'index'      => $index + 1,
                    'item_name'  => $row->item->name ?? '-',
                    'user_name'  => $row->logs->name ?? '-',
                    'before'     => $row->before ? urldecode($row->before) : '-',
                    'after'      => $row->after ? urldecode($row->after) : '-',
                    'log_type'   => $row->log_type == '1' ? 'Delete' : ($row->log_type == '2' ? 'Add' : 'Update'),
                    'created_at' => $row->created_at ? $row->created_at->format('d M, Y') : null,
                ];
            });

            return response()->json([
                'status' => 200,
                'message' => 'Inventory logs retrieved successfully',
                'data' => $formattedLogs
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }



    public function  addAjaxEmployee(Request $request, $id)
    {
        $room_id = $request->id;
        $employee = Employees::where('room_id', '=', $room_id)->get();
        return response()->json([
            'employee' => $employee
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(new FormsDataExport, 'formsdata.xlsx');
    }

    public function exportInventory(Request $request)
    {
        return Excel::download(new InventoryItemExport, 'inventory.xlsx');
    }

    public function manageStockold(Request $request, $inventory_id)
    {
        $inventory = InventoryItems::where('id', $inventory_id)->first();

        return view('inventory.manage-stock', compact('inventory'));
    }
    public function manageStockPostold(Request $request)
    {
        $id = $request->inventory_id;
        $inventory = InventoryItems::where('id', $id)->first();
        $used = $inventory->in_use;
        $stock = $inventory->in_stock;
        $validator = Validator::make($request->all(), [
            'in_use' => 'min:inventory_items',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }

        if ($request->inuse > $stock) {
            return response()->json([
                'status' => 401,
                'message' => 'oops!Stock reached the limit'
            ]);
        }

        $inventory->in_use = $used +  $request->inuse;
        $inventory->in_stock = $request->instock - $request->inuse;
        if ($inventory->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Stock added."
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    public function manageStock($inventory_id)
    {
         
        $inventory = InventoryItems::find($inventory_id);

        if (!$inventory) {
            return response()->json([
                'status' => 404,
                'message' => 'Inventory item not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Inventory item fetched successfully',
            'data' => $inventory
        ]);
    }

    
    public function manageStockPost(Request $request)
    {

        log::info("Manage stock called for inventory ID: ");
        $id = $request->inventory_id;
        $inventory = InventoryItems::find($id);

        if (!$inventory) {
            return response()->json([
                'status' => 404,
                'message' => 'Inventory item not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'inuse'   => 'required|integer|min:0',
            'instock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ], 401);
        }

        if ($request->inuse > $inventory->in_stock) {
            return response()->json([
                'status' => 401,
                'message' => 'Oops! Stock reached the limit'
            ], 401);
        }

        // Update values
        $inventory->in_use   = $inventory->in_use + $request->inuse;
        $inventory->in_stock = $request->instock - $request->inuse;

        if ($inventory->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Stock added successfully',
                'data' => $inventory
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Something went wrong. Try again.'
        ], 500);
    }


    public function import()
    {
        Excel::import(new InventoryImport, request()->file('file'));

        return back();
    }

    public function getGst(Request $request)
    {

         log::info("Manage stock called for inventory ID: ");
        $name = $_GET['gst_no'];
        $an = file_get_contents("http://sheet.gstincheck.ml/check/5cd36e6878834d58d3d175a88775c545/" . $name);
        $obj = json_decode($an);
        $flag = $obj->{'flag'};
        if ($flag == '1') {
            $addr = $obj->{'data'}->{'pradr'}->{'addr'};
            $pincode = $obj->{'data'}->{'pradr'}->{'addr'}->{'pncd'};
            $company = $obj->{'data'}->{'lgnm'};
            $array = (array)$addr;
            $permanent = implode(',', array_filter($array));

            return response()->json(['address' =>  $permanent, 'company' =>  $company, 'pincode' =>  $pincode]);
        } elseif ($flag == ' ') {
            return response()->json([
                'message' => "Gst no. is not Valid"
            ]);
        }
    }
}

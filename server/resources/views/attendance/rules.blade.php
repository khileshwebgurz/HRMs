@extends('layouts.app') @section('header')
<link
	href="{{ asset('/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}"
	rel="stylesheet">
<link
	href="{{ asset('/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}"
	rel="stylesheet">
<link
	href="{{ asset('/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}"
	rel="stylesheet">
@endsection @section('content')
<?php
   $roles =App\Roles::where('id',Auth::user()->user_role)->first();
?>
@if($roles->view == '1')
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>All Attendance Rule</h1>
			</div>
            @if($roles->add != '1')
			<div class="col-sm-6 text-right custom-btn-grp">
				<a href="{{route('addattendancerule')}}" class="btn btn-success btn-sm site-main-btn-2"><i
					class="fas fa-plus"></i> Add New Rule</a> 

			</div>
            @endif
		</div>
	</div>
	<!-- /.container-fluid -->
</section>
<div class="container-fluid">
    <div class="card all-user-card">
        <div class="card-body">
   <h5>Sorry!You don't have permission to view. Please Contact Hr</h5>   
   </div>
   </div>
   </div> 
@else
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>All Attendance Rule</h1>
            </div>
            @if($roles->add != '1')
            <div class="col-sm-6 text-right custom-btn-grp">
                <a href="{{route('addattendancerule')}}" class="btn btn-success btn-sm site-main-btn-2"><i
                    class="fas fa-plus"></i> Add New Rule</a> 

            </div>
            @endif
        </div>
    </div>
    <!-- /.container-fluid -->
</section>
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
            <table id="wgz_users_table"
                class="table table-bordered table-striped wg_allusers">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Rule Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->
</div>
@endif
@endsection @section('footer')
<script
	src="{{ asset('/plugins/datatables/jquery.dataTables.min.js') }}"></script>
<script
	src="{{ asset('/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
<script
	src="{{ asset('/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
<script
	src="{{ asset('/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
<script
	src="{{ asset('/plugins/datatables-buttons/js/dataTables.buttons.min.js') }}"></script>

<script type="text/javascript">
$(function () {

	
    
  var table = $('.wg_allusers').DataTable({
    processing: true,
    serverSide: true,
    pageLength: 10,
    ajax: "{{ route('allattendancerules') }}",
    columns: [
        { data: 'DT_RowIndex', name: 'DT_RowIndex' , orderable: false, searchable: false},
        { data: 'rule_name', name: 'rulename' },
        { data: 'description', name: 'description' },
        {
            data: 'action', 
            name: 'action', 
            orderable: false, 
            searchable: false
        },
    ]
  });
  
  
    
});
</script>
@endsection

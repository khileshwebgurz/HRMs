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
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1>Anomaly List</h1>
			</div>
			
		</div>
	</div>
	<!-- /.container-fluid -->
</section>

<div class="card">
	<div class="card-body">
		<div class="table-responsive">
		<table id="wgz_users_table"
			class="table table-bordered table-striped wg_allusers">
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Clockin</th>
					<th>Total Working Hours</th>
					<th>Total Breaks</th>
					<th>Date</th>
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
    ajax: "{{ route('attendancealert') }}",
    columns: [
        { data: 'DT_RowIndex', name: 'DT_RowIndex' , orderable: false, searchable: false},
        { data: 'emp_name', name: 'emp_name' },
        { data: 'clock_in', name: 'clock_in' },
        { data: 'work_duration', name: 'work_duration' },
        { data: 'total_breaks', name: 'total_breaks' },
        { data: 'clock_date', name: 'clock_date' },

     
    ]
  });

});
</script>
<style >
	.fulltime{
		color: red;
	}
</style>
@endsection

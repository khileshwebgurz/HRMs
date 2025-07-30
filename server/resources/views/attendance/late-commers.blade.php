@extends('layouts.app') @section('header')
<link href="{{ asset('/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}" rel="stylesheet">
<link href="{{ asset('/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}" rel="stylesheet">
<link href="{{ asset('/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}" rel="stylesheet">
@endsection @section('content')
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>All Late Commers</h1>
            </div>
        </div>
    </div>
    <!-- /.container-fluid -->
</section>

<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <?php
               $roles =App\Roles::where('id',Auth::user()->user_role)->first();
              ?>
            @if($roles->view == '1')
                    <h5>Sorry!You don't have permission to view. Please Contact Hr</h5>    
             @else
            <div class="table-responsive">
                <table id="wgz_users_table" class="table table-bordered table-striped wg_alllatecommers">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee Id</th>
                            <th>Clock In Time</th>
                            <th>Total Working Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            @endif
            </div>
        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->
</div>
@endsection @section('footer')

<script src="{{ asset('/plugins/datatables/jquery.dataTables.min.js') }}"></script>
<script src="{{ asset('/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
<script src="{{ asset('/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
<script src="{{ asset('/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
<script src="{{ asset('/plugins/datatables-buttons/js/dataTables.buttons.min.js') }}"></script>

<script type="text/javascript">
    $(function() {
        var table = $('.wg_alllatecommers').DataTable({
            processing: true,
            serverSide: true,
            pageLength: 10,
            ajax: {
                "url": "{{ route('latecommers') }}",
                "data": function(d) {
                    d.startdate = $('#from_date').val();
                }
            },
            columns: [{
                    data: 'DT_RowIndex',
                    name: 'DT_RowIndex',
                    orderable: false,
                    searchable: false
                },
                {
                    data: 'employee_id',
                    name: 'employee_id'
                },
                {
                    data: 'clock_in',
                    name: 'clock_in'
                },
                {
                    data: 'work_duration',
                    name: 'work_duration'
                },
            ]
        });
      var wgz_roles = '';
        wgz_roles += ' &nbsp; <label> By: &nbsp;</label><label> ';
        wgz_roles += '<select id="wgz_user" class="form-control form-control-sm">';
        wgz_roles += '<option value="">All Employees</option>';
        <?php
    foreach (App\Employees::orderBy('name','ASC')->get() as $dk => $dv) {
        ?>
        wgz_roles += '<option value="{{$dv->name}}">{{$dv->name}}</option>';
        <?php
    }
    ?>
        wgz_roles += '</select></label>';
        wgz_roles += '<input type="text" id="from_date" class="form-control-sm dateppp" data-date-format="YYYY-mm-dd" placeholder=" Date" readonly />';
        wgz_roles += '<button type="button" name="filter" id="filter" class="btn btn-primary btn-sm ml-1">Filter</button>';
        wgz_roles += '&nbsp; <button type="button" name="reset" id="reset" class="btn btn-primary btn-sm">Reset</button>';
       
        $("#wgz_users_table_wrapper .row:nth-child(1) .col-sm-12:nth-child(1)").removeClass("col-md-6").addClass('col-md-2');
        $("#wgz_users_table_wrapper .row:nth-child(1) .col-sm-12:nth-child(2)").removeClass("col-md-6").addClass('col-md-10');


        $('#wgz_users_table_filter').append(wgz_roles);

        $('#wgz_user').click(function() {
            table.columns(1).search($(this).val());
            table.draw();
        });


 
        $('#filter').click(function() {
            var from_date = $('#from_date').val();
            if (from_date != '') {
                $('.wg_alllatecommers').DataTable().draw(true);
            }
        });
         $('#reset').click(function() {
            $('#from_date').val('');
            window.location.reload();
        });

    });
$(function() {
        $('.dateppp').datepicker({
            dateFormat: 'yy-mm-dd',
            todayBtn: 'linked',
            //   format:'yyyy-mm-dd',
            autoclose: true
        });
    });
</script>
<style type="text/css">
    .wgz_half {
        color: red;
    }

    .fulltime {
        color: red;
    }

</style>
@endsection

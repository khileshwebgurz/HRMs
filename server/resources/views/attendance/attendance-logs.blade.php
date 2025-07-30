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
				<h1>All Attendance Logs</h1>
			</div>
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
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Clock in</th>
                        <th>Clock Out</th>
                        <th>Status</th>
                        <th>Work Duration</th>
                        <th>Breaks</th>
                        <th>Reason</th>
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
@endsection @section('footer')
<div class="modal fade" id="approvalModal" tabindex="-1"
				role="dialog" aria-labelledby="exampleModalCenterTitle"
				aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content">
						<div class="modal-header"
							style="background-color: #f85697; color: white;">
							<h5 class="modal-title" id="exampleModalCenterTitle">Get Approval</h5>
							<button type="button" class="close" data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<form action="" method="post" id="approvalFormManager">
								<input type="hidden" name="get_approval_id" id="get_approval_id"
									value="">@csrf
								<div class="modal-body">
									<div class="row ">
										<div class="col-sm-12">
											<label>Employee Reason:</label>
											<p class="emreason"></p>
										</div>
										<div class="col-12">
											<div class="form-group">
												<label>Write Your Reason:</label>
												<textarea class="form-control" id="wgz-notes" rows="5"
													name="notes"></textarea>
											</div>
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<input class="btn btn-success wgz-apply-approval-manager"
										type="submit" name="send" value="Send">
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
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
    ajax: "{{ route('attendancelogs') }}",
    columns: [


        { data: 'DT_RowIndex', name: 'DT_RowIndex' , orderable: false, searchable: false},
        { data: 'emp_name', name: 'emp_name' },  
        { data: 'clock_date', name: 'clock_date' },   
        { data: 'clock_in', name: 'clock_in' },  
        { data: 'clock_out', name: 'clock_out' },
        { data: 'status', name: 'status' },  
        { data: 'work_duration', name: 'work_duration' },  
        { data: 'total_breaks', name: 'total_breaks' },  
        { data: 'apply_reason', name: 'apply_reason' },  
         {
            data: 'action', 
            name: 'action', 
            orderable: false, 
            searchable: false
        },
    ]
  });
  
  
    
});
 function leaveApproved(rows_ids){
        
            $.ajax({
                url: '{{route("approve-attendance-request")}}?ver=<?php echo time(); ?>',
                type: 'POST',
                data: { _token : '<?php echo csrf_token() ?>', rows_ids:rows_ids },   
                success: function (data) {
   					if(data.status == 401){             
                       toastr.error(data.message);
                    }else
                    {

						$('#wgz_users_table').DataTable().ajax.reload();
                      toastr.success(data.message);                  
                                   
                    }
                              
                }
            }); 
        
        }
        
        $('#approvalFormManager').submit(function(event) {
        	var appid = $("#get_approval_id").val();
             var dis = $('.wgz-apply-approval-manager');
             dis.val('Sending...');
              event.preventDefault();
              $.ajax({
                    url: '{{route("decline-attendance-request")}}',
                    type: 'POST',
                    data: $(this).serialize(),   
                    success: function (data) {
                         
                        if(data.status == 401){             
                           toastr.error(data.message);
                        }else
                        {

							$('#wgz_users_table').DataTable().ajax.reload();

                        
                    	  $("#get_approval_id").val('');
        				  $("#approvalModal").modal('hide');
                          toastr.success(data.message);                  
                                       
                        }
                        
                           dis.val('Send');        
                    }
                }); 
            });
        
        $( document ).on( "click", ".approvalModalClick", function() {

        	if($(this).data('type') == 'decline'){
            	$("#get_approval_id").val($(this).data('id'));
            	$(".emreason").text($(this).data('notes'));
            	
            	$("#approvalModal").modal('show');
           }else{
           		var rows_ids = [$(this).data('id')];
  				leaveApproved(rows_ids);
      			
           }
           
        });

</script>
<style>
	.wgz_half {
	color: green;
}
.fulltime{
	color: red;
}

</style>
@endsection

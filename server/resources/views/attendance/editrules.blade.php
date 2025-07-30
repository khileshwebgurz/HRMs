@extends('layouts.app') @section('header')
<link href="{{ asset('/css/jquery.tagsinput-revisited.css') }}"
	rel="stylesheet">
@endsection @section('content')
<section class="content-header">
	<div class="container-fluid">
		<div class="row mb-2">
			<div class="col-sm-6">
				<h1 class="ml-3">Edit Rule</h1>
			</div>
			<div class="col-sm-6 text-right"></div>
		</div>
	</div>
	<!-- /.container-fluid -->
</section>

<div class="mx-4 card add-user-sec">
	<div class="card-body">
		<div class="row1 mr-1 wgz_user_form">
			<form action="" method="post" id="wgz_user_form">
				<input type="hidden" name="rule_id" value="{{$rules->id}}"> @csrf
				<div class="col-lg-12">
					<div class="tab-content" id="myTabContent">
														<div class="tab-pane fade active show" id="general"
															role="tabpanel" aria-labelledby="general-tab">
														 <label>Rule Name</label>
															<input class="form-control" type="text" name="rule_name" id="name" maxlength="25" value="{{$rules->rule_name}}">
															<label class="mt-3">Description</label>
															<textarea class="form-control" name="description" id="description"  maxlength="25">{{$rules->description}}</textarea>
															<div class="col-md-12 mt-3  py-3">
															<label class="mt-0">Employee Role</label>
															<div class="form-icon">
															<select class="form-control" name="employee_role_id">
																<option value="">--Choose Employee Role--</option>
																@foreach($roles as $role)
																<option value="{{$role->id}}" @if($role->id == $rules->employee_role_id) selected @endif>{{$role->role_type}}</option>
																@endforeach
															</select>
														</div>
													</div>
													<div class="col-md-12 mt-3  py-3">
															<label class="mt-0">Auto Clockout Time:</label>
															<div class="input-group date" id="timepicker11" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" name="auto_clockout" data-target="#timepicker11" />
                                                            <div class="input-group-append" data-target="#timepicker11" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                            </div>
                                                        </div>
													</div>
															<div class="mt-3 p-3 shifttimings">
																<h5>
																	<b>Shift Timings </b>
																</h5>
				 <div class="bootstrap-timepicker">
                  <div class="form-group">
                    <label>In Time</label>

                    <div class="input-group date" id="timepicker" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->shift_in_time}}" name="shift_in_time" data-target="#timepicker"/>
                      <div class="input-group-append" data-target="#timepicker" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
                    <!-- /.input group -->
                  </div>
                  <!-- /.form group -->
                </div>
                 <div class="bootstrap-timepicker">
                  <div class="form-group">
                    <label>Out Time</label>

                    <div class="input-group date" id="timepicker2" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->shift_out_time}}" name="shift_out_time" data-target="#timepicker2"/>
                      <div class="input-group-append" data-target="#timepicker2" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
                    <!-- /.input group -->
                  </div>
                  <!-- /.form group -->
                </div>
                

															</div>
															<ul class="p-0 mt-3">
																<li><label>Enable Anomaly Deduction</label> <input  type="checkbox" data-toggle="toggle" name="anomaly_deduction" data-size="small" value="{{$rules->anomaly_deduction}}"
																	@if($rules->anomaly_deduction == '1') checked @endif>
																</li>
															</ul>

															<ul class="p-0 ">
																<li><label>Enable Anomaly Tracking</label> <input class="collapsedanomaly" type="checkbox" 
																	 data-toggle="toggle" name="anomaly_tracking" data-size="small" value="{{$rules->anomaly_tracking}}" 
                                                                      @if($rules->anomaly_tracking == '1') checked @endif
																	 >
																</li>
															</ul>
															<div class="p-3 anomalysetting collapse">
																<h5>
																	<b>Anomaly Settings</b>
																</h5>
																<br>
															<ul class="p-0">
																<div class="form-check">
																	<input class="form-check-input collapsedanomalyintime"  type="checkbox"
																		value="" checked>
																	<li>In Time</li>
																</div>
																<div class="anomalysettingintime">
																<label>In Time Grace Period</label>
																<div class="input-group date" id="timepicker3" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->anomaly_in_time}}" name="anomaly_in_time" data-target="#timepicker3"/>
                      <div class="input-group-append" data-target="#timepicker3" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
                      </div>
															</ul>
															<ul class="p-0">
																<div class="form-check">
																	<input class="form-check-input collapsedanomalyouttime" type="checkbox"
																		value="" checked>
																	<li>Out Time</li>
																</div>
																<div class="anomalysettingouttime">
																<label>Out Time Grace Period</label>
																<div class="input-group date" id="timepicker4" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->anomaly_out_time}}" name="anomaly_out_time" data-target="#timepicker4"/>
                      <div class="input-group-append" data-target="#timepicker4" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
                      </div>
															</ul>
																</div>
															<ul class="p-0 mt-3">
																<div class="form-check">
																	<input class="form-check-input" type="checkbox"
																		value="" checked>
																	<li><label>Work Duration</li>
																</div>
																<label>Full Day</label>
																<div class="input-group date" id="timepicker5" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->work_full_time_duration}}" name="work_full_time_duration" data-target="#timepicker5"/>
                      <div class="input-group-append" data-target="#timepicker5" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
                      <label>Half Day</label>
							<div class="input-group date" id="timepicker6" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->work_half_time_duration}}" name="work_half_time_duration" data-target="#timepicker6"/>
                      <div class="input-group-append" data-target="#timepicker6" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
						</ul>
															
															<ul class="p-0">
																<div class="form-check">
																	<input class="form-check-input" type="checkbox"
																		value="" checked> <label>Maximum total break duration</label>
																	<div class="input-group date" id="timepicker7" data-target-input="nearest">
                      <input type="text" class="form-control datetimepicker-input" value="{{$rules->break_duration}}" name="break_duration" data-target="#timepicker7"/>
                      <div class="input-group-append" data-target="#timepicker7" data-toggle="datetimepicker">
                          <div class="input-group-text"><i class="far fa-clock"></i></div>
                      </div>
                      </div>
																</div>
															</ul>
															<ul class="p-0">
																<div class="form-check">
																	<input class="form-check-input" type="checkbox"
																		value="" checked> <label>Maximum no. of breaks</label>
																	<input class="form-control" type="number"
																		value="{{$rules->max_break}}" name="max_break" >
																	
																</div>
															</ul>
															<ul class="p-0">
																<div class="form-check">
																	<input class="form-check-input collapsed" type="checkbox" name="auto_clockout" value="{{$rules->auto_clockout}}" 
																	  @if($rules->auto_clockout == '1') checked @endif> <label>Auto Clock-Out</label>
																</div>
																<div class="collapse2 collapse" style="display:none;">
																<li>Enable Overtime <input type="checkbox" 
																	data-toggle="toggle" name="overtime" value="{{$rules->overtime}}" data-size="small"
																	  @if($rules->overtime == '1') checked @endif>
																</li>
															
																<li>Enable Geo Fencing <input type="checkbox"
																	data-toggle="toggle" value="{{$rules->geo_fencing}}" name="geo_fencing" data-size="small"
																	  @if($rules->geo_fencing == '1') checked @endif>
																</li>
																<li>Enable Penalty rules <input type="checkbox"
																	data-toggle="toggle" value="{{$rules->penalty_rules}}" name="penalty_rules" data-size="small"
																	  @if($rules->penalty_rules == '1') checked @endif>
																</li>
															</div>
															</ul>
														</div>
													</div>
				<input class="btn btn-success float-right  wgz-submit site-main-btn"
						type="submit" name="submit">
				</div>
		
			</form>
		</div>

	</div>
	<!-- /.card-body -->
</div>
<!-- /.card -->
@endsection @section('footer')
<script type="text/javascript">
	$(function () {   
		 $('#wgz_user_form').submit(function(event) {
     $('.wgz-submit').val('Processing...');
    	event.preventDefault();
        $.ajax({
            url: '{{route("editAttendanceRulePost")}}',
            type: 'POST',
            data: $(this).serialize(),   
            success: function (data) {
                if(data.status == 401){             
                   toastr.error(data.message);
                }else
                {
                  toastr.success(data.message);
               	    setInterval(function(){ window.location.href="{{route('allattendancerules')}}"; }, 1500);  	
                               
                }
                  $('.wgz-submit').val('Submit');                 
            }
        }); 
    });

	 $('#timepicker').datetimepicker({
        format: 'HH:mm'
    })
    $('#timepicker2').datetimepicker({
      format: 'HH:mm'
    })
    $('#timepicker3').datetimepicker({
      format: 'HH:mm'
    })
    $('#timepicker4').datetimepicker({
      format: 'HH:mm'
    })
     $('#timepicker5').datetimepicker({
      format: 'HH:mm'
    })
      $('#timepicker6').datetimepicker({
      format: 'HH:mm'
    })
       $('#timepicker7').datetimepicker({
      format: 'HH:mm'
    })
       $('#timepicker11').datetimepicker({
      format: 'HH:mm'
    })
    $(".collapsed").click(function(event){
	    $(".collapse2").fadeToggle().delay(100);
})

   $(".collapsedanomaly").click(function(event){
	    $(".anomalysetting").fadeToggle().delay(100);
})
   if($(".collapsed").is(':checked')){
   	 $(".collapse2").show();
   }
   if($(".collapsedanomaly").is(':checked')){
   	 $(".anomalysetting").show();
   }
   $(".collapsedanomalyintime").click(function(event){
	    $(".anomalysettingintime").fadeToggle().delay(100);
})
    $(".collapsedanomalyouttime").click(function(event){
	    $(".anomalysettingouttime").fadeToggle().delay(100);
})
});
</script>
<style>
	ul {
	list-style: none;
}
.shifttimings{
	background-color: #dfdfdf;
}
.anomalysetting{
	background-color: #dfdfdf;
}

</style>
@endsection

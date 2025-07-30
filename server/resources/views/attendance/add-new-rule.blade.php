@extends('layouts.app') @section('header')
<link href="{{ asset('/css/jquery.tagsinput-revisited.css') }}" rel="stylesheet">
@endsection @section('content')
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Add New Rule</h1>
            </div>
            <div class="col-sm-6 text-right"></div>
        </div>
    </div>
    <!-- /.container-fluid -->
</section>

<div class="container-fluid">
    <div class="card add-user-sec">
        <div class="card-body">
            <div class="row1 mr-1 wgz_user_form">
                <form action="" method="post" id="wgz_user_form">
                    @csrf
                    <div class="col-lg-12">
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade active show mt-2" id="general" role="tabpanel" aria-labelledby="general-tab">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label>Rule Name</label>
                                        <div class="form-icon">
                                            <input class="form-control input-border" type="text" value="" name="rule_name" id="name" maxlength="25">
                                            <img src="/hrm/public/dist/img/2021/icons/name-icon.png" alt>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="mt-0">Description</label>
                                        <div class="form-icon">
                                            <textarea class="form-control input-border text" name="description" id="description" maxlength="25"></textarea>
                                            <i class="fas fa-clipboard-list"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mt-3  py-3">
                                        <ul class="p-0 mt-3">

                                            <label class="mt-0">Employee Role</label>
                                            <div class="form-icon">
                                                <select class="form-control" name="employee_role_id">
                                                    <option value="">--Choose Employee Role--</option>
                                                    @foreach($roles as $role)
                                                    <option value="{{$role->id}}">{{$role->role_name}}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </ul>
                                    </div>

                                    <div class="col-md-6 mt-3  py-3">
                                        <ul class="p-0 mt-3">
                                            <div class="form-check"><label>Working hours</label>
                                                <div class="input-group date" id="timepicker8" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" name="per_day_working_hours" data-target="#timepicker8" />
                                                    <div class="input-group-append" data-target="#timepicker8" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="mt-3  py-3 shifttimings">
                                            <h5>
                                                <b>Shift Timings </b>
                                            </h5>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="bootstrap-timepicker">
                                                        <div class="form-group">
                                                            <label>In Time</label>

                                                            <div class="input-group date" id="timepicker" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" name="shift_in_time" data-target="#timepicker" />
                                                                <div class="input-group-append" data-target="#timepicker" data-toggle="datetimepicker">
                                                                    <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                                </div>
                                                            </div>
                                                            <!-- /.input group -->
                                                        </div>
                                                        <!-- /.form group -->
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="bootstrap-timepicker">
                                                        <div class="form-group">
                                                            <label>Out Time</label>

                                                            <div class="input-group date" id="timepicker2" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" name="shift_out_time" data-target="#timepicker2" />
                                                                <div class="input-group-append" data-target="#timepicker2" data-toggle="datetimepicker">
                                                                    <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                                </div>
                                                            </div>
                                                            <!-- /.input group -->
                                                        </div>
                                                        <!-- /.form group -->
                                                    </div>
                                                </div>



                                                <div class="col-md-6">
                                                    <ul class="p-0 mt-3">
                                                        <li><label>Enable Anomaly Deduction</label> <input type="checkbox" checked data-toggle="toggle" name="anomaly_deduction" data-size="small" value="1">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="col-md-6">
                                                    <ul class="p-0 mt-3">
                                                        <li><label>Enable Anomaly Tracking</label> <input class="collapsedanomaly" type="checkbox" data-toggle="toggle" name="anomaly_tracking" data-size="small" value="1">
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="p-3 anomalysetting collapse">
                                            <h5>
                                                <b>Anomaly Settings</b>
                                            </h5>
                                            <br>
                                            <ul class="p-0">
                                                <div class="form-check">
                                                    <input class="form-check-input collapsedanomalyintime" type="checkbox" value="" checked>
                                                    <li>In Time</li>
                                                </div>
                                                <div class="anomalysettingintime">
                                                    <label>In Time Grace Period</label>
                                                    <div class="input-group date" id="timepicker3" data-target-input="nearest">
                                                        <input type="text" class="form-control datetimepicker-input" name="anomaly_in_time" data-target="#timepicker3" />
                                                        <div class="input-group-append" data-target="#timepicker3" data-toggle="datetimepicker">
                                                            <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ul>
                                            <ul class="p-0">
                                                <div class="form-check">
                                                    <input class="form-check-input collapsedanomalyouttime" type="checkbox" value="" checked>
                                                    <li>Out Time</li>
                                                </div>
                                                <div class="anomalysettingouttime">
                                                    <label>Out Time Grace Period</label>
                                                    <div class="input-group date" id="timepicker4" data-target-input="nearest">
                                                        <input type="text" class="form-control datetimepicker-input" name="anomaly_out_time" data-target="#timepicker4" />
                                                        <div class="input-group-append" data-target="#timepicker4" data-toggle="datetimepicker">
                                                            <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ul>
                                        </div>
                                         <div class="row">
                                            <div class="col-md-12">
                                                <ul class="p-0 mt-3 anomaly-field">
                                                    <li><label> Auto ClockOut Time:</label>
                                                        <div class="input-group date" id="timepicker11" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" name="auto_clockout" data-target="#timepicker11" />
                                                            <div class="input-group-append" data-target="#timepicker11" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <ul class="p-0 mt-3 anomaly-field">
                                                    <li><label>Less then</label>
                                                        <div class="input-group date" id="timepicker5" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" name="work_full_time_duration" data-target="#timepicker5" />
                                                            <div class="input-group-append" data-target="#timepicker5" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                            </div>
                                                        </div><label>will be considered as full day leave</label>
                                                    </li>
                                                </ul>

                                            </div>
                                            <div class="col-md-12">
                                                <ul class="p-0 mt-3 anomaly-field">
                                                    <li><label>Less then</label>
                                                        <div class="input-group date" id="timepicker6" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" name="work_half_time_duration" data-target="#timepicker6" />
                                                            <div class="input-group-append" data-target="#timepicker6" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                            </div>
                                                        </div><label>will be considered as Half day leave</label>
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6">
                                                <ul class="p-0 mt-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="" checked> <label>Maximum total break duration</label>
                                                        <div class="input-group date" id="timepicker7" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" name="break_duration" data-target="#timepicker7" />
                                                            <div class="input-group-append" data-target="#timepicker7" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ul>
                                            </div>
                                            <div class="col-md-6">
                                                <ul class="p-0 mt-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" value="" checked> <label>Maximum no. of breaks</label>
                                                        <input class="form-control" type="number" value="" max="10" name="max_break" checked>

                                                    </div>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="row">
                                        <div class="col-md-6 mt-3  py-3">

                                        <ul class="p-0 mt-3">
                                            <div class="form-check"><label>Work short leave duration</label>
                                                <div class="input-group date" id="timepicker9" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" name="work_short_leave_duration" data-target="#timepicker9" />
                                                    <div class="input-group-append" data-target="#timepicker9" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="far fa-clock"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                       <?php
                                       $roles =App\Roles::where('id',Auth::user()->user_role)->first();
                                    ?>
                                    @if($roles->add != '2')
                                    <div class="col-md-6 mt-3  py-3">
                                        <ul class="p-0 mt-3">

                                            <label class="mt-0">Assign To</label>
                                            <div class="form-icon">
                                                <select class="form-control" name="created_by">
                                                    <option value="">--Choose whom you want to assign--</option>
                                                      <?php
                                                        if($roles->add == '4')
                                                        {
                                                          $assign = App\Employees::where('manager_id',Auth::user()->id)->orWhere('id',Auth::user()->id)->get();
                                                         
                                                        }
                                                        elseif($roles->add =='5')
                                                        {
                                                           $all_roles =App\Roles::where('id','!=', '2')->pluck('id')->toArray();
                                                           $assign =App\Employees::whereIn('user_role', $all_roles)->get();
                                                        }
                                                        else
                                                        {
                                                            $assign = App\Employees::where('manager_id',Auth::user()->id)->get();
                                                        }
                                                        ?>
                                                        @foreach($assign as $assign)
                                                        <option value="{{$assign->id}}">{{$assign->name}}</option>
                                                        @endforeach
                                                </select>
                                            </div>
                                        </ul>
                                    </div>
                                    @endif
                                    
                                   </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input class="btn btn-success float-right  wgz-submit site-main-btn" type="submit" name="submit">
                    </div>

                </form>
            </div>

        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->
</div>
@endsection @section('footer')
<script type="text/javascript">
    $(function() {
        $('#wgz_user_form').submit(function(event) {
            $('.wgz-submit').val('Processing...');
            event.preventDefault();
            $.ajax({
                url: '{{route("addattendancerulepost")}}',
                type: 'POST',
                data: $(this).serialize(),
                success: function(data) {
                    if (data.status == 401) {
                        toastr.error(data.message);
                    } else {
                        toastr.success(data.message);
                        setInterval(function() {
                            window.location.href = "{{route('allattendancerules')}}";
                        }, 1500);
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
        $('#timepicker8').datetimepicker({
            format: 'HH:mm'
        })
        $('#timepicker9').datetimepicker({
            format: 'HH:mm'
        })
        $('#timepicker11').datetimepicker({
            format: 'HH:mm'
        })
        $(".collapsed").click(function(event) {
            $(".collapse2").fadeToggle().delay(100);
        })

        $(".collapsedanomaly").click(function(event) {
            $(".anomalysetting").fadeToggle().delay(100);
        })
        $(".collapsedanomalyintime").click(function(event) {
            $(".anomalysettingintime").fadeToggle().delay(100);
        })
        $(".collapsedanomalyouttime").click(function(event) {
            $(".anomalysettingouttime").fadeToggle().delay(100);
        })
    });

</script>
<style>
    ul {
        list-style: none;
    }

    .shifttimings {
        background-color: #dfdfdf;
    }

    .anomalysetting {
        background-color: #dfdfdf;
    }

    .anomaly-field li {
        display: flex;
        align-items: center;
    }

    .anomaly-field li label:first-child {
        margin-right: 10px;
    }

    .anomaly-field li label:last-child {
        margin-left: 10px;
    }

    .anomaly-field .input-group {
        flex: 1;
    }

</style>
@endsection

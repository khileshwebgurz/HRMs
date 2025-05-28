import React from 'react'
import { Link } from 'react-router-dom'
const RightSidebar = ({isOpen}) => {
  return (
    <>
    
	<div className="card card-primary card-outline Dashboard-card"  style={{
        width: isOpen ? "250px" : "0",
        transition: "0.3s",
        overflow: "hidden",
        background: "#333",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        top: 10,
		right: 0,
      }}>
		<div className="card-body box-profile">
			<div className="text-center">

			{/* <?php
			$employees = App\Employees::where('id',Auth::user()->id)->first();
			?> */}
			{/* @if($employees->profile_pic == '') */}
				<img className="profile-user-img img-fluid img-circle"
					src="{{ asset('/dist/img/profile'.Auth::user()->gender.'.png') }}"
					alt="User profile picture"/>
			{/* @else */}
				 <img src="{{asset('/uploads/employees-photos/'.$employees->profile_pic.'')}}" style={{width: "125px",height: "125px", borderRadius: "50%", marginTop: "-3px"}}/>
			{/* @endif */}
			</div>

			<h3 className="profile-username p-user text-center"><a  href="{{ route('em-logout') }}">
					<i className="fas fa-power-off"		style={{fontSize: "17px",marginTop: "7px", marginLeft: "3px"}}></i></a>
			</h3>
				<a href="{{ route('em-edit-profile') }}"
						style={{textAlign: "center",marginLeft: "41px",fontSize: "13px"}}>Change Password
					     </a>

			{/* <!-- <p className="text-muted text-center">{{$candidate->job_title}}</p> --> */}
		</div>
	
		<div className="profile-usermenu">
			<nav className="wgz-employee-menu">
				<ul className="nav nav-pills nav-sidebar flex-column">
					<li className="nav-item"><Link to="/dashboard"
						
						className="nav-link"> <i className="nav-icon fas fa-tachometer-alt"></i>
							Dashboard
					</Link></li>

					{/* <!-- <li className="nav-item"><a href="{{ route('em-edit-profile') }}"
						className="nav-link"> <i className="nav-icon fas fa-user-alt"></i> Edit
							Profile
					</a></li> --> */}

					
					<li className="nav-item"><a href="{{ route('em-salary-slip') }}"
						className="nav-link"> <i className="nav-icon fas fa-newspaper"></i>Salary Slip
					</a></li>

					<li className="nav-item"><a href="{{ route('em-interview-list') }}"
						className="nav-link"> <i className="nav-icon fas fa-briefcase"></i>
							Interviews
					</a></li>
					{/* @if(Auth::user()->is_manager == '1' || Auth::user()->user_role == '3') */}
					<li className="nav-item"><a href="{{ route('em-resignation-list') }}"
						className="nav-link"> <i className="nav-icon fas fa-clock"></i>
							Employees Resignation
					</a></li>
					<li className="nav-item"><a href="{{route('attendance-whole-report-emp')}}"
						className="nav-link"> <i className="nav-icon far fa-bell"></i>
							<p>Attendance Report</p>
					</a></li>
					{/* @endif
					<?php
					$resign =App\EmployeeExit::where('employee_id', Auth::user()->id)->where('status' , '2')->orWhere('status' ,'3')->first();
					?> */}
					{/* @if($resign) */}
					<li className="nav-item"><a href="{{ route('exit-quiz') }}" className="nav-link"><i className="nav-icon fas fa-question-circle"></i>Exit Quiz
					</a></li>
					{/* @endif */}
					<li className="nav-item"><a href="{{ route('em-viewEmployee',['personal']) }}" data-tab1="{{ route('em-viewEmployee',['official']) }}" data-tab2="{{ route('em-viewEmployee',['appraisal']) }}"
						className="nav-link"> <i className="nav-icon fas fa-edit"></i>Edit
							Profile
					</a></li>

                    <li className="nav-item"><a
						className="nav-link"> <i className="nav-icon fab fa-paypal"></i> Payroll
					</a></li>
					{/* @if(Auth::user()->id == '1') */}
					<li className="nav-item"><a href="{{ route('em-ticket-system', 'alltickets') }}"
						className="nav-link"><i className="nav-icon fas fa-clock"></i>
							Webguruz Incident Management System
					</a></li>
					{/* @endif */}

					{/* @if(Auth::user()->user_role == '3') */}
					<li className="nav-item"><a href="{{ route('domain-and-renewal') }}"
						className="nav-link"><i className="nav-icon fas fa-globe"></i>
							Domain & Renewals
					</a></li>
					{/* @endif */}
					<li className="nav-item"><a href="{{ route('em-leaves') }}"
						className="nav-link"> <i className="nav-icon fas fa-umbrella-beach"></i> Leaves
					</a></li>
					<li className="nav-item"><a href="{{ route('em-notifications') }}"
						className="nav-link"> <i className="nav-icon fas fa-bell"></i>Notifications
					</a></li>
                     
                     <li className="nav-item"><a href="{{ route('em-meetingroom') }}"
						className="nav-link"> <i className="nav-icon far fa-handshake"></i> Meeting Room
					</a></li>

                    <li className="nav-item"><a href="{{ route('em-attendance') }}"
						className="nav-link"> <i className="nav-icon fas fa-user-clock"></i> Attendance
					</a></li>

					<li className="nav-item"><a href="{{ route('em-spiritclub') }}"
						className="nav-link"> <i className="nav-icon fas fa-users"></i>Spirit Club
					</a></li>
                     
					<li className="nav-item"><a href="{{ route('em-calender') }}"
						className="nav-link"> <i className="nav-icon fas fa-calendar-alt"></i>
							Events
					</a></li>


					<li className="nav-item"><a href=""
						className="nav-link"> <i className="nav-icon fas fa-certificate"></i>
							Appraisals
					</a></li>


					<li className="nav-item"><a href="{{ route('em-exit') }}"
						className="nav-link"> <i className="nav-icon far fa-times-circle"></i>
							Exit
					</a></li>

					<li className="nav-item"><a href="{{ route('em-project-dashboard') }}"
						className="nav-link"> <i className="nav-icon fas fa-project-diagram"></i>
							Projects
					</a></li>

					<li className="nav-item"><a href=""
						className="nav-link"> <i className="nav-icon fas fa-tasks"></i> Tasks
					</a></li>

					<li className="nav-item"><a href="{{ route('em-logout') }}"
						className="nav-link"> <i className="nav-icon fas fa-sign-out-alt"></i>
							Logout
					</a></li>
				</ul>
			</nav>
		</div>
	</div>

    </>
  )
}

export default RightSidebar
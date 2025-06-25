import React from "react";
import { Link } from "react-router-dom";
import "../../public/css/employee-panel.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const RightSidebar = ({ isOpen, user, toggleSidebar }) => {
  const navigate = useNavigate();

  const defaultProfile = `/dist/img/profile.png`;
  const profilePic = user?.profile_pic
    ? `/uploads/employees-photos/${user.profile_pic}`
    : defaultProfile;

  const handleLogout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/login");
  };

  return (
    <>
      <div
        className="card card-primary card-outline Dashboard-card"
        style={{
          width: isOpen ? "250px" : "0",
          transition: "0.3s",
          overflow: "hidden",
          background: "#333",

          position: "fixed",
          top: 10,
          right: 0,
        }}
      >
        <div className="card-body box-profile">
          <span onClick={toggleSidebar} style={{ color: "white",  }}>
            X
          </span>

          <div className="text-center">
            {user?.profile_pic === "" || !user?.profile_pic ? (
              <img
                className="profile-user-img img-fluid img-circle"
                src={profilePic}
                alt="User profile picture"
              />
            ) : (
              <img
                src={`/uploads/employees-photos/${user.profile_pic}`}
                style={{
                  width: "125px",
                  height: "125px",
                  borderRadius: "50%",
                  marginTop: "-3px",
                }}
                alt="User profile"
              />
            )}
          </div>

          <h3 className="profile-username p-user text-center">
            <button onClick={handleLogout}>
              <i
                className="fas fa-power-off"
                style={{
                  fontSize: "17px",
                  marginTop: "7px",
                  marginLeft: "3px",
                }}
              ></i>
            </button>
          </h3>
          <Link
            to="/change-password"
            style={{
              textAlign: "center",
              marginLeft: "41px",
              fontSize: "13px",
            }}
          >
            Change Password
          </Link>
        </div>

        <div className="profile-usermenu">
          <nav className="wgz-employee-menu">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
              </li>

              {user?.id === 1 && (
                <li className="nav-item">
                  <Link to="/roles" className="nav-link">
                    <i className="nav-icon fas fa-clock"></i>
                    Role List
                  </Link>
                </li>
              )}
              {user?.id === 1 && (
                <li className="nav-item">
                  <Link to="/roles/add" className="nav-link">
                    <i className="nav-icon fas fa-clock"></i>
                    Add Role
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link href="/salary-slip" className="nav-link">
                  <i className="nav-icon fas fa-newspaper"></i>Salary Slip
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/interviews" className="nav-link">
                  <i className="nav-icon fas fa-briefcase"></i>
                  Interviews
                </Link>
              </li>
              {/* @if(Auth::user()->is_manager == '1' || Auth::user()->user_role == '3') */}
              {(user?.is_manager === "1" || user?.user_role === "3") && (
                <>
                  <li className="nav-item">
                    <Link to="/resignation" className="nav-link">
                      <i className="nav-icon fas fa-clock"></i>
                      Employees Resignation
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/attendance-report" className="nav-link">
                      <i className="nav-icon far fa-bell"></i>
                      <p>Attendance Report</p>
                    </Link>
                  </li>
                </>
              )}
              {/* @endif
					<?php
					$resign =App\EmployeeExit::where('employee_id', Auth::user()->id)->where('status' , '2')->orWhere('status' ,'3')->first();
					?> */}
              {/* @if($resign) */}
              <li className="nav-item">
                <Link href="/exit-quiz" className="nav-link">
                  <i className="nav-icon fas fa-question-circle"></i>Exit Quiz
                </Link>
              </li>
              {/* @endif */}
              <li className="nav-item">
                <Link to="/edit-profile/personal" className="nav-link">
                  <i className="nav-icon fas fa-edit"></i>Edit Profile
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/payroll" className="nav-link">
                  <i className="nav-icon fab fa-paypal"></i> Payroll
                </Link>
              </li>
              {/* @if(Auth::user()->id == '1') */}
              {user?.id === 1 && (
                <li className="nav-item">
                  <Link to="/ticket" className="nav-link">
                    <i className="nav-icon fas fa-clock"></i>
                    Webguruz Incident Management System
                  </Link>
                </li>
              )}
              {/* @endif */}

              {/* @if(Auth::user()->user_role == '3') */}
              {user?.user_role === "3" && (
                <li className="nav-item">
                  <Link to="domain-renewal" className="nav-link">
                    <i className="nav-icon fas fa-globe"></i>
                    Domain & Renewals
                  </Link>
                </li>
              )}
              {/* @endif */}
              <li className="nav-item">
                <Link to="/leaves" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-umbrella-beach"></i> Leaves
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/notification" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-bell"></i>Notifications
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/meeting-room" className="nav-link">
                  {" "}
                  <i className="nav-icon far fa-handshake"></i> Meeting Room
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/attendance" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-user-clock"></i> Attendance
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/spiritClub" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-users"></i>Spirit Club
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/calendar" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  Events
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/appraisals" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-certificate"></i>
                  Appraisals
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/exit" className="nav-link">
                  {" "}
                  <i className="nav-icon far fa-times-circle"></i>
                  Exit
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/projects" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-project-diagram"></i>
                  Projects
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/tasks" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-tasks"></i> Tasks
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/logout" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-sign-out-alt"></i>
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;

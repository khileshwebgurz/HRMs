import { Link } from "react-router-dom";
import "../../public/css/employee-panel.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({ isOpen, user, toggleSidebar }) => {
  const navigate = useNavigate();

  const defaultProfile = `/dist/img/profile.png`;
  const profilePic = user?.profile_pic
    ? `../../public/uploads/employees-photos/${user.profile_pic}`
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
    <div className={`sidebar-navmenu ${isOpen ? "open" : ""}`}>
      <div
        className="card card-primary card-outline Dashboard-card"
        // style={{
        //   width: isOpen ? "260px" : "0",
        //   transition: "0.3s",
        //   overflow: "hidden",
        //   right: 0,
        // }}
      >
        <div className="card-body box-profile">
          <span className="close-sidebar-navmenu" onClick={toggleSidebar}>
           <i class="fas fa-times"></i>
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
            {user?.name || "User Name"}
            <button onClick={handleLogout}>
              <i
                className="fas fa-power-off"
              ></i>
            </button>
          </h3>
          <Link
            to="/change-password"
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
                <Link to="/employee/account/salary-slip" className="nav-link">
                  <i className="nav-icon fas fa-newspaper"></i>Salary Slip
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link to="/interviews" className="nav-link">
                  <i className="nav-icon fas fa-briefcase"></i>
                  Interviews
                </Link>
              </li> */}
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
                    <Link to="/attendance-report" className="nav-link">
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
              {/* <li className="nav-item">
                <Link to="/exit-quiz" className="nav-link">
                  <i className="nav-icon fas fa-question-circle"></i>Exit Quiz
                </Link>
              </li> */}
              {/* @endif */}
              <li className="nav-item">
                <Link to="/edit-profile/personal" className="nav-link">
                  <i className="nav-icon fas fa-edit"></i>Edit Profile
                </Link>
              </li>

               {/* Recruitment Section */}
               {user?.user_role === "1" && (
              <>
                  <li className="nav-item">
                    <Link to="#" className="nav-link">
                      <i className="nav-icon fas fa-user-tie"></i>
                      Manage Candidates
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users/candidate/all-candidates" className="nav-link">
                      <i className="nav-icon fas fa-list"></i>
                      All Candidates
                    </Link>
                  </li>
                  <li className="nav-item">
                   <Link to="/add-candidate" className="nav-link">
                      <i className="nav-icon fas fa-user-plus"></i>
                      Add Candidate
                    </Link>

                  </li>
                  <li className="nav-item">
                    <Link to="/tracker/candidates" className="nav-link">
                      <i className="nav-icon fas fa-chart-line"></i>
                      Candidate Tracker
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/import-candidates" className="nav-link">
                      <i className="nav-icon fas fa-file-import"></i>
                      Import Candidates
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/career" className="nav-link">
                      <i className="nav-icon fas fa-file-alt"></i>
                      Job Applications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/public/users/all-candidate-test" className="nav-link">
                      <i className="nav-icon fas fa-clipboard-check"></i>
                      Review Aptitude Test
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/public/interview/all-interviews" className="nav-link">
                      <i className="nav-icon fas fa-calendar-alt"></i>
                      Schedule Interview
                    </Link>
                  </li>
                </>
              )}

              {/* <li className="nav-item">
                <Link to="/payroll" className="nav-link">
                  <i className="nav-icon fab fa-paypal"></i> Payroll
                </Link>
              </li> */}
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

              {/* <li className="nav-item">
                <Link to="/meeting-room" className="nav-link">
                  {" "}
                  <i className="nav-icon far fa-handshake"></i> Meeting Room
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link to="/attendance" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-user-clock"></i> Attendance
                </Link>
              </li> */}

              <li className="nav-item">
                <Link to="/spiritClub" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-users"></i>Spirit Club
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link to="/calendar" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  Events
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link to="/appraisals" className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-certificate"></i>
                  Appraisals
                </Link>
              </li> */}
{/* 
              <li className="nav-item">
                <Link to="/exit" className="nav-link">
                  {" "}
                  <i className="nav-icon far fa-times-circle"></i>
                  Exit
                </Link>
              </li> */}

               

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

              <li className="nav-item" onClick={handleLogout}>
                <Link className="nav-link">
                  {" "}
                  <i className="nav-icon fas fa-sign-out-alt"></i>
                  Logout
                </Link>
              </li>

              
            

            </ul>
          </nav>
        </div>
      </div>
      </div>
    </>
  );
};

export default RightSidebar;

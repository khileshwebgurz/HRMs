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
              <i className="fas fa-times"></i>
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
                <i className="fas fa-power-off"></i>
              </button>
            </h3>
            <Link to="/change-password">Change Password</Link>
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

                {user?.user_role === "1" ? (
                  <li className="nav-item">
                    <Link to="/public/salary-slip" className="nav-link">
                      <i className="nav-icon fas fa-newspaper"></i>Salary Slip
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link
                      to="/employee/account/salary-slip"
                      className="nav-link"
                    >
                      <i className="nav-icon fas fa-newspaper"></i>Salary Slip
                    </Link>
                  </li>
                )}

                {(user?.user_role === "1" || user?.user_role === "3") && (
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
                      <Link to="/roles" className="nav-link">
                        <i className="nav-icon fas fa-clock"></i>
                        Role List
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/roles/add" className="nav-link">
                        <i className="nav-icon fas fa-clock"></i>
                        Add Role
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/users/candidate/all-candidates"
                        className="nav-link"
                      >
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
                      <Link to="/employee/employee-team" className="nav-link">
                        <i className="nav-icon fas fa-user-plus"></i>
                        Assign Team Manager
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

                    {/* Inventory Sidebars */}
                    <li className="nav-item">
                      <Link to="#" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Inventory
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/all-categories" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Category Management
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/all-vendors" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Vendor Management
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/all-rooms" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Cabin Management
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/all-inventories" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Inventory Management
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/inventory-request" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Inventory Request
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/inventory/all-logs" className="nav-link">
                        <i className="nav-icon fas fa-file-alt"></i>
                        Inventory Logs
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to="/public/users/all-candidate-test"
                        className="nav-link"
                      >
                        <i className="nav-icon fas fa-clipboard-check"></i>
                        Review Aptitude Test
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/public/interview/all-interviews"
                        className="nav-link"
                      >
                        <i className="nav-icon fas fa-calendar-alt"></i>
                        Schedule Interview
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/ticket" className="nav-link">
                        <i className="nav-icon fas fa-clock"></i>
                        Webguruz Incident Management System
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to="/public/employee/helpdesk" className="nav-link">
                        <i className="nav-icon fas fa-calendar-alt"></i>
                        HelpDesk Questions
                      </Link>
                    </li>
                  </>
                )}

                {user?.user_role === "3" && (
                  <li className="nav-item">
                    <Link to="domain-renewal" className="nav-link">
                      <i className="nav-icon fas fa-globe"></i>
                      Domain & Renewals
                    </Link>
                  </li>
                )}

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
                  <Link to="/spiritClub" className="nav-link">
                    {" "}
                    <i className="nav-icon fas fa-users"></i>Spirit Club
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

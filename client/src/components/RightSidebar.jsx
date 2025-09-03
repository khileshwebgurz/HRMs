import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../public/css/employee-panel.css";
import axios from "axios";
import { useState } from "react";

const RightSidebar = ({ isOpen, user, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Track which dropdown is open
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const defaultProfile = `/dist/img/profile.png`;
  const profilePic = user?.profile_pic
    ? `../../public/uploads/employees-photos/${user.profile_pic}`
    : defaultProfile;

  const handleLogout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    navigate("/login");
  };

  return (
    <div className={`sidebar-navmenu ${isOpen ? "open" : ""}`}>
      <div className="card card-primary card-outline Dashboard-card">
        <div className="card-body box-profile">
          <span className="close-sidebar-navmenu" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </span>

          <div className="text-center">
            {!user?.profile_pic ? (
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
              {/* Dashboard */}
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </Link>
              </li>

              {/* Salary Slip */}
              {user?.user_role === "1" ? (
                <li className="nav-item">
                  <Link
                    to="/public/salary-slip"
                    className={`nav-link ${location.pathname === "/public/salary-slip" ? "active" : ""}`}
                  >
                    <i className="nav-icon fas fa-newspaper"></i>
                    <p>Salary Slip</p>
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    to="/employee/account/salary-slip"
                    className={`nav-link ${location.pathname === "/employee/account/salary-slip" ? "active" : ""}`}
                  >
                    <i className="nav-icon fas fa-newspaper"></i>
                    <p>Salary Slip</p>
                  </Link>
                </li>
              )}

              {/* HR & Manager */}
              {(user?.user_role === "1" || user?.user_role === "3") && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/resignation"
                      className={`nav-link ${location.pathname === "/resignation" ? "active" : ""}`}
                    >
                      <i className="nav-icon fas fa-clock"></i>
                      <p>Employees Resignation</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/attendance-report"
                      className={`nav-link ${location.pathname === "/attendance-report" ? "active" : ""}`}
                    >
                      <i className="nav-icon far fa-bell"></i>
                      <p>Attendance Report</p>
                    </Link>
                  </li>
                </>
              )}

              {/* Edit Profile */}
              <li className="nav-item">
                <Link
                  to="/edit-profile/personal"
                  className={`nav-link ${location.pathname.startsWith("/edit-profile") ? "active" : ""}`}
                >
                  <i className="nav-icon fas fa-edit"></i>
                  <p>Edit Profile</p>
                </Link>
              </li>

              {/* Recruitment Section (Admin only) */}
              {user?.user_role === "1" && (
                <>
                  {/* Users */}
                  <li className={`nav-item ${openMenu === "users" ? "menu-open" : ""}`}>
                    <a
                      href="#"
                      className={`nav-link ${openMenu === "users" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu("users");
                      }}
                    >
                      <i className="nav-icon fas fa-user-tie"></i>
                      <p>
                        Users
                        <i className="right fas fa-angle-left"></i>
                      </p>
                    </a>
                    <ul
                      className="nav nav-treeview"
                      style={{ display: openMenu === "users" ? "block" : "none" }}
                    >
                      <li className="nav-item">
                        <Link to="/roles" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Role List</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/roles/add" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Add Role</p>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Candidates */}
                  <li className={`nav-item ${openMenu === "candidates" ? "menu-open" : ""}`}>
                    <a
                      href="#"
                      className={`nav-link ${openMenu === "candidates" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu("candidates");
                      }}
                    >
                      <i className="nav-icon fas fa-users"></i>
                      <p>
                        Candidates
                        <i className="right fas fa-angle-left"></i>
                      </p>
                    </a>
                    <ul
                      className="nav nav-treeview"
                      style={{ display: openMenu === "candidates" ? "block" : "none" }}
                    >
                      <li className="nav-item">
                        <Link to="/users/candidate/all-candidates" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>All Candidates</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/add-candidate" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Add Candidate</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/employee/employee-team" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Assign Team Manager</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/tracker/candidates" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Candidate Tracker</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/import-candidates" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Import Candidates</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/career" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Job Applications</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/users/all-candidate-test" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Review Aptitude Test</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/interview/all-interviews" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Schedule Interview</p>
                        </Link>
                      </li>
                    </ul>
                  </li>

                                    <li className={`nav-item ${openMenu === "users" ? "menu-open" : ""}`}>
                    <a
                      href="#"
                      className={`nav-link ${openMenu === "users" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu("users");
                      }}
                    >
                      <i className="nav-icon fas fa-user-tie"></i>
                      <p>
                        Manage Employees
                        <i className="right fas fa-angle-left"></i>
                      </p>
                    </a>
                    <ul
                      className="nav nav-treeview"
                      style={{ display: openMenu === "users" ? "block" : "none" }}
                    >
                      <li className="nav-item">
                        <Link to="/onboarding/all-candidates" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Onboarding List</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/all-employees" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>All Employees</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/users/all-onboard-requests" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>OnBoarding Request</p>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Inventory */}
                  <li className={`nav-item ${openMenu === "inventory" ? "menu-open" : ""}`}>
                    <a
                      href="#"
                      className={`nav-link ${openMenu === "inventory" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu("inventory");
                      }}
                    >
                      <i className="nav-icon fas fa-boxes"></i>
                      <p>
                        Inventory
                        <i className="right fas fa-angle-left"></i>
                      </p>
                    </a>
                    <ul
                      className="nav nav-treeview"
                      style={{ display: openMenu === "inventory" ? "block" : "none" }}
                    >
                      <li className="nav-item">
                        <Link to="/public/inventory/all-categories" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Category Management</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/inventory/all-vendors" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Vendor Management</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/inventory/all-rooms" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Cabin Management</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/inventory/all-inventories" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Inventory Management</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/inventory/inventory-request" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Inventory Request</p>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/public/inventory/all-logs" className="nav-link">
                          <i className="fas fa-angle-right nav-icon"></i>
                          <p>Inventory Logs</p>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Ticket */}
                  <li className="nav-item">
                    <Link to="/ticket" className="nav-link">
                      <i className="nav-icon fas fa-clock"></i>
                      <p>Incident Management</p>
                    </Link>
                  </li>

                  {/* HelpDesk */}
                  <li className="nav-item">
                    <Link to="/public/employee/helpdesk" className="nav-link">
                      <i className="nav-icon fas fa-question-circle"></i>
                      <p>HelpDesk Questions</p>
                    </Link>
                  </li>
                </>
              )}

              {/* Manager Only */}
              {user?.user_role === "3" && (
                <li className="nav-item">
                  <Link to="/domain-renewal" className="nav-link">
                    <i className="nav-icon fas fa-globe"></i>
                    <p>Domain & Renewals</p>
                  </Link>
                </li>
              )}

              {/* Leaves */}
              <li className="nav-item">
                <Link to="/leaves" className="nav-link">
                  <i className="nav-icon fas fa-umbrella-beach"></i>
                  <p>Leaves</p>
                </Link>
              </li>

              {/* Notifications */}
              <li className="nav-item">
                <Link to="/notification" className="nav-link">
                  <i className="nav-icon fas fa-bell"></i>
                  <p>Notifications</p>
                </Link>
              </li>

              {/* Spirit Club */}
              <li className="nav-item">
                <Link to="/spiritClub" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>Spirit Club</p>
                </Link>
              </li>

              {/* Logout */}
              <li className="nav-item" onClick={handleLogout}>
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-sign-out-alt"></i>
                  <p>Logout</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

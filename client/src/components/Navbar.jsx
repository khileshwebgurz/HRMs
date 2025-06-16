import React from "react";
import "../assets/css/navbar.css";
import { useState, useEffect } from "react";
// import '../../public/css/admin-panel.css'
import { Link } from "react-router-dom";
import webgurzLogo from "/dist/img/webguruz-logo-blue.png";
import RightSidebar from "./RightSidebar";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };


  useEffect(() => {
    const fetchNotification = async () => {
      const Notify = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/notification`,
        { withCredentials: true }
      );
      setNotification(Notify.data.data);
    };
    fetchNotification();
  }, []);
  console.log("my notification are >>>>", notification);

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

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  return (
    <>
      <div className="wrapper" id="menu_button">
        <nav className="main-header navbar navbar-expand-md navbar-light navbar-dark dark-header">
          <div className="container">
            <Link to="/employee/dashboard" className="brand-link wgz_main_logo">
              <img
                src={webgurzLogo}
                alt="AdminLTE Logo"
                className="brand-image elevation-3"
              />
            </Link>
            <ul className="navbar-nav ml-auto wgz_notification">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="fas fa-home"></i>
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link"
                  data-toggle="dropdown"
                  onClick={toggleDropdown}
                  title="Notifications"
                >
                  {" "}
                  <i className="far fa-bell"></i>{" "}
                  <span className="badge badge-warning navbar-badge">
                    {notification.length}
                  </span>
                </a>

                {showDropdown && (
                  <div
                    className="dropdown-menu dropdown-menu-lg dropdown-menu-right show"
                    style={{ right: 0, left: "auto" }}
                  >
                    {notification.length === 0 ? (
                      <span className="dropdown-item text-center text-muted">
                        No notifications
                      </span>
                    ) : (
                      notification.map((note, index) => (
                        <Link
                        key={index}
                        to={note.link || '#'}
                        className="dropdown-item"
                      >
                        {note.message}
                      </Link>
                      ))
                    )}
                  </div>
                )}
              </li>

              <li className="nav-item dropdown" style={{ display: "" }}>
                <div className="clock-in-container">
                  <div
                    id="clockInWrapper"
                    className="no-gutters clockInUser"
                    data-log-id="a748c773-a3cb-4e2f-abd5-67cc3c40fbf8"
                  >
                    <div id="clockInDate" className="text-uppercase"></div>

                    <div className="clockInAction d-flex">
                      <button
                        id="clockInBtn"
                        data-clocked-in="false"
                        data-selfie="false"
                        className="clockInBtn btn custom-btn clockInBigAct waves-effect waves-light btn-danger clockInRed"
                      >
                        <span className="inLabel" id="clock_in">
                          CLOCK-IN
                        </span>{" "}
                        <span className="outLabel" style={{ display: "none" }}>
                          CLOCK-OUT
                        </span>
                        <span className="inTime"></span>{" "}
                        <span
                          className="clockOutCalc"
                          style={{ display: "None" }}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item dropdown">
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                  <a
                    // href="{{route('em-notifications')}}"
                    className="dropdown-item dropdown-footer"
                  >
                    See All Notifications
                  </a>
                </div>
              </li>

              <span
                className="user-name"
                style={{
                  color: "#bfc7cd",
                  marginLeft: "16px",
                  marginRight: "-5px",
                }}
              >
                {user.name}
              </span>
              <a
                className="nav-link user-profile"
                style={{ fontSize: "20px" }}
                onClick={handleLogout}
                // href="{{ route('em-logout') }}"
              >
                &nbsp;
                <i
                  className="fas fa-power-off"
                  style={{ verticalAlign: "text-top" }}
                ></i>
              </a>
              {/* <button >Logout</button> */}
            </ul>

            <button
              className="hamburger"
              id="sidebar_except"
              onClick={toggleSidebar}
            >
              <span></span>
            </button>

            <RightSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

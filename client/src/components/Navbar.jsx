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
import NotifyDropdown from "./Notification/NotifyDropdown";
import { notificationdata } from "./Notification/notificationdata";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayWorkingHour, setTodayWorkingHour] = useState("");
  const [hasClockedInData, setHasClockedInData] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClockIN = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/clockIn",
        {},
        { withCredentials: true }
      );

      const data = res.data;
      console.log("Clock In response >>>>", data);

      if (data.attendance?.alreadyLoggedIn === "yes") {
        setIsClockedIn(true);
        setTodayWorkingHour(data.today_working_hour || "00:00:00");
      }
    } catch (err) {
      console.error("Clock-In failed", err);
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/clockOut",
        {},
        { withCredentials: true }
      );

      console.log("Clock Out response >>>", res.data);
      setIsClockedIn(false);
      setTodayWorkingHour("");
      setHasClockedInData(false);
    } catch (err) {
      console.error("Clock-Out failed", err);
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await notificationdata();

        setNotification(res);
      } catch (err) {
        console.error("Failed to fetch clock data", err);
      }
    };

    fetchNotification();
  }, []);

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
            <Link to="/dashboard" className="brand-link wgz_main_logo">
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

                {showDropdown && <NotifyDropdown notification={notification} />}
              </li>

              <li className="nav-item dropdown">
                <div className="clock-in-container">
                  <div id="clockInWrapper" className="no-gutters clockInUser">
                    <div className="clockInAction d-flex flex-column align-items-center">
                      {/* {!hasClockedInData ? ( */}

                      {new Date()
                        .toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(",", "")}

                      <button
                        id="clockInBtn"
                        data-clocked-in={isClockedIn.toString()}
                        className={`clockInBtn btn custom-btn clockInBigAct waves-effect waves-light ${
                          isClockedIn ? "btn-success" : "btn-danger"
                        }`}
                      >
                        {isClockedIn ? (
                          <span onClick={handleClockOut} className="outLabel">
                            CLOCK-OUT
                          </span>
                        ) : (
                          <span
                            onClick={handleClockIN}
                            className="inLabel"
                            id="clock_in"
                          >
                            CLOCK-IN
                          </span>
                        )}
                      </button>
                      {/* ) : ( */}
                      <span className="inLabel" id="clock_in">
                        {todayWorkingHour}
                      </span>
                      {/* )} */}

                      {isClockedIn && todayWorkingHour && !hasClockedInData && (
                        <div className="mt-2 text-muted">
                          Today Working Hour: {todayWorkingHour}
                        </div>
                      )}
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

            <RightSidebar
              isOpen={showSidebar}
              toggleSidebar={toggleSidebar}
              user={user}
            />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

import "../assets/css/navbar.css";
import { useState, useEffect, useRef } from "react";
// import '../../public/css/admin-panel.css'
import { Link } from "react-router-dom";
import webgurzLogo from "../../public/dist/img/webguruz-logo-white.png";
import RightSidebar from "./RightSidebar";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotifyDropdown from "./Notification/NotifyDropdown";
import { notificationdata } from "./Notification/notificationdata";

const Navbar = ({myUser, isAdminMode, setIsAdminMode}) => {
  const navigate = useNavigate();
  const user = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayWorkingHour, setTodayWorkingHour] = useState("");
  // const [isAdminMode, setIsAdminMode] = useState(true);

  const [timer, setTimer] = useState("00:00:00");
  const intervalRef = useRef(null);

  const startTimer = (startTime) => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const diff = Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000
      );
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setTimer(`${h}:${m}:${s}`);
    }, 1000);
  };

  const toggleDropdown = () => {
    
    setShowDropdown((prev) => !prev);
  };

  const handleClockIn = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/clockIn`,
        {
          ip: "127.0.0.1",
          latitude: null,
          longitude: null,
        },
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        setIsClockedIn(true);
        const clockInTime = res.data.data.attendance.a_final;
        startTimer(clockInTime);
      }
    } catch (err) {
      console.error("Clock-In failed", err);
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/clockOut`,
        {
          ip: "127.0.0.1",
          latitude: null,
          longitude: null,
          type: "manual",
        },
        { withCredentials: true }
      );

      console.log("the clock out response is >>> ", res.data);
      if (res.data.status === 200) {
        setIsClockedIn(false);
        clearInterval(intervalRef.current);

        const todayHour = res.data.data.today_working_hour;
        const weeklyHour = res.data.data.weeklyWorkingHour;

        setTodayWorkingHour(todayHour);

        console.log("Clock-out success:", todayHour, weeklyHour);
      }
    } catch (err) {
      console.error("Clock-out failed", err);
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

  // useEffect(() => {
  //   const fetchAttendance = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_API_BASE_URL}/clockApi`,
  //         { withCredentials: true }
  //       );

  //       console.log("the alreadyLogged in are >>>", res.data);

  //       if (res.data.a_final) {
  //         setIsClockedIn(true);

  //          startTimer(res.data.a_final);
  //       } else {
  //         setIsClockedIn(false);
  //       }
  //     } catch (err) {
  //       console.error("Clock-In failed", err);
  //     }
  //   };
  //   fetchAttendance();

  //   return () => clearInterval(intervalRef.current);
  // }, []);

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

  const handleToggle = () => {
    console.log('is admin mode >>> ',isAdminMode)
    setIsAdminMode((prev) => !prev);
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
            <ul className="navbar-time-notification">
              <li className="nav-item dropdown">
                <div className="clock-in-container">
                  <div id="clockInWrapper" className="no-gutters clockInUser">
                    <div className="clockInAction d-flex align-items-center">
                      <div className="clockdatetime">
                        <div className="clockInDate" id="clockInDate">
                          {new Date()
                            .toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(",", "")}
                        </div>
                      </div>
                      <button
                        id="clockInBtn"
                        onClick={isClockedIn ? handleClockOut : handleClockIn}
                        className={`clockInBtn btn custom-btn clockInBigAct waves-effect waves-light ${
                          isClockedIn ? "btn-success" : "btn-danger"
                        }`}
                      >
                        {isClockedIn ? (
                          <>
                            <span className="outLabel">
                              <i className="fa-regular fa-clock"></i> CLOCK-OUT
                            </span>
                            <div className="timer-text">{timer}</div>
                          </>
                        ) : (
                          <span className="inLabel">
                            <i className="fa-regular fa-clock"></i> CLOCK-IN
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto wgz_notification">
              {(user.user_role == 1 ||
                user.user_role == 5 ||
                user.user_role == 7) && (
                <li className="nav-item">
                  <div
                    className="admin-toggle-btn"
                    onClick={handleToggle}
                    id="js-admin-toggle-btn"
                    style={{
                      cursor: "pointer",

                      border: "1px solid #ccc",
                      borderRadius: "20px",

                      backgroundColor: isAdminMode ? "red" : "#ddd",

                      position: "relative",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        height: "16px",
                        width: "16px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "2px",
                        left: isAdminMode ? "22px" : "2px",
                        transition: "left 0.2s ease",
                      }}
                    ></div>
                  </div>
                </li>
              )}

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
              {/* <div className="user-profile-div">
              <span className="user-name">{user.name}</span>
              <a className="nav-link user-profile" style={{ fontSize: "20px" }} onClick={handleLogout}>
                &nbsp;
                <i className="fas fa-power-off" style={{ verticalAlign: "text-top" }} ></i>
              </a>
            </div> */}

              <li className="nav-item dropdown nav-notification">
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
              <div className="dropdown text-end user-login ml-4">
                <a
                  href="#"
                  className="d-flex text-decoration-none dropdown-toggle"
                  id="dropdownUser"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://html.bdevs.net/manez.prev/assets/images/avatar/avatar.png"
                    alt="profile"
                    width="40"
                    height="40"
                    className="rounded-circle me-2"
                  />
                  <div className="text-start">
                    <span className="user-name">{user.name}</span>
                    <span className="text-success small">● online</span>
                  </div>
                  <i class="fa-solid fa-angle-down"></i>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow"
                  aria-labelledby="dropdownUser"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person me-2"></i> Profile
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="log-out" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </a>
                  </li>
                </ul>
              </div>

              {/* <button >Logout</button> */}
            </ul>

            <button
              className="hamburger-new ml-4"
              id="sidebar_except"
              onClick={toggleSidebar}
            >
              <span></span>
              <span></span>
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

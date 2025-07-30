import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Rules from "./AttendanceComponent/Rules";
import Logs from "./AttendanceComponent/Logs";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("logs");


const [currentPage, setCurrentPage] = useState(1);
const [perPage] = useState(10); // or let user change it
const [totalPages, setTotalPages] = useState(1);


 const getAttendance = async (page = 1, startDate = "", endDate = "") => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/employee/attendance`,
      {
        withCredentials: true,
        params: {
          page,
          perPage,
           startdate: startDate,
        enddate: endDate
        },
      }
    );
    setAttendance(res.data.data);
    setCurrentPage(res.data.current_page);
    setTotalPages(res.data.last_page);
  } catch (err) {
    console.error("Error fetching attendance:", err);
  }
};
useEffect(() => {
  getAttendance();
}, []);

  console.log('my attendance is >>>',attendance)

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="container attendance-page">
        <div className="row profile">
          <div className="col-md-12">
            <div className="card card-primary attendance-card mt-4">
              <div className="card-header">
                <h3 className="card-title">Attendance</h3>
              </div>

              <div className="card-body">
                <ul
                  className="nav nav-pills mb-3 attandence-navbar"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      id="pills-logs-tab"
                      data-toggle="pill"
                      href="#pills-logs"
                      role="tab"
                      aria-controls="pills-logs"
                      aria-selected="true"
                      onClick={() => handleTabClick("logs")}
                    >
                      Logs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      id="pills-rules-tab"
                      data-toggle="pill"
                      href="#pills-rules"
                      role="tab"
                      aria-controls="pills-rules"
                      aria-selected="false"
                      onClick={() => handleTabClick("rules")}
                    >
                      Rules
                    </button>
                  </li>
                </ul>
                <br />

                {/* <div className="tab-content" id="pills-tabContent"> */}
                {/* className is removed */}
                <div id="pills-tabContent">
                  {activeTab === "logs" && <Logs attendance={attendance}
        currentPage={currentPage}
        totalPages={totalPages}
        getAttendance={getAttendance}/>}

                  {/* only visible when activeTab is rule */}
                  {activeTab === "rules" && <Rules />}
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;

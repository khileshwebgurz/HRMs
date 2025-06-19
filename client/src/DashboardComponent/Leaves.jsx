import React, { useEffect } from "react";
import "../assets/css/leaves.css";
import ApplyLeave from "./LeavesComponent/ApplyLeave";
import LeaveLogs from "./LeavesComponent/LeaveLogs";
import { useState } from "react";
import axios from "axios";
const Leaves = () => {
  const [leavedata, setLeaveData] = useState([]);
  const [leavedetailData, setLeavedetailData] = useState([]);
  const [empDataLog, setempDataLog] = useState([]);


  const [totalAppliedLeaves, setTotalAppliedLeaves] = useState([]);
  const [totalCreditLeaves, setTotalCreditLeaves] = useState([]);
  const [dateOfJoining, setDateOfJoining] = useState("");

  useEffect(() => {
    const MyLeaveData = async () => {
      const Logdata = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves`,
        { withCredentials: true }
      );
      const DetailData = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves/details`,
        { withCredentials: true }
      );

      setLeaveData(Logdata.data);
      setLeavedetailData(DetailData.data);
    };
    MyLeaveData();
  }, []);


    //console.log(leavedata, 'leavedata aaa');
   // console.log(leavedetailData, 'leavedetailData aaa');
  // unnecesaary useeffect
  useEffect(() => {
    if (!leavedetailData) return;

    const byMonthLeaves = leavedetailData?.byMonthLeaves || {};
    const doj = new Date(leavedetailData?.user?.date_of_joining);
    const dojMonth = doj.getMonth(); // 0-indexed
    const dojYear = doj.getFullYear();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-indexed
    const currentYear = currentDate.getFullYear();

    const applied = [];
    const credit = [];

    for (let m = 1; m <= 12; m++) {
      const monthKey = m < 10 ? `0${m}` : `${m}`;
      const total = byMonthLeaves[monthKey] || 0;

      let crleave = 0;
      if (m <= currentMonth) {
        if (dojYear === currentYear) {
          crleave = m - 1 >= dojMonth ? 1 : 0;
        } else {
          crleave = 1;
        }
      }

      applied.push(total);
      credit.push(crleave);
    }

    setDateOfJoining(leavedetailData?.user?.date_of_joining || "");
    setTotalAppliedLeaves(applied);
    setTotalCreditLeaves(credit);
  }, [leavedetailData]);

  
useEffect(() => {
  const fetchLeaveLogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves/empLeavelog`,
        { withCredentials: true }
      );
      setempDataLog(response.data.data); // ← This is the array of logs
    } catch (error) {
      console.error("Error fetching leave logs:", error);
    }
  };

  fetchLeaveLogs();
}, []);

//console.log(empDataLog, 'emp leave log');

useEffect(() => {
  const handleDeleteClick = (e) => {
    const target = e.target.closest(".deleteLeave");
    if (target) {
      const leaveId = target.dataset.leaveid;
      if (leaveId && confirm("Are you sure you want to delete this leave?")) {
        console.log("Deleting leave ID:", leaveId);

        // 🔁 Call delete API here
        // await axios.post(`/employee/leaves/delete/${leaveId}`)
      }
    }
  };

  document.addEventListener("click", handleDeleteClick);
  return () => document.removeEventListener("click", handleDeleteClick);
}, []);


  const totalApplied = totalAppliedLeaves.reduce((a, b) => a + b, 0);
  const totalCredit = totalCreditLeaves.reduce((a, b) => a + b, 0);
  const penalty = totalApplied > totalCredit ? totalApplied - totalCredit : 0;

  const [activeTab, setActiveTab] = useState("applyleave");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };



  return (
    <>
      <div className="container leave-page">
        <div className="row profile">
          <div className="col-md-12">
            <div className="card card-primary mt-4">
              <div className="card-header">
                <h3 className="card-title">Leaves</h3>
              </div>
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12 mb-4 mb-xl-0">
                      <section>
                        <ul className="nav nav-tabs " id="myTab" role="tablist">
                          <li className="nav-item waves-effect waves-light">
                            <button
                              onClick={() => handleTabClick("applyleave")}
                            >
                              Apply Leave
                            </button>
                          </li>
                          <li className="nav-item waves-effect waves-light">
                            <button onClick={() => handleTabClick("leave")}>
                              Log
                            </button>
                          </li>
                        </ul>

                        {activeTab === "applyleave" && (
                          <ApplyLeave
                            totalCreditLeaves={totalCreditLeaves}
                            totalAppliedLeaves={totalAppliedLeaves}
                            totalCredit={totalCredit}
                            totalApplied={totalApplied}
                            penalty={penalty}
                          />
                        )}
                        {activeTab === "leave" && (
                          <LeaveLogs myLeaves={empDataLog} />
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="sidebar-navmenu" id="js-sidebar-navmenu">
              <div
                className="close-sidebar-navmenu"
                id="js-close-sidebar-navmenu"
              >
                <i className="fas fa-times"></i>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaves;

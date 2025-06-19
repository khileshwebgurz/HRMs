import React, { useEffect, useState } from "react";
import ApplyLeave from "./LeavesComponent/ApplyLeave";
import LeaveLogs from "./LeavesComponent/LeaveLogs";
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

    fetchData();
  }, []);


    //console.log(leavedata, 'leavedata aaa');
   // console.log(leavedetailData, 'leavedetailData aaa');
  // unnecesaary useeffect
  useEffect(() => {
    if (!leavedetailData) return;

    const doj = new Date(leavedetailData?.user?.date_of_joining);
    const dojMonth = doj.getMonth();
    const dojYear = doj.getFullYear();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const applied = [];
    const credit = [];
    const byMonthLeaves = leavedetailData?.byMonthLeaves || {};

    for (let m = 1; m <= 12; m++) {
      const monthKey = m < 10 ? `0${m}` : `${m}`;
      const total = byMonthLeaves[monthKey] || 0;

      let crleave = 0;
      if (m <= currentMonth) {
        crleave = dojYear === currentYear ? (m - 1 >= dojMonth ? 1 : 0) : 1;
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
    <div className="container leave-page mt-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button onClick={() => setActiveTab("applyleave")}>Apply Leave</button>
        </li>
        <li className="nav-item">
          <button onClick={() => setActiveTab("leave")}>Log</button>
        </li>
      </ul>

      {activeTab === "applyleave" && (
        <ApplyLeave
          totalAppliedLeaves={totalAppliedLeaves}
          totalCreditLeaves={totalCreditLeaves}
          totalCredit={totalCredit}
          totalApplied={totalApplied}
          penalty={penalty}
        />
      )}

      {activeTab === "leave" && (
        <LeaveLogs myLeaves={empDataLog} onDelete={handleDelete} />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Delete Leave</h5>
                <button className="close" onClick={() => setShowDeleteModal(false)}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmitDelete}>
                <div className="modal-body">
                  <label>Reason for deletion:</label>
                  <textarea
                    className="form-control"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={loading}>
                    {loading ? "Processing..." : "Delete"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;

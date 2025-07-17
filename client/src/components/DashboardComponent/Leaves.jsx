import React, { useEffect, useState } from "react";
import ApplyLeave from "./LeavesComponent/ApplyLeave";
import LeaveLogs from "./LeavesComponent/LeaveLogs";
import axios from "axios";

const Leaves = () => {
  const [empDataLog, setEmpDataLog] = useState([]);
  const [leavedetailData, setLeavedetailData] = useState([]);
  const [totalAppliedLeaves, setTotalAppliedLeaves] = useState([]);
  const [totalCreditLeaves, setTotalCreditLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState("applyleave");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeaveLogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves/empLeavelog`,
        { withCredentials: true }
      );
      setEmpDataLog(response.data.data);
    } catch (error) {
      console.error("Error fetching leave logs:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employee/leaves/details`, {
        withCredentials: true,
      });
      setLeavedetailData(details.data);
      fetchLeaveLogs();
    };

    fetchData();
  }, []);

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

    setTotalAppliedLeaves(applied);
    setTotalCreditLeaves(credit);
  }, [leavedetailData]);

  const handleDelete = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves/delete-post`,
        {
          leave_id: selectedLeaveId,
          leave_delete_reason: reason,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      setShowDeleteModal(false);
      setReason("");
      setSelectedLeaveId(null);
      fetchLeaveLogs();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalApplied = totalAppliedLeaves.reduce((a, b) => a + b, 0);
  const totalCredit = totalCreditLeaves.reduce((a, b) => a + b, 0);
  const penalty = totalApplied > totalCredit ? totalApplied - totalCredit : 0;

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

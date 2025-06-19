import React from "react";
import { useState, useEffect } from "react";
import "../../assets/css/LeaveLog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
const LeaveLogs = () => {
  const navigate = useNavigate();
  const [leaveData, setleaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const user = useUser();

  useEffect(() => {
    const fetchingLogs = async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/leave-logs`,
          {
            withCredentials: true,
          }
        );
        setleaveData(data.data);
      } catch (error) {
        if (error.response?.status === 403) {
          console.warn("Forbidden access — redirecting to 404");
          navigate("/404");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
    fetchingLogs();
  }, []);

  console.log("my user leave logs >>>", user.user_role);

  const handleDeclineClick = async (leave) => {
    const declineRequest = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/get-decline-request`,

      {
        notes: "Declined by manager",
        get_approval_id: leave.id,
      },
      { withCredentials: true }
    );
    if (declineRequest.data.status === 200) {
      setleaveData((prev) => ({
        ...prev,
        data: prev.data.map((item) =>
          item.id === leave.id
            ? { ...item, status: "3", status_label: "Declined" }
            : item
        ),
      }));
    }
  };

  const handleApproveClick = async (leave) => {
    const ApproveRequest = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/get-approval-request`,

      {
        rows_ids: [leave.id],
      },
      { withCredentials: true }
    );
    if (ApproveRequest.data.status === 200) {
      setleaveData((prev) => ({
        ...prev,
        data: prev.data.map((item) =>
          item.id === leave.id
            ? { ...item, status: "3", status_label: "Approved" }
            : item
        ),
      }));
    }
  };

  const handleViewLeave = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Leave Logs</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              {user?.user_role !== "1" ? (
                <h5>
                  Sorry! You don't have permission to view. Please Contact HR
                </h5>
              ) : (
                <table
                  id="wgz_users_table"
                  className="table table-bordered table-striped wg_allusers"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee Name</th>
                      <th style={{ display: "none" }}>Created at</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Leaves</th>
                      <th>Leave Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th style={{ display: "none" }}>Manager</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveData.data?.map((leave, index) => {
                      const start = leave.start_date;
                      const end = leave.end_date;

                      // Calculate total leaves (simple diff — can be improved)
                      const totalLeaves =
                        Math.floor(
                          (new Date(end.date.split("-").reverse().join("-")) -
                            new Date(
                              start.date.split("-").reverse().join("-")
                            )) /
                            (1000 * 60 * 60 * 24)
                        ) + 1;

                      return (
                        <tr key={leave.id}>
                          <td>{index + 1}</td>
                          <td>{leave.employee_name}</td>
                          <td style={{ display: "none" }}></td>
                          <td>
                            {start.date}
                            <br />
                            <small>{start.half}</small>
                          </td>
                          <td>
                            {end.date}
                            <br />
                            <small>{end.half}</small>
                          </td>
                          <td>{totalLeaves}</td>
                          <td>{leave.leave_type}</td>
                          <td>{leave.reason}</td>
                          <td>{leave.status_label}</td>
                          <td style={{ display: "none" }}></td>
                          <td>
                            {/* Handle actions — you can customize further */}
                            <div
                              className="btn-group btn-group-sm appbtns"
                              id={`reqbtn-${leave.id}`}
                            >
                              {leave.status_label === "Pending" ? (
                                <button
                                  className="btn btn-success approvalModalClick site-icon check-icon"
                                  title="Approve"
                                  onClick={() => handleApproveClick(leave)}
                                >
                                  <figure>
                                    <img
                                      src="/dist/img/2021/icons/check-icon.png"
                                      alt="check-icon"
                                    />
                                    <img
                                      src="/dist/img/2021/icons/check-icon-white.png"
                                      alt="check-icon-white"
                                    />
                                  </figure>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success detailModalClick site-icon eye-icon"
                                  data-notes={leave.reason}
                                  data-type="detail"
                                  title="view detail"
                                  data-id={leave.clock_date}
                                  onClick={() => handleViewLeave(leave)}
                                >
                                  <figure>
                                    <img
                                      src="/dist/img/2021/icons/eye-icon-lg.png"
                                      alt="eye-icon"
                                    />
                                    <img
                                      src="/dist/img/2021/icons/eye-icon-lg-white.png"
                                      alt="eye-icon-white"
                                    />
                                  </figure>
                                </button>
                              )}

                              <button
                                className="btn btn-danger approvalModalClick site-icon ban-icon"
                                data-notes={leave.reason}
                                data-type="decline"
                                title="No"
                                data-id={leave.id}
                                onClick={() => handleDeclineClick(leave)}
                              >
                                <figure>
                                  <img
                                    src="/dist/img/2021/icons/ban-icon.png"
                                    alt="ban-icon"
                                  />
                                  <img
                                    src="/dist/img/2021/icons/ban-icon-white.png"
                                    alt="ban-icon-white"
                                  />
                                </figure>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          //   className="modal fade leave-modal"
          id="approvalModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#f85697", color: "white" }}
              >
                <h5 className="modal-title" id="exampleModalCenterTitle">
                  Get Approval
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form action="" method="post" id="approvalFormManager">
                  <input
                    type="hidden"
                    name="get_approval_id"
                    id="get_approval_id"
                    value=""
                  />

                  <div className="modal-body">
                    <div className="row ">
                      <div className="col-sm-12">
                        <label>Employee Reason:</label>
                        <p className="emreason"></p>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>Write Your Reason:</label>
                          <textarea
                            className="form-control"
                            id="wgz-notes"
                            rows="5"
                            name="notes"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <input
                      className="btn btn-success wgz-apply-approval-manager site-main-btn"
                      type="submit"
                      name="send"
                      value="Send"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="modal fade show"
        id="wgz_bulk_import"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title wgz_title">Leave detail</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body"></div>
          </div>
        </div>
      </div>
    </>
  );
};


export default LeaveLogs;

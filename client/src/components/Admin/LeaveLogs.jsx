import React from "react";
import { useState, useEffect } from "react";
import "../../assets/css/LeaveLog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const LeaveLogs = () => {
  const navigate = useNavigate();
  const [leaveData, setleaveData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    last_page: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const user = useUser();

  const fetchingLogs = async (page = 1, perPage = 10, searchValue = "") => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/leave-logs`,
        {
          params: {
            page,
            per_page: perPage,
            search: searchValue,
          },
          withCredentials: true,
        }
      );

      console.log("my response of paginated data is >>> ", response.data);
      setleaveData(response.data); 
      setPagination(response.data.pagination);
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Forbidden access — redirecting to 404");
        navigate("/404");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchingLogs();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchingLogs(1, 10, search);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  console.log("my all leave data are >>> ", leaveData);

  const handleGoBack = () => {
    navigate("/leaves");
  };

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

  // need to fix this as it not increment the seria number when changing number of records per pagee.
  const handleRecordsPerPage = (e) => {
    const newPerPage = parseInt(e.target.value, 10);
    setPagination((prev) => ({
      ...prev,
      per_page: newPerPage,
      current_page: 1,
    }));
    fetchingLogs(1, newPerPage, search);
  };
  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Leave Logs Empolyees </h1>
              <div>
                Show{" "}
                <select
                  value={pagination.per_page}
                  onChange={handleRecordsPerPage}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>{" "}
                entries
              </div>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    current_page: 1, // reset to first page
                  }));
                }}
                className="form-control my-3"
              />
            </div>
          </div>
        </div>
      </section>
      <button onClick={handleGoBack}>Back My Leaves Log</button>

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
                    {leaveData?.data?.map((leave, index) => {
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
                          <td>
                            {(pagination.current_page - 1) *
                              pagination.per_page +
                              index +
                              1}
                          </td>

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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-secondary"
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    fetchingLogs(
                      pagination.current_page - 1,
                      pagination.per_page,
                      search
                    )
                  }
                >
                  Prev
                </button>

                <span>
                  Page {pagination.current_page} of {pagination.last_page} (
                  {pagination.total} records)
                </span>

                <button
                  className="btn btn-secondary"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    fetchingLogs(
                      pagination.current_page + 1,
                      pagination.per_page,
                      search
                    )
                  }
                >
                  Next
                </button>
              </div>
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

import React from "react";
import { useState } from "react";
import axios from "axios";
const ApplyLeave = ({
  totalCreditLeaves,
  totalAppliedLeaves,
  totalCredit,
  totalApplied,
  penalty,
}) => {
  const [isModalActive, setIsModalActive] = useState(false);

  // state for submitting formdata
  const [formData, setFormData] = useState({
    leave_type: "", 
    start_date: "",
    end_date: "",
    start_half: "",
    end_half: "",
    reason: "",
    start_time:"00:00:00"
  });

  const handleBtnClick = () => {
    setIsModalActive(true);
  };

  const handleCloseBtn = () => {
    setIsModalActive(false);
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    try {
      const leaveSubmit = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/employee/leaves/applyLeave`,
        formData,
        { withCredentials: true }
      );
      console.log("Leave submitted:", leaveSubmit.data);
    } catch (error) {
      console.error("Leave submission failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderRow = (label, data) => (
    <tr>
      <td>{label}</td>
      {data.map((val, idx) => (
        <td key={idx}>{val}</td>
      ))}
    </tr>
  );

  return (
    <>
      <div className="tab-content-1" id="myTabContent">
        <div
          className="tab-pane fade active show"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <br />
          <div className="row">
            <div className="col-sm-6">
              <h5>Apply Leave</h5>
            </div>
            <div className="col-sm-6">
              <button
                type="button"
                className="btn btn-warning btn-sm  site-main-btn leave-btn"
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={handleBtnClick}
              >
                Apply Leave
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Jan</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Apr</th>
                  <th>May</th>
                  <th>June</th>
                  <th>Jul</th>
                  <th>Aug</th>
                  <th>Sep</th>
                  <th>Oct</th>
                  <th>Nov</th>
                  <th>Dec</th>
                </tr>
              </thead>
              <tbody>
                {renderRow("Credit Leaves", totalCreditLeaves)}
                {renderRow("Applied Leaves", totalAppliedLeaves)}
              </tbody>
            </table>
          </div>
          <br />
          <div className="losspay ">
            <h4>Loss Of Pay</h4>
            <p>Credited Leaves: {totalCredit}</p>
            <p>Total Leaves: {totalApplied}</p>
            <p>Applied Leaves: {totalApplied}</p>
            <p>Penalty Deduction: {penalty}</p>
            <p>
              Leave Balance:{" "}
              {totalCredit - totalApplied >= 0 ? totalCredit - totalApplied : 0}
            </p>
          </div>
        </div>

        {isModalActive && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content leave-popup">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#001e36", color: "white" }}
                >
                  <h5 className="modal-title" id="exampleModalCenterTitle">
                    Apply Leave
                  </h5>

                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={handleCloseBtn}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div className="modal-body">
                  <form id="apply_leave" onSubmit={handleLeaveSubmit}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-sm-12">
                          <p
                            id="warning"
                            style={{ color: "red", display: "none" }}
                          >
                            * Warning! Taking leave on restricted holiday leads
                            to double salary deduction.
                          </p>

                          <label>Leave Type</label>
                          <div className="md-form">
                            <select
                              className="mdb-select custom-select selectedValue form-control"
                              name="leave_type"
                              id="selectedValue"
                              value={formData.leave_type}
                              onChange={handleChange}
                            >
                              <option value="">-- Select Leave Type --</option>
                              <option value="1">Casual Leave</option>
                              <option value="2">Sick Leave</option>
                              <option value="3">Earned Leave</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="startDate">Start Date</label>
                          <div
                            className="input-group date"
                            id="startDatePicker"
                          >
                            <input
                              type="date"
                              id="start"
                              className="form-control datetimepicker-input"
                              name="start_date"
                              value={formData.start_date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-sm-6" id="first">
                          <label>Select Half</label>
                          <select
                            className="form-control selectHalfStart"
                            name="start_half"
                            value={formData.start_half}
                            onChange={handleChange}
                          >
                            <option value="">-- Select Half --</option>
                            <option value="1">First Half</option>
                            <option value="2">Second Half</option>
                          </select>
                        </div>

                        {/* <div className="col-sm-6" id="time">
                          <label>
                            Time:<span className="req">*</span>
                          </label>
                          <div className="input-group date" id="timepicker">
                            <input
                              type="time"
                              name="start_time"
                              className="form-control"
                            />
                          </div>
                        </div> */}
                      </div>

                      <div className="row" id="end">
                        <div className="col-sm-6">
                          <label htmlFor="endDate">End Date</label>
                          <div className="input-group date" id="endDatePicker">
                            <input
                              type="date"
                              className="form-control datetimepicker-input"
                              name="end_date"
                              value={formData.end_date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <label>Select Half</label>
                          <select
                            className="form-control selectHalfEnd"
                            name="end_half"
                            value={formData.end_half}
                            onChange={handleChange}
                          >
                            <option value="">-- Select Half --</option>
                            <option value="1">First Half</option>
                            <option value="2">Second Half</option>
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <p>Write your Reason</p>
                          <textarea
                            className="form-control"
                            id="reason"
                            rows="4"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseBtn}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-success wgz-apply site-main-btn"
                        type="submit"
                        name="Apply"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplyLeave;

import React from "react";
import { useState } from "react";
const ApplyLeave = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const handleBtnClick = () => {
    setIsModalActive(true);
  };

  const handleCloseBtn = ()=>{
    setIsModalActive(false);
  }
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
                <tr>
                  <td>Credit Leaves</td>
                </tr>
                <tr>
                  <td>Applied Leaves</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <div className="losspay ">
            <h4>Loss Of Pay</h4>
            <p>Credited Leaves : </p>
            <p>Total Leaves : </p>
            <p>Applied Leaves: </p>
            <p>Penalty Deduction:</p>
            <p>Leave Balance:</p>
          </div>
        </div>


      

        {isModalActive && (
          <div
            // className="modal fade"
            // id="exampleModalCenter"
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
                  <h5 className="modal-title " id="exampleModalCenterTitle">
                    Apply Leave
                  </h5>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseBtn}
                   
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form id="apply_leave">
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-sm-12 ">
                          <p
                            id="warning"
                            style={{ color: "red", display: "none" }}
                          >
                            * Warning! Taking leave on restricted holiday leads
                            to double salay deduction.
                          </p>
                          <label>Leave Type</label>
                          <div className="md-form">
                            <select
                              className="mdb-select custom-select selectedValue form-control"
                              name="leave_type"
                              id="selectedValue"
                            >
                              {/* <option
                                value="{{$rule->id}}"
                                data-id="{{$rule->show_time}}"
                              ></option> */}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label htmlFor="startDate">Start Date</label>
                          <fieldset className="form-group">
                            <div
                              className="input-group date"
                              id="reservationdate"
                              data-target-input="nearest"
                            >
                              <input
                                type="text"
                                id="start"
                                className="form-control datetimepicker-input"
                                name="start_date"
                                data-target="#reservationdate"
                              />
                              <div
                                className="input-group-append"
                                data-target="#reservationdate"
                                data-toggle="datetimepicker"
                              >
                                <div className="input-group-text">
                                  <i className="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>

                        <div className="col-sm-6 " id="first">
                          <label>Select Half</label>
                          <div className="md-form">
                            <select
                              className="mdb-select custom-select selectedValue form-control selectHalfStart"
                              name="start_half"
                            >
                              {/* <option value="1" selected>
                                First Half
                              </option>
                              <option value="2">Second Half</option> */}
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6" id="time">
                          <label>
                            Time:<span className="req">*</span>
                          </label>
                          <div className="form-group">
                            <div
                              className="input-group date"
                              id="timepicker"
                              data-target-input="nearest"
                            >
                              <input
                                type="text"
                                name="start_time"
                                className="form-control datetimepicker-input"
                                data-target="#timepicker"
                              />
                              <div
                                className="input-group-append"
                                data-target="#timepicker"
                                data-toggle="datetimepicker"
                              >
                                <div className="input-group-text">
                                  <i className="far fa-clock"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row" id="end">
                        <div className="col-sm-6 ">
                          <label htmlFor="endDate">End Date</label>
                          <fieldset className="form-group">
                            <div
                              className="input-group date"
                              id="reservationdate2"
                              data-target-input="nearest"
                            >
                              <input
                                type="text"
                                className="form-control datetimepicker-input"
                                name="end_date"
                                data-target="#reservationdate2"
                              />
                              <div
                                className="input-group-append"
                                data-target="#reservationdate2"
                                data-toggle="datetimepicker"
                              >
                                <div className="input-group-text">
                                  <i className="fa fa-calendar"></i>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-sm-6 ">
                          <label>Select Half</label>
                          <div className="md-form">
                            <select
                              className="mdb-select custom-select selectedValue form-control selectHalfEnd"
                              name="end_half"
                            >
                              {/* <option value="1">First Half</option>
                              <option value="2" selected>
                                Second Half
                              </option> */}
                            </select>
                          </div>
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
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={handleCloseBtn}
                      >
                        Close
                      </button>
                      <input
                        className="btn btn-success wgz-apply site-main-btn"
                        type="submit"
                        name="Apply"
                      />
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

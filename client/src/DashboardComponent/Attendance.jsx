import React from "react";

const Attendance = () => {
  return (
    <>
      <div className="container attendance-page">
        <div className="row profile">
          <div className="col-md-12">
            <div className="card card-primary attendance-card mt-4">
              <div className="card-header">
                <h3 className="card-title">Attendance </h3>
              </div>

              <div className="card-body">
                <ul
                  className="nav nav-pills mb-3 attandence-navbar"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="pills-logs-tab"
                      data-toggle="pill"
                      href="#pills-logs"
                      role="tab"
                      aria-controls="pills-logs"
                      aria-selected="true"
                    >
                      Logs
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="pills-rules-tab"
                      data-toggle="pill"
                      href="#pills-rules"
                      role="tab"
                      aria-controls="pills-rules"
                      aria-selected="false"
                    >
                      Rules
                    </a>
                  </li>
                </ul>
                <br />
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-logs"
                    role="tabpanel"
                    aria-labelledby="pills-logs-tab"
                  >
                    <h3>Attendance Log</h3>
                    <hr />
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item waves-effect waves-light">
                        <a
                          className="nav-link active"
                          id="dailylog-tab"
                          data-toggle="tab"
                          href="#dailylog"
                          role="tab"
                          aria-controls="dailylog"
                          aria-selected="false"
                        >
                          Daily Log
                        </a>
                      </li>
                      <li className="nav-item waves-effect waves-light">
                        <a
                          className="nav-link"
                          id="monthlylog-tab"
                          data-toggle="tab"
                          href="#monthlylog"
                          role="tab"
                          aria-controls="monthlylog"
                          aria-selected="false"
                        >
                          Monthly Log
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade active show"
                        id="dailylog"
                        role="tabpanel"
                        aria-labelledby="dailylog-tab"
                      >
                        <div className="container pr-fixed-subnav-padding">
                          <div className="tab-content attandence-log">
                            <div
                              className=" payroll-settings-tab mt-0"
                              id="daily_logs"
                              role="tabpanel"
                            >
                              <div className="attendance-logs-section inColorBlue outColorBlue">
                                <div className="row">
                                  <div className="logs-table-wrapper w-100">
                                    <div className="logs-table-container bg-white">
                                      <div className="logs-header-secondary">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div
                                              className="user-details"
                                              id="user-details"
                                            >
                                              <div className="all_emp_name"></div>
                                            </div>
                                          </div>
                                          <div className="col-md-5">
                                            <div
                                              className="user-details"
                                              id="user-details"
                                            >
                                              <div className="all_emp_name">
                                                <label>Select Employee</label>{" "}
                                                <select id="emp_id">
                                                  <option value="id"></option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-7">
                                            <div className="logs-header-right">
                                              <div className="date-picker-daily attendance-date">
                                                <label className="sub-heading">
                                                  Date
                                                </label>
                                                <div className="date-input">
                                                  <span
                                                    className="previous-date-txt mr-3 change_date"
                                                    id="previous_date"
                                                    data-type="-"
                                                  >
                                                    <i className="fas fa-chevron-left"></i>
                                                  </span>
                                                  <input
                                                    name="date-selector-daily"
                                                    id="date-selector-daily"
                                                    className="datePicker date-selector-daily dateppp"
                                                    aria-invalid="false"
                                                    type="text"
                                                    value="<?php echo date('Y-m-d');?>"
                                                  />{" "}
                                                  <span
                                                    className="next-date-txt ml-3 change_date"
                                                    data-type="+"
                                                    id="next_date"
                                                  >
                                                    <i className="fas fa-chevron-right"></i>
                                                  </span>{" "}
                                                  <span
                                                    id="monthly_url"
                                                    data_uu_id="4b7e8f44-59d5-4749-8188-5746711efc97"
                                                  ></span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="main_contents">
                                        <div
                                          className="timeline-section"
                                          style={{ display: "none" }}
                                        >
                                          <div
                                            className="timeline-container"
                                            style={{ overflow: "hidden" }}
                                          >
                                            <div className="timeline-chart">
                                              <div className="timeline-bar-cont">
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                              </div>

                                              <div
                                                className="timeline-bar-contFor24"
                                                style={{ display: "none" }}
                                              >
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                                <div className="timeline-bar"></div>
                                              </div>
                                              <div className="timeline-anomalies">
                                                <h6 className="title">
                                                  Anomalies
                                                </h6>
                                                <div className="anomalies-list"></div>
                                              </div>
                                              <div className="timeline-summary">
                                                <h6 className="title">
                                                  Summary
                                                </h6>
                                                <div className="summary-wrap">
                                                  <div className="summary-items">
                                                    <p className="label">
                                                      Work Duration
                                                    </p>
                                                    <p
                                                      className="value"
                                                      id="wgz_work_duration"
                                                    >
                                                      10 Hours 17 Mins
                                                    </p>
                                                  </div>
                                                  <div className="summary-items">
                                                    <p className="label">
                                                      Break Duration
                                                    </p>
                                                    <p
                                                      className="value"
                                                      id="wgz_break_duration"
                                                    >
                                                      0 Hours 31 Mins
                                                    </p>
                                                  </div>
                                                  <div className="summary-items overtime_duration">
                                                    <p className="label">
                                                      Overtime Duration
                                                    </p>
                                                    <p
                                                      className="value"
                                                      id="overtime_duration"
                                                    >
                                                      0 Hours 32 Mins
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="timeline-legend">
                                                <div className="legend-item normal-bar">
                                                  <span className="box"></span>{" "}
                                                  <span className="txt">
                                                    No Anomalies
                                                  </span>
                                                </div>
                                                <div className="legend-item ip-error">
                                                  <span className="box"></span>{" "}
                                                  <span className="txt">
                                                    Clockin-Clockout IP Mismatch
                                                  </span>
                                                </div>
                                                <div className="legend-item auto-logout">
                                                  <span className="box"></span>{" "}
                                                  <span className="txt">
                                                    Auto Logged Out
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="timeline-tracker">
                                              <div className="timeline-marker-wrap">
                                                <div className="timeline-marker">
                                                  8 AM
                                                </div>
                                                <div className="timeline-marker">
                                                  9 AM
                                                </div>
                                                <div className="timeline-marker">
                                                  10 AM
                                                </div>
                                                <div className="timeline-marker">
                                                  11 AM
                                                </div>
                                                <div className="timeline-marker">
                                                  12 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  1 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  2 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  3 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  4 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  5 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  6 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  7 PM
                                                </div>
                                                <div className="timeline-marker">
                                                  8 PM
                                                </div>
                                              </div>
                                              <div className="timeline-marker-wraps">
                                                <div
                                                  className="employee-worked logout-error"
                                                  style={{
                                                    left: "7.63%",
                                                    width: "38.44%",
                                                  }}
                                                >
                                                  <div className="timeline-popup">
                                                    <ul className="overflowScroll">
                                                      <li className="popup-item">
                                                        <div className="popup-item__top">
                                                          <div className="popup-left">
                                                            <h6 className="title">
                                                              Clock In
                                                            </h6>
                                                          </div>
                                                          <div className="popup-right">
                                                            <h6 className="time">
                                                              08:55 am
                                                            </h6>
                                                          </div>
                                                        </div>
                                                      </li>
                                                      <li className="popup-item error">
                                                        <div className="popup-item__top">
                                                          <div className="popup-left">
                                                            <h6 className="title">
                                                              Clock Out
                                                            </h6>
                                                          </div>
                                                          <div className="popup-right">
                                                            <h6 className="time">
                                                              01:31 pm
                                                            </h6>
                                                          </div>
                                                        </div>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                </div>
                                                <div
                                                  className="employee-worked logout-error"
                                                  style={{
                                                    left: "50.48%",
                                                    width: "47.31%",
                                                  }}
                                                >
                                                  <div className="timeline-popup">
                                                    <ul className="overflowScroll">
                                                      <li className="popup-item">
                                                        <div className="popup-item__top">
                                                          <div className="popup-left">
                                                            <h6 className="title">
                                                              Clock In
                                                            </h6>
                                                          </div>
                                                          <div className="popup-right">
                                                            <h6 className="time">
                                                              02:03 pm
                                                            </h6>
                                                          </div>
                                                        </div>
                                                      </li>
                                                      <li className="popup-item error">
                                                        <div className="popup-item__top">
                                                          <div className="popup-left">
                                                            <h6 className="title">
                                                              Clock Out
                                                            </h6>
                                                          </div>
                                                          <div className="popup-right">
                                                            <h6 className="time">
                                                              07:44 pm
                                                            </h6>
                                                          </div>
                                                        </div>
                                                        <p className="login-location">
                                                          Unnamed Road, Sector
                                                          68, Sahibzada Ajit
                                                          Singh Nagar, Punjab
                                                          160062, India
                                                        </p>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="working-time_line">
                                                <div
                                                  className="working-time"
                                                  style={{
                                                    left: "12.47638888888889%",
                                                    width: "81.25%",
                                                    marginTop: "-24px",
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="table-section">
                                          <div className="show-date-wrap"></div>
                                          <div className="table-wrapper">
                                            <div className="fixed-th-table-wrapper"></div>
                                            <table
                                              className="table table-bordered table-responsive"
                                              id="daily_log_table"
                                            >
                                              <thead>
                                                <tr>
                                                  <th>S No.</th>
                                                  <th>Time</th>
                                                  <th>Type</th>
                                                  <th>IP Address</th>
                                                  <th>Location</th>
                                                </tr>
                                              </thead>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="monthlylog"
                        role="tabpanel"
                        aria-labelledby="monthly-tab"
                      >
                        <br />
                        <div className="row input-daterange px-2 monthly-inputs">
                          <div className="col-md-8">
                            <div className="row">
                              <div className="col-sm-4">
                                <select
                                  id="emp_id_monthly"
                                  className="form-control-sm input-text mb-3"
                                >
                                  <option value="{{$manager->id}}"></option>
                                </select>
                              </div>

                              <div className="col-sm-3">
                                <input
                                  type="text"
                                  id="from_date"
                                  className="form-control dateppp mb-3 input-text"
                                  placeholder="From Date"
                                  readOnly
                                />
                              </div>

                              <div className="col-sm-3">
                                <input
                                  type="text"
                                  name="to_date"
                                  id="to_date"
                                  className="form-control mb-3 dateppp input-text"
                                  placeholder="To Date"
                                  readOnly
                                />
                              </div>

                              <div className="col-sm-2">
                                <button
                                  type="button"
                                  name="filter"
                                  id="filter"
                                  className="btn btn-primary mb-3 btn-sm site-main-btn "
                                >
                                  Filter
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="table-responsive">
                          <table
                            className="table table-striped table-condensed"
                            id="monthlyAttendanceTable"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Time In</th>
                              <th>Time Out</th>
                              <th>Work Duration</th>
                              <th>Stay late reason</th>
                              <th>Breaks</th>
                              <th>Break duration</th>
                              <th>Action</th>
                            </thead>
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="pills-penaltylog"
                        role="tabpanel"
                        aria-labelledby="pills-penaltylog-tab"
                      >
                        <h3>Penalty Logs </h3>
                        <hr />

                        <table
                          className="table mt-4 table-responsive"
                          id="penalty"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <th>Anomaly Type</th>
                            <th>Penalty Type</th>
                            <th>Leave Type</th>
                            <th>Deduction</th>
                            <th>Month</th>
                            <th>Applied On</th>
                            <th>Action</th>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                      <div
                        className="tab-pane fade rule-card"
                        id="pills-rules"
                        role="tabpanel"
                        aria-labelledby="pills-rules-tab"
                      >
                        <h4 className="pl-2">Rule List</h4>
                        <hr />
                        <div className="row w-100 m-0">
                          <div className="col-md-3 wrapper shadow bg-white rounded rules attendance-rule py-1">
                            <label style={{ color: "#f95697" }}>
                              General Rule
                            </label>
                            <br /> <strong>Effective Date: </strong>
                            <span>30-08-2020</span>
                          </div>
                          <div className="col-md-8 mb-md-2 shadow bg-white rounded ml-auto">
                            <div className="container my-4">
                              <div className="row">
                                <div className="col-xl-12 mb-4 mb-xl-0">
                                  <section>
                                    <ul
                                      className="nav nav-tabs"
                                      id="myTab"
                                      role="tablist"
                                    >
                                      <li className="nav-item waves-effect waves-light pt-3">
                                        <label className="mb-0">
                                          General Rule
                                        </label>{" "}
                                        <a
                                          className="nav-link active pl-0"
                                          id="general-tab"
                                          data-toggle="tab"
                                          href="#general"
                                          role="tab"
                                          aria-controls="general"
                                          aria-selected="false"
                                        >
                                          Overview
                                        </a>
                                      </li>
                                    </ul>
                                    <div
                                      className="tab-content"
                                      id="myTabContent"
                                    >
                                      <div
                                        className="tab-pane fade active show ml-1"
                                        id="general"
                                        role="tabpanel"
                                        aria-labelledby="general-tab"
                                      >
                                        <br /> <b>Rule Name</b>
                                        <p>General rule</p>
                                        <b>Description</b>
                                        <p>
                                          This is default system provided option
                                          for all users in case of low leave
                                          balance.
                                        </p>
                                        <div className="shifttimings pl-0 mb-3">
                                          <h5>
                                            <b>Shift Timings </b>
                                          </h5>
                                        </div>
                                        <ul className="p-0">
                                          <li>
                                            <span>In Time</span>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="09:30 AM"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <span>Out Time</span>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="07:15 PM"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li className="switch-btn">
                                            Enable Anomaly Deduction
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>Auto Detection: 0</li>
                                        </ul>
                                        <ul className="p-0 ">
                                          <li className="switch-btn">
                                            Enable Anomaly Tracking
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                        </ul>
                                        <div className="anomalysetting mb-3">
                                          <h5>
                                            <b>Anomaly Settings</b>
                                          </h5>
                                        </div>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />
                                              <label>In Time</label>
                                            </div>
                                            <label>In Time Grace Period</label>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="00:15"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />
                                              <label>Out Time</label>
                                            </div>
                                            <label>Out Time Grace Period</label>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="00:15"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />
                                              <label>Work Duration</label>
                                            </div>
                                            <label>Full Day</label>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="08:30"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />
                                              <label>Work Duration</label>
                                            </div>
                                            <label>Half Day</label>
                                            <div className="input-group clockpicker">
                                              <input
                                                type="text"
                                                className="form-control-sm"
                                                value="04:30"
                                                readOnly
                                              />{" "}
                                              <span className="input-group-addon">
                                                {" "}
                                                <span className="fa fa-clock-o"></span>
                                              </span>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />{" "}
                                              <label>
                                                Maximum total break duration
                                              </label>
                                              <div>01:00</div>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <li>
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                checked
                                              />{" "}
                                              <label>
                                                Maximum no. of breaks
                                              </label>
                                              <div>2</div>
                                            </div>
                                          </li>
                                        </ul>
                                        <ul className="p-0">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value=""
                                            />{" "}
                                            <label>Auto Clock-Out</label>
                                          </div>
                                          <li className="switch-btn">
                                            Enable Overtime
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                          <li className="switch-btn">
                                            Enable Attendance with selfie
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                          <li className="switch-btn">
                                            Enable Geo Fencing
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                          <li className="switch-btn">
                                            Enable Penalty rules selfie
                                            <label className="switch">
                                              <input type="checkbox" />
                                              <span className="slider"></span>
                                            </label>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-navmenu" id="js-sidebar-navmenu">
        <div className="close-sidebar-navmenu" id="js-close-sidebar-navmenu">
          <i className="fas fa-times"></i>
        </div>
      </div>


      {/* new div system */}
      <div className="modal fade popup-format" id="approvalModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Get Approval</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form action="" method="post" id="approvalForm">
                    <input type="hidden" name="get_approval_id" id="get_approval_id" value=""/> @csrf
                    <div className="modal-body">
                        <div className="row ">
                            <div className="col-12">
                                <div className="form-group mb-0">
                                    <label>Write Your Reason:</label>
                                    <div>
                                        <textarea className="form-control" id="wgz-notes" rows="5" name="notes"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input className="btn btn-success wgz-apply-approval site-main-btn" type="submit" name="send" value="Send"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<div className="modal fade" id="approvalModalManager" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
            <div className="modal-header" style={{backgroundColor: "#f85697", color: "white"}}>
                <h5 className="modal-title" id="exampleModalCenterTitle">Get Approval</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form action="" method="post" id="approvalFormManager">
                    <input type="hidden" name="get_approval_id_manager" id="get_approval_id_manager" value=""/> @csrf
                    <div className="modal-body">
                        <div className="row ">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Reason:</label>
                                    <p className="wgz_reason"></p>
                                </div>
                                <div className="form-group">
                                    <label>Select Status:</label> <select className="form-control-sm" id="approve_status" name="approve_status">
                                        <option value="1">Accept</option>
                                        <option value="2">Reject</option>
                                    </select>
                                </div>
                                <div className="form-group apleave">
                                    <label>Approved Leave:</label> <select className="form-control-sm" id="approve_leave" name="approve_leave">
                                        <option value="1">Full Day</option>
                                        <option value="2">Half Day</option>
                                        <option value="3">Short Leave</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input className="btn btn-success wgz-apply-approval-manager" type="submit" name="send" value="Update"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div className="modal fade popup-format" id="reason" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">Reason</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form action="" method="post" id="approvalForm">
                    <input type="hidden" name="get_approval_id" id="get_approval_id" value=""/> @csrf
                    <div className="modal-body">
                        <div className="row ">
                            <div className="col-12">
                                <div className="form-group mb-0">
                                    <label>Write Your Reason:</label>
                                    <div>
                                        <textarea className="form-control" id="wgz-notes" rows="5" name="notes"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input className="btn btn-success wgz-apply-approval site-main-btn" type="submit" name="send" value="Send"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div className="modal fade show" id="wgz_bulk_imported" aria-modal="true"
    role="dialog">
    <div className="modal-dialog modal-md">
        <div className="modal-content">
            <div className="modal-header cstm-bg-primary">
                <h4 className="modal-title wgz_title">Reason</h4>
                <button type="button" className="close" data-dismiss="modal"
                    aria-label="Close">
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

export default Attendance;

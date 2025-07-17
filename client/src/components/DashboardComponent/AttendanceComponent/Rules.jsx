import React from "react";

const Rules = () => {
  return (
    <>
      <div
        // className="tab-pane fade rule-card"
        id="pills-rules"
        role="tabpanel"
        aria-labelledby="pills-rules-tab"
      >
        <h4 className="pl-2">Rule List</h4>
        <hr />
        <div className="row w-100 m-0">
          <div className="col-md-3 wrapper shadow bg-white rounded rules attendance-rule py-1">
            <label style={{ color: "#f95697" }}>General Rule</label>
            <br />
            <strong>Effective Date: </strong>
            <span>30-08-2020</span>
          </div>
          <div className="col-md-8 mb-md-2 shadow bg-white rounded ml-auto">
            <div className="container my-4">
              <div className="row">
                <div className="col-xl-12 mb-4 mb-xl-0">
                  <section>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item waves-effect waves-light pt-3">
                        <label className="mb-0">General Rule</label>
                        <a
                          className="nav-link active pl-0"
                          id="general-tab"
                          data-toggle="tab"
                          href="#general"
                          role="tab"
                          aria-controls="general"
                          aria-selected="true"
                        >
                          Overview
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade active show ml-1"
                        id="general"
                        role="tabpanel"
                        aria-labelledby="general-tab"
                      >
                        <br />
                        <b>Rule Name</b>
                        <p>General rule</p>
                        <b>Description</b>
                        <p>
                          This is default system provided option for all users
                          in case of low leave balance.
                        </p>
                        <div className="shifttimings pl-0 mb-3">
                          <h5>
                            <b>Shift Timings</b>
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
                              />
                              <span className="input-group-addon">
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
                              />
                              <span className="input-group-addon">
                                <span className="fa fa-clock-o"></span>
                              </span>
                            </div>
                          </li>
                        </ul>
                        <ul className="p-0">
                          <li className="switch-btn">
                            Enable Anomaly Deduction
                            <label className="switch">
                              <input type="checkbox" readOnly />
                              <span className="slider"></span>
                            </label>
                          </li>
                        </ul>
                        <ul className="p-0">
                          <li>Auto Detection: 0</li>
                        </ul>
                        <ul className="p-0">
                          <li className="switch-btn">
                            Enable Anomaly Tracking
                            <label className="switch">
                              <input type="checkbox" readOnly />
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
                                readOnly
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
                              />
                              <span className="input-group-addon">
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
                                readOnly
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
                              />
                              <span className="input-group-addon">
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
                                readOnly
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
                              />
                              <span className="input-group-addon">
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
                                readOnly
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
                              />
                              <span className="input-group-addon">
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
                                readOnly
                              />
                              <label>Maximum total break duration</label>
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
                                readOnly
                              />
                              <label>Maximum no. of breaks</label>
                              <div>2</div>
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
                                readOnly
                              />
                              <label>Auto Clock-Out</label>
                            </div>
                          </li>
                          <li className="switch-btn">
                            Enable Overtime
                            <label className="switch">
                              <input type="checkbox" readOnly />
                              <span className="slider"></span>
                            </label>
                          </li>
                          <li className="switch-btn">
                            Enable Attendance with selfie
                            <label className="switch">
                              <input type="checkbox" readOnly />
                              <span className="slider"></span>
                            </label>
                          </li>
                          <li className="switch-btn">
                            Enable Geo Fencing
                            <label className="switch">
                              <input type="checkbox" readOnly />
                              <span className="slider"></span>
                            </label>
                          </li>
                          <li className="switch-btn">
                            Enable Penalty rules selfie
                            <label className="switch">
                              <input type="checkbox" readOnly />
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
    </>
  );
};

export default Rules;

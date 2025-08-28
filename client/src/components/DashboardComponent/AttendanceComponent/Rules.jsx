import { useState } from "react";

const Rules = () => {
  const [rules, setRules] = useState({
    anomalyDeduction: true,
    anomalyTracking: true,
    inTimeChecked: true,
    outTimeChecked: true,
    workDurationFullDay: true,
    workDurationHalfDay: true,
    maxBreakDuration: true,
    maxBreakCount: true,
    autoClockOut: false,
    overtime: false,
    selfieAttendance: false,
    geoFencing: false,
    penaltyRulesSelfie: false,
  });

  const toggleRule = (ruleKey) => {
    setRules((prev) => ({
      ...prev,
      [ruleKey]: !prev[ruleKey],
    }));
  };

  return (
    <div id="pills-rules" role="tabpanel" aria-labelledby="pills-rules-tab">
      <h4 className="pl-2">Rule List</h4>
      <div className="row w-100 m-0 rule-side-tabs">
        <div className="col-md-3 wrapper shadow bg-white rounded rules attendance-rule py-1">
          <label style={{ color: "#f95697" }}>General Rule</label>
          <br />
          <strong>Effective Date: </strong>
          <span>30-08-2020</span>
        </div>
        <div className="col-md-8 mb-md-2 shadow bg-white rounded ml-auto">
          <div className="my-4">
            <div className="row">
              <div className="col-xl-12 mb-4 mb-xl-0">
                <section>
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item waves-effect waves-light pt-3">
                      <label className="mb-0">General Rule</label>
                      <a
                        className="nav-link active"
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
                  <div id="myTabContent">
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
                        This is default system provided option for all users in case of low leave balance.
                      </p>

                      <div className="shifttimings pl-0 mb-3 rules-heading">
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
                              <i className="fa-solid fa-clock-rotate-left"></i>
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
                              <i className="fa-solid fa-clock-rotate-left"></i>
                            </span>
                          </div>
                        </li>
                      </ul>
                      <ul className="p-0">
                        <li className="switch-btn">
                          Enable Anomaly Deduction
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rules.anomalyDeduction}
                              onChange={() => toggleRule("anomalyDeduction")}
                            />
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
                            <input
                              type="checkbox"
                              checked={rules.anomalyTracking}
                              onChange={() => toggleRule("anomalyTracking")}
                            />
                            <span className="slider"></span>
                          </label>
                        </li>
                      </ul>

                      <div className="anomalysetting mb-3 rules-heading">
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
                              checked={rules.inTimeChecked}
                              onChange={() => toggleRule("inTimeChecked")}
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
                              <i className="fa-solid fa-clock-rotate-left"></i>
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
                              checked={rules.outTimeChecked}
                              onChange={() => toggleRule("outTimeChecked")}
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
                              <i className="fa-solid fa-clock-rotate-left"></i>
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
                              checked={rules.workDurationFullDay}
                              onChange={() => toggleRule("workDurationFullDay")}
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
                             <i className="fa-solid fa-clock-rotate-left"></i>
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
                              checked={rules.workDurationHalfDay}
                              onChange={() => toggleRule("workDurationHalfDay")}
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
                              <i className="fa-solid fa-clock-rotate-left"></i>
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
                              checked={rules.maxBreakDuration}
                              onChange={() => toggleRule("maxBreakDuration")}
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
                              checked={rules.maxBreakCount}
                              onChange={() => toggleRule("maxBreakCount")}
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
                              checked={rules.autoClockOut}
                              onChange={() => toggleRule("autoClockOut")}
                            />
                            <label>Auto Clock-Out</label>
                          </div>
                        </li>
                        <li className="switch-btn">
                          Enable Overtime
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rules.overtime}
                              onChange={() => toggleRule("overtime")}
                            />
                            <span className="slider"></span>
                          </label>
                        </li>
                        <li className="switch-btn">
                          Enable Attendance with selfie
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rules.selfieAttendance}
                              onChange={() => toggleRule("selfieAttendance")}
                            />
                            <span className="slider"></span>
                          </label>
                        </li>
                        <li className="switch-btn">
                          Enable Geo Fencing
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rules.geoFencing}
                              onChange={() => toggleRule("geoFencing")}
                            />
                            <span className="slider"></span>
                          </label>
                        </li>
                        <li className="switch-btn">
                          Enable Penalty rules selfie
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rules.penaltyRulesSelfie}
                              onChange={() => toggleRule("penaltyRulesSelfie")}
                            />
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
  );
};

export default Rules;

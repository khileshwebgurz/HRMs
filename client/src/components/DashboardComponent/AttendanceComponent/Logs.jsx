import React from "react";
import { useState } from "react";
import DailyLog from "./DailyLog";
import MonthlyLog from "./MonthlyLog";
const Logs = ({ attendance }) => {
  const [nestedTab, setNestedTab] = useState("daily");
  const handleNestedTab = (tab) => {
    setNestedTab(tab);
  };
  return (
    <>
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
            <button
              className="nav-link active"
              id="dailylog-tab"
              data-toggle="tab"
              href="#dailylog"
              role="tab"
              aria-controls="dailylog"
              aria-selected="true"
              onClick={() => handleNestedTab("daily")}
            >
              Daily Log
            </button>
          </li>
          <li className="nav-item waves-effect waves-light">
            <button
              className="nav-link"
              id="monthlylog-tab"
              data-toggle="tab"
              href="#monthlylog"
              role="tab"
              aria-controls="monthlylog"
              aria-selected="false"
              onClick={() => handleNestedTab("monthly")}
            >
              Monthly Log
            </button>
          </li>
        </ul>
        <div id="myTabContent">
          <div
            className="tab-pane fade active show"
            id="dailylog"
            role="tabpanel"
            aria-labelledby="dailylog-tab"
          >
            <div className="container pr-fixed-subnav-padding">
              <div
              // className="tab-content attandence-log"
              >
                <div
                  className="payroll-settings-tab mt-0"
                  id="daily_logs"
                  role="tabpanel"
                >
                  <div className="attendance-logs-section inColorBlue outColorBlue">
                    <div className="row">
                      <div className="logs-table-wrapper w-100">
                        {nestedTab === "daily" && <DailyLog />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {nestedTab === "monthly" && <MonthlyLog data={attendance} />}
        </div>
      </div>
    </>
  );
};

export default Logs;

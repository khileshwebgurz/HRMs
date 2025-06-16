import React from "react";

const DailyLog = () => {
  return (
    <>
      <div className="logs-table-container bg-white">
        <div className="logs-header-secondary">
          <div className="row">
            <div className="col-md-12">
              <div className="user-details" id="user-details">
                <div className="all_emp_name"></div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="logs-header-right">
                <div className="date-picker-daily attendance-date">
                  <label className="sub-heading">Date</label>
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
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                    <span
                      className="next-date-txt ml-3 change_date"
                      data-type="+"
                      id="next_date"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </span>
                    <span
                      id="monthly_url"
                      data-uu-id="4b7e8f44-59d5-4749-8188-5746711efc97"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main_contents">
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
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyLog;

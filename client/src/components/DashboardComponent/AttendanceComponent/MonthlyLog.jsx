import { useState } from "react";

const MonthlyLog = ({ data, currentPage, totalPages, getAttendance }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilter = () => {
    getAttendance(1, fromDate, toDate);
  };
  return (
    <>
      {/* inside MOnthly logs */}
      <div
        // className="tab-pane fade"
        id="monthlylog"
        role="tabpanel"
        aria-labelledby="monthlylog-tab"
      >
        <br />
        <div className="row input-daterange px-2 monthly-inputs">
          <div className="col-md-8">
            <div className="row">
              {/* <div className="col-sm-4">
                <select
                  id="emp_id_monthly"
                  className="form-control-sm input-text mb-3"
                >
                  <option value="">Select an employee</option>
                </select>
              </div> */}
              <div className="col-sm-3">
                <input
                  type="date"
                  id="from_date"
                  className="form-control dateppp mb-3 input-text"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  type="date"
                  name="to_date"
                  id="to_date"
                  className="form-control mb-3 dateppp input-text"
                  placeholder="To Date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
               <div className="col-sm-2">
                <button
                  type="button"
                  name="filter"
                  id="filter"
                  className="btn btn-primary mb-3 btn-sm site-main-btn"
                  onClick={handleFilter}
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
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Work Duration</th>
                <th>Stay late reason</th>
                <th>Breaks</th>
                <th>Break duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((log, index) => (
                <tr key={index}>
                  <td>{log.clock_date}</td>
                  <td>{log.status}</td>
                  <td dangerouslySetInnerHTML={{ __html: log.clock_in }} />
                  <td>{log.clock_out}</td>
                  <td>{log.work_duration}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: log.after_shift_clockin_reason,
                    }}
                  />
                  <td>{log.breaks}</td>
                  <td>{log.break_duration}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination mt-3">
          <button
            disabled={currentPage === 1}
            onClick={() => getAttendance(currentPage - 1, fromDate, toDate)}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => getAttendance(currentPage + 1, fromDate, toDate)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MonthlyLog;

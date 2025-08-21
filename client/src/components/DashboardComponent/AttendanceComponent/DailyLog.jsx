import { useState, useEffect } from "react";
import axios from "axios";
const DailyLog = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceHtml, setAttendanceHtml] = useState("");

  useEffect(() => {
    const attendancebyDate = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/get-attendance-by-date`,
          { date: selectedDate },
          { withCredentials: true }
        );

        setAttendanceHtml(response.data.data.todayattendancelog);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    attendancebyDate();
  }, [selectedDate]);

  const updateDate = (changeType) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (changeType === "+" ? 1 : -1));

    const newDate = current.toISOString().split("T")[0];
    setSelectedDate(newDate);
    // onDateChange && onDateChange(newDate); // Optional callback
  };

  const handleInputChange = (e) => {
    setSelectedDate(e.target.value);
    // onDateChange && onDateChange(e.target.value);
  };

  const clearFilter = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  console.log("jhbjs", attendanceHtml);
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

            <div class="col-md-5">
                <div class="user-details" id="user-details">
                    

                </div>
            </div>

            <div className="col-md-7">
              <div className="logs-header-right">
                <div className="date-picker-daily attendance-date">
                  <div className="date-input">
                    <label className="sub-heading">Date</label>
                    <span
                      className="previous-date-txt mr-3 change_date"
                      id="previous_date"
                      onClick={() => updateDate("-")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </span>

                    <input
                      name="date-selector-daily"
                      id="date-selector-daily"
                      className="datePicker date-selector-daily dateppp"
                      type="date"
                      value={selectedDate}
                      onChange={handleInputChange}
                    />

                    <span
                      className="next-date-txt ml-3 change_date"
                      id="next_date"
                      onClick={() => updateDate("+")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </div>
                  <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary ml-3 clear-btn"
                      onClick={clearFilter}
                    >
                      Clear Filter
                    </button>
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
                className="table table-striped table-condensed"
                id="daily_log_table"
                style={{ width: "100%" }}
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
                <tbody
                  dangerouslySetInnerHTML={{ __html: attendanceHtml }}
                ></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyLog;

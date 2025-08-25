import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthYear, setMonthYear] = useState("Aug, 25");

  
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/attendance-whole-report", {
        params: {
          year: 2025,
          month: 8,
          page,
          per_page: perPage,
          search,
        },
        withCredentials: true,
      })
      .then((res) => {
        setAttendance(res.data.data || []);
        setTotalPages(res.data.meta.last_page || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching report:", err);
        setLoading(false);
      });
  }, [page, perPage, search]);

  console.log("the attendance of days", attendance);

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
  <>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        All Employees Monthly Attendance Report
      </h2>

      {/* Month Picker + Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Download CSV
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Download Salary
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              {/* Manual static headers */}
              <th className="px-4 py-2 border">DOJ</th>
              <th className="px-4 py-2 border">Employee ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Position</th>
              

              {/* Date headers from 1 to 31 */}
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i} className="px-4 py-2 border">
                  Day {i + 1}
                </th>
              ))}
              <th className="px-4 py-2 border">Total working days</th>
              <th className="px-4 py-2 border">No Of Days worked</th>
              <th className="px-4 py-2 border">Applied Leaves</th>
              <th className="px-4 py-2 border">Final Leave Quota</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((emp, index) => (
              <tr key={index}>
                {/* Manual static values */}
                <td className="px-4 py-2 border">{emp.date_of_joining}</td>
                <td className="px-4 py-2 border">{emp.id}</td>
                <td className="px-4 py-2 border">{emp.name}</td>
                <td className="px-4 py-2 border">{emp.designation}</td>
               

                {/* Dates 1 → 31 */}
                {Array.from({ length: 31 }, (_, i) => {
                  const dateKey = `date_${i + 1}`; // matches your DB keys like date_1, date_2...
                  return (
                    <td key={i} className="px-4 py-2 border">
                      {emp[dateKey] ?? "-"}
                    </td>
                  );
                })}
                 <td className="px-4 py-2 border">{emp.total_working_days}</td>
                <td className="px-4 py-2 border">{emp.no_of_days_worked}</td>
                <td className="px-4 py-2 border">{emp.applied_leaves}</td>
                <td className="px-4 py-2 border">{emp.final_leave_quota}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
  </>
  );
}

export default AttendanceReport;

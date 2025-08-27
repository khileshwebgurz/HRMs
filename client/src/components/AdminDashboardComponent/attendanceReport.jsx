import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Selected month/year state
  const [selectedMonthYear, setSelectedMonthYear] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // format "YYYY-MM"
  });

  // Extract month & year from selectedMonthYear
  const year = parseInt(selectedMonthYear.split("-")[0]);
  const month = parseInt(selectedMonthYear.split("-")[1]) - 1; // JS months are 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/attendance-whole-report`, {
        params: {
          year,
          month: month + 1, 
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
        console.error("Error fetching report:", err);
        setLoading(false);
      });
  }, [search]);

  // this  dependency array has extra -> year, month, page, perPage, 

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
    <>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        All Employees Monthly Attendance Report
      </h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Month picker */}
        <input
          type="month"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="border p-2"
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
              <th className="px-4 py-2 border">DOJ</th>
              <th className="px-4 py-2 border">Employee ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Position</th>

              {/* Dynamic date headers */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(year, month, i + 1);
                const formattedDate = date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <th key={i} className="px-4 py-2 border">
                    {formattedDate}
                  </th>
                );
              })}

              <th className="px-4 py-2 border">Total working days</th>
              <th className="px-4 py-2 border">No Of Days worked</th>
              <th className="px-4 py-2 border">Applied Leaves</th>
              <th className="px-4 py-2 border">Final Leave Quota</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((emp, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{emp.date_of_joining}</td>
                <td className="px-4 py-2 border">{emp.id}</td>
                <td className="px-4 py-2 border">{emp.name}</td>
                <td className="px-4 py-2 border">{emp.designation}</td>

                {/* Day-wise attendance */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dateKey = `date_${i + 1}`;
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

        {/* Pagination */}
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

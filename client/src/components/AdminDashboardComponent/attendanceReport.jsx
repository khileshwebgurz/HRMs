import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/attendance-whole-report", {
        params: { year: 2025, month: 8 },
        withCredentials: true, 
      })
      .then((res) => {
        console.log(" API Response:", res.data);
        setAttendance(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Attendance Whole Report</h2>
      <pre>{JSON.stringify(attendance, null, 2)}</pre>
    </div>
  );
}

export default AttendanceReport;

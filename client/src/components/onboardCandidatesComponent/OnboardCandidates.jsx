import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OnboardCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freezeStatus, setFreezeStatus] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE}/employee/onboard-candidates`, { withCredentials: true }) // cookie-based auth
      .then((res) => {
        setCandidates(res.data.data);
        setFreezeStatus(res.data.permissions.freeze_status);
      })
      .catch((err) => {
        console.error(err);
        alert('Access denied or session expired');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Onboard Candidates</h2>
      {freezeStatus === '0' ? (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Job Title</th>
              <th>Department</th>
              <th>Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((cand, index) => (
              <tr key={cand.id}>
                <td>{index + 1}</td>
                <td>{cand.name}</td>
                <td>{cand.job_title}</td>
                <td>{cand.department}</td>
                <td>{cand.date_of_joining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You cannot view onboarding data due to your freeze status.</p>
      )}
    </div>
  );
};

export default OnboardCandidates;

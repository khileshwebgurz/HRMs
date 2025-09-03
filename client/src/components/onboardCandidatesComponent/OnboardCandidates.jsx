import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/OnboardCandidates.css";

const OnboardCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freezeStatus, setFreezeStatus] = useState('0');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate(); // ⬅️ initialize navigate

  useEffect(() => {
    axios
      .get(`${API_BASE}/employee/onboard-candidates`, { withCredentials: true })
      .then((res) => {
        console.log('API Response:', res);
        setCandidates(res.data.data);
        setFreezeStatus(res.data.permissions.freeze_status);
      })
      .catch((err) => {
        console.error(err);
        alert('Access denied or session expired');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id) => {
    navigate(`/onboard-candidatesView/${id}`); // ⬅️ redirect to view page
  };

  if (loading) return <div>Loading...</div>;

  return (
   <div className="onboard-candidates-container">
        <h2>Onboard Candidates</h2>
        {freezeStatus === '0' ? (
          <table className="onboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Joining Date</th>
                <th>Action</th>
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
                  <td>
                    <button
                      className="action-btn green"
                      onClick={() => handleEdit(cand.id)}
                    >
                      <i className="fas fa-pencil-alt"></i> Edit
                    </button>
                  </td>
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

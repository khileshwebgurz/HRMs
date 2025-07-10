import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const ActiveEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/all-employees`, {
      withCredentials: true
    })
    .then(res => setEmployees(res.data.data))
    .catch(err => console.error(err));
  }, []);




  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Employees</h3>
        <button
          className="btn btn-dark"
          onClick={() => navigate('/add-employee')}
        >
          + Add Employee
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Manager</th>
            <th>Gender</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>

              {/* Status toggle */}
              <td>
                <label className="form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={emp.status === 'Active'}
                    readOnly
                  />
                </label>
              </td>

              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone || '-'}</td>
              <td>{emp.manager}</td>
              <td>{emp.gender}</td>

              {/* Progress Bar */}
              <td style={{ minWidth: '120px' }}>
                <div className="d-flex align-items-center">
                  <div className="progress flex-grow-1" style={{ height: '8px', marginRight: '6px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${emp.progress}%`,
                        backgroundColor: emp.progress > 0 ? '#0d6efd' : '#dee2e6'
                      }}
                      aria-valuenow={emp.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span className="text-danger small">{emp.progress}%</span>
                </div>
              </td>

              {/* Action Icons */}
              <td className="text-center">
                <button className="btn btn-sm btn-outline-primary me-1" title="Edit">
                  ✏️
                </button>
                <button className="btn btn-sm btn-outline-secondary me-1"
                onClick={() => navigate(`/users/employee/${emp.id}/view/personal`)}
                title="View">
                  👁️
                </button>
                <button className="btn btn-sm btn-outline-danger me-1" title="Delete">
                  🗑️
                </button>
                <button className="btn btn-sm btn-outline-dark" title="Login as">
                  🔐
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveEmployees;

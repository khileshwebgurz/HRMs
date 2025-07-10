import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [canAssign, setCanAssign] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const res = await axios.get(`${api}/add-employee`, {
        withCredentials: true,
      });
      if (res.data.status) {
        setAssignableEmployees(res.data.assignable_employees);
        setCanAssign(res.data.can_assign);
      }
    } catch (err) {
      alert('Error loading form data.');
    } finally {
      setLoading(false);
    }
  };

  const addEmployeePost = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        ...(canAssign && { created_by: createdBy })
      };

      const res = await axios.post(`${api}/add-employee-post`, payload, {
        withCredentials: true,
      });

      if (res.data.status === 200) {
        alert(res.data.message);
        setTimeout(() => {
          // Redirect to set-password screen with token
          navigate(`/set-password/${res.data.token}`);
        }, 1000);
      } else {
        alert(res.data.message || 'Failed to add employee');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding employee.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Employee</h2>

      <div className="card shadow-sm p-4">
        <form onSubmit={addEmployeePost}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                maxLength={25}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            {canAssign && (
              <div className="col-md-6 mb-3">
                <label htmlFor="created_by" className="form-label">Assign To</label>
                <select
                  className="form-control"
                  id="created_by"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                >
                  <option value="">Select Employee</option>
                  {assignableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-12 text-center mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

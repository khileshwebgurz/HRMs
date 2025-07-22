import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [canAssign, setCanAssign] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get(`${api}/add-employee`, {
        withCredentials: true,
      });
      if (res.data.status) {
        setAssignableEmployees(res.data.assignable_employees || []);
        setCanAssign(res.data.can_assign);
      } else {
        setErrorMsg('Unable to load assignable employees.');
      }
    } catch (err) {
      setErrorMsg('Error loading form data.');
    } finally {
      setLoading(false);
    }
  };

  const addEmployeePost = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessData(null);

    const payload = {
      name,
      email,
      ...(canAssign && { created_by: createdBy }),
      ...(candidateId && { on_candidate_id: candidateId }),
    };

    try {
      const res = await axios.post(`${api}/add-employee-post`, payload, {
        withCredentials: true,
      });

      if (res.data.status === 200) {
        setSuccessData(res.data);

        // OPTIONAL auto-redirect directly to accept page in frontend:
        // navigate(`/set-password/accept/${res.data.token}`);

      } else {
        setErrorMsg(res.data.message || 'Failed to add employee.');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error adding employee.');
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard.');
    }).catch(() => {
      alert('Copy failed.');
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Employee</h2>

      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}

      {successData && (
        <div className="alert alert-success">
          {successData.message || 'Employee added successfully.'}
          <div className="mt-2 small">
            <div><strong>Token:</strong> {successData.token}</div>
            <div className="mt-1">
              <strong>Accept:</strong> {successData.accept_url}{' '}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => copyToClipboard(successData.accept_url)}
              >
                Copy
              </button>
            </div>
            <div className="mt-1">
              <strong>Decline:</strong> {successData.decline_url}{' '}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => copyToClipboard(successData.decline_url)}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm p-4">
        <form onSubmit={addEmployeePost}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">
                Name <span className="text-danger">*</span>
              </label>
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
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
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

            {/* Optional Candidate ID box (remove if you don't need) */}
            <div className="col-md-6 mb-3">
              <label htmlFor="candidate_id" className="form-label">
                Candidate (optional)
              </label>
              <input
                type="number"
                className="form-control"
                id="candidate_id"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Candidate ID"
              />
            </div>

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

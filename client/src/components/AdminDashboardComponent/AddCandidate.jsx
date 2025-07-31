import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddCandidate = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    total_experience: '',
    notice_period: '',
    current_location: '',
    position: '',
    date: '',
    gender: '1',
    upload_cv: null,
    created_by: '',
    linked_in: '',
    remarks: '',
  });

  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [rolePermission, setRolePermission] = useState(true); // true = allowed
  const [loading, setLoading] = useState(true);
  const [submitType, setSubmitType] = useState('save'); // NEW: track button type

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/tracker/add-candidate`, {
        withCredentials: true,
      })
      .then((res) => {
        setAssignableEmployees(res.data.assignable_employees || []);
        setRolePermission(res.data.can_add); // You must send `can_add` in API.
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    formData.append('submit', submitType); // Append clicked button type

    axios
      .post(`${API_BASE_URL}/tracker/add-candidate-post`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        alert('Candidate added!');
        setForm({
          full_name: '',
          email: '',
          mobile_number: '',
          total_experience: '',
          notice_period: '',
          current_location: '',
          position: '',
          date: '',
          gender: '1',
          upload_cv: null,
          created_by: '',
          linked_in: '',
          remarks: '',
        });
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          alert('Something went wrong!');
        }
      });
  };

  if (loading) return <p>Loading...</p>;

  if (!rolePermission) {
    return (
      <div className="alert alert-danger">
        Sorry! You don't have permission to add. Please contact HR.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Name *</label>
          <input
            name="full_name"
            className="form-control"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Name"
          />
          {errors.full_name && <p className="text-danger">{errors.full_name[0]}</p>}
        </div>

        <div className="col-md-6 mb-3">
          <label>Email *</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          {errors.email && <p className="text-danger">{errors.email[0]}</p>}
        </div>

        <div className="col-md-6 mb-3">
          <label>Mobile Number *</label>
          <input
            name="mobile_number"
            className="form-control"
            value={form.mobile_number}
            onChange={handleChange}
            placeholder="Mobile Number"
          />
          {errors.mobile_number && <p className="text-danger">{errors.mobile_number[0]}</p>}
        </div>

        <div className="col-md-6 mb-3">
          <label>Total Experience</label>
          <input
            name="total_experience"
            className="form-control"
            value={form.total_experience}
            onChange={handleChange}
            placeholder="Total Experience"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Notice Period (days)</label>
          <input
            name="notice_period"
            className="form-control"
            value={form.notice_period}
            onChange={handleChange}
            placeholder="Notice Period"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Current Location</label>
          <input
            name="current_location"
            className="form-control"
            value={form.current_location}
            onChange={handleChange}
            placeholder="Current Location"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Position Applied For *</label>
          <input
            name="position"
            className="form-control"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Date of Applicant</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Gender</label><br />
          <label>
            <input
              type="radio"
              name="gender"
              value="1"
              checked={form.gender === '1'}
              onChange={handleChange}
            /> Male
          </label>
          <label className="ml-3">
            <input
              type="radio"
              name="gender"
              value="2"
              checked={form.gender === '2'}
              onChange={handleChange}
            /> Female
          </label>
        </div>

        <div className="col-md-6 mb-3">
          <label>Upload CV *</label>
          <input
            type="file"
            name="upload_cv"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Assign To</label>
          <select
            name="created_by"
            className="form-control"
            value={form.created_by}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {assignableEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label>LinkedIn *</label>
          <input
            name="linked_in"
            className="form-control"
            value={form.linked_in}
            onChange={handleChange}
            placeholder="LinkedIn URL"
          />
        </div>

        <div className="col-md-12 mb-3">
          <label>Remarks</label>
          <textarea
            name="remarks"
            className="form-control"
            value={form.remarks}
            onChange={handleChange}
            rows={5}
            placeholder="Remarks"
          />
        </div>

        <div className="col-md-12 text-center mt-3">
          <button
            className="btn btn-primary mr-3"
            type="submit"
            onClick={() => setSubmitType('send_mail')}
          >
            Save & Email
          </button>
          <button
            className="btn btn-secondary"
            type="submit"
            onClick={() => setSubmitType('save')}
          >
            Save Candidate
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCandidate;

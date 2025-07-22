import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetPassword = () => {
  const { type, token } = useParams(); // expect /set-password/:type/:token
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateToken = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${api}/employee/token/validate/${type}/${token}`);
      if (res.data.status === 200 && type === 'accept') {
        setEmployee(res.data.data);
      } else if (res.data.status === 200 && type === 'declined') {
        // decline success message comes directly from API
        setSuccessMsg(res.data.message || 'Invitation declined.');
      } else {
        setError(res.data.message || 'Invalid or expired token.');
      }
    } catch (err) {
      setError('Failed to validate token.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const res = await axios.post(`${api}/employee/token/set-password/${token}`, {
        password,
        password_confirmation: passwordConfirm,
      });
      if (res.data.status === 200) {
        setSuccessMsg(res.data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data.message || 'Failed to set password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error setting password.');
    }
  };

  if (loading) return <div>Loading...</div>;

  // Declined view
  if (type === 'declined') {
    return (
      <div className="container mt-5">
        {successMsg ? (
          <div className="alert alert-info">{successMsg}</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : null}
      </div>
    );
  }

  // Accept view
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Set Your Password</h2>
      <p>Hi {employee?.name}, please set your password to activate your account.</p>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSetPassword} className="mt-3">
        <div className="mb-3">
          <label>Password <span className="text-danger">*</span></label>
          <input
            type="password"
            className="form-control"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div className="mb-3">
          <label>Confirm Password <span className="text-danger">*</span></label>
          <input
            type="password"
            className="form-control"
            required
            minLength={6}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;

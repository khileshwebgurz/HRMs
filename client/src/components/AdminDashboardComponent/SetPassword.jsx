import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${api}/employee/token/validate/accept/${token}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === 200) {
          setEmployee(res.data.data);
        } else {
          setError(res.data.message || 'Invalid token');
        }
      })
      .catch(() => {
        setError('Something went wrong while validating token.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(
        `${api}/employee/token/set-password/${token}`,
        {
          password,
          password_confirmation: passwordConfirmation,
        },
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        alert(res.data.message);
        navigate('/login'); 
      } else {
        setError(res.data.message || 'Failed to set password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!employee) return null;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome, {employee.name}</h2>
      <p className="text-center">Please set your account password below.</p>

      <form className="mx-auto" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="form-group mb-3">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password_confirmation">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="password_confirmation"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary w-100">
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;

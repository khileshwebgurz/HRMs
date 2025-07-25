import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyPolicy = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState(null);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState({
    hr: false,
    leave: false,
    travel: false,
  });

  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${api}/employee/company-policy`, { withCredentials: true });

      console.log(res, 'reesssssssssssssssss');
      if (res.data.redirect === 'dashboard') {
        navigate('/dashboard');
      } else if (res.data.policies) {
        setPolicies(res.data.policies);
      } else {
        setError('Failed to load policies.');
      }
    } catch (err) {
      setError('Error fetching company policies.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgreeChange = (type) => {
    setAgree((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleStartQuiz = () => {
    if (!agree.hr || !agree.leave || !agree.travel) {
      setError('You must agree to all policies to continue.');
      return;
    }
    navigate('/readiness-quiz');
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 800 }}>
      <h2>Company Policies</h2>

      {policies?.hr && (
        <div className="mt-4">
          <h5>HR Policy</h5>
          <div dangerouslySetInnerHTML={{ __html: policies.hr }} />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={agree.hr}
              onChange={() => handleAgreeChange('hr')}
            />
            <label className="form-check-label">I agree with HR Policy</label>
          </div>
        </div>
      )}

      {policies?.leave && (
        <div className="mt-4">
          <h5>Leave Policy</h5>
          <div dangerouslySetInnerHTML={{ __html: policies.leave }} />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={agree.leave}
              onChange={() => handleAgreeChange('leave')}
            />
            <label className="form-check-label">I agree with Leave Policy</label>
          </div>
        </div>
      )}

      {policies?.travel && (
        <div className="mt-4">
          <h5>Travel Policy</h5>
          <div dangerouslySetInnerHTML={{ __html: policies.travel }} />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={agree.travel}
              onChange={() => handleAgreeChange('travel')}
            />
            <label className="form-check-label">I agree with Travel Policy</label>
          </div>
        </div>
      )}

      <button className="btn btn-primary mt-4 w-100" onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
};

export default CompanyPolicy;

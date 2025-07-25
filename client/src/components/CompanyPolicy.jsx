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
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${api}/employee/company-policy`, {
        withCredentials: true,
      });

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
    <div className="company-policy-container">
      <style>
        {`
          .company-policy-container {
            max-width: 800px;
            margin: 3rem auto;
            padding: 2rem;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .company-policy-container h2 {
            font-weight: 600;
            margin-bottom: 1.5rem;
          }
          .company-policy-section {
            margin-top: 2rem;
          }
          .company-policy-section h5 {
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          .policy-content {
            background-color: #f9f9f9;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #eee;
            max-height: 300px;
            overflow-y: auto;
          }
          .policy-checkbox {
            margin-top: 0.75rem;
          }
          .start-quiz-button {
            margin-top: 2rem;
            width: 100%;
          }
        `}
      </style>

      <h2>Company Policies</h2>

      {policies?.hr && (
        <div className="company-policy-section">
          <h5>HR Policy</h5>
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: policies.hr }}
          />
          <div className="form-check policy-checkbox">
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
        <div className="company-policy-section">
          <h5>Leave Policy</h5>
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: policies.leave }}
          />
          <div className="form-check policy-checkbox">
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
        <div className="company-policy-section">
          <h5>Travel Policy</h5>
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: policies.travel }}
          />
          <div className="form-check policy-checkbox">
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

      <button className="btn btn-primary start-quiz-button" onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
};

export default CompanyPolicy;

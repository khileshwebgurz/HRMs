import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReadinessQuiz = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${api}/employee/readiness-quiz`, { withCredentials: true });
      if (res.data.redirect === 'dashboard') {
        navigate('/dashboard');
      } else if (res.data.quiz) {
        setQuiz(res.data.quiz);
      } else {
        setError('Failed to load quiz.');
      }
    } catch (err) {
      setError('Error fetching quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId, optionId) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(
        `${api}/employee/readiness-quiz-save`,
        { quiz: answers, finalsave: 1 },
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        setSuccessMsg(res.data.message);
        setTimeout(() => {
        if (res.data.score >= 90) {
            navigate('/dashboard');
          } else {
            navigate('/company-policy');
          }
        }, 2000);
          setSuccessMsg(res.data.message);
          //setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setError(res.data.message || 'Failed to submit quiz.');
        }
    } catch (err) {
      setError('Error submitting quiz.');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error && !successMsg) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 800 }}>
      <h2>Readiness Quiz</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        {quiz.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <h5>{idx + 1}. {q.question}</h5>
            {q.options.map((opt) => (
              <div className="form-check" key={opt.id}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  className="form-check-input"
                  checked={answers[q.id] === opt.id}
                  onChange={() => handleAnswerChange(q.id, opt.id)}
                />
                <label className="form-check-label">{opt.option_name}</label>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="btn btn-primary w-100">Submit Quiz</button>
      </form>
    </div>
  );
};

export default ReadinessQuiz;

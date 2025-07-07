import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Navigation hook

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [hasPermission, setHasPermission] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/all-questions`,
        { withCredentials: true }
      );

      if (res.data.status) {
        setQuestions(res.data.data);
      } else {
        setHasPermission(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setHasPermission(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/delete-question/${questionId}`,
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        alert(res.data.message || 'Question deleted successfully.');
      } else {
        alert(res.data.message || 'Unable to delete question.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting question.');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!hasPermission) {
    return (
      <div className="container-fluid">
        <div className="card all-user-card">
          <div className="card-body">
            <h5>🚫 You don't have permission to view this page. Please contact HR.</h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <section className="content-header allquestion-page">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>All Questions</h1>
          </div>
          <div className="col-sm-6 text-right custom-btn-grp">
            <button
              className="btn btn-success btn-sm site-main-btn"
              onClick={() => navigate('/add-question')}
            >
              <i className="fas fa-plus"></i> Add Question
            </button>
          </div>
        </div>
      </section>

      <div className="card allquestion-page-card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={q.id}>
                    <td>{index + 1}</td>
                    <td dangerouslySetInnerHTML={{ __html: q.question }} />
                    <td>{q.question_type}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {q.can_edit && (
                          <button
                            className="btn btn-success site-icon pencil-icon"
                            title="Edit"
                            onClick={() => navigate(`/edit-question/${q.id}`)}
                          >
                            <img src="/dist/img/2021/icons/pencil.png" alt="edit" />
                          </button>
                        )}
                        {q.can_delete && (
                          <button
                            className="btn btn-danger site-icon delete-icon"
                            title="Delete"
                            onClick={() => handleDelete(q.id)}
                          >
                            <img src="/dist/img/2021/icons/delete.png" alt="delete" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No questions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;

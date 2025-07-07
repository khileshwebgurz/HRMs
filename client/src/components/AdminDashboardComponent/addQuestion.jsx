import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddQuestion = () => {
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionTypes, setQuestionTypes] = useState({});
  const [options, setOptions] = useState(['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [canAssign, setCanAssign] = useState(false);

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${api}/add-question`, {
        withCredentials: true,
      })
      .then((res) => {
        setQuestionTypes(res.data.question_types);
        setAssignableEmployees(res.data.assignable_employees);
        setCanAssign(res.data.can_assign);
      })
      .catch((err) => {
        console.error('Error fetching data', err);
      });
  }, []);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least two options.');
      return;
    }

    if (answerIndex >= validOptions.length) {
      alert('Please select a valid answer.');
      return;
    }

    try {
      const res = await axios.post(
        `${api}/add-question-post`,
        {
          question,
          question_type: questionType,
          option: validOptions,
          answer_index: answerIndex,
          created_by: canAssign ? selectedEmployee : undefined,
        },
        { withCredentials: true }
      );

      alert(res.data.message);
      window.location.href = '/all-questions';
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container-fluid">
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question</label>
          <textarea
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Question Type</label>
          <select
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            required
          >
            <option value="">--Select--</option>
            {Object.entries(questionTypes).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {canAssign && (
          <div className="form-group">
            <label>Assign To</label>
            <select
              className="form-control"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">--Select--</option>
              {assignableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Options</label>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Option</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
                {options.map((opt, idx) => (
                    <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                        <textarea
                        className="form-control"
                        value={opt}
                        onChange={(e) => handleOptionChange(e.target.value, idx)}
                        />
                    </td>
                    <td>
                        <input
                        type="checkbox"
                        className="wgz_ans"
                        checked={answerIndex === idx}
                        onChange={() => setAnswerIndex(idx)}
                        />
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;

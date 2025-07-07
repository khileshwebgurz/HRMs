import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuestion = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionTypes, setQuestionTypes] = useState({});
  const [options, setOptions] = useState(['', '', '', '']);
  const [answerIndex, setAnswerIndex] = useState(null);

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${api}/edit-question/${question_id}`, {
      withCredentials: true
    }).then(res => {
      const q = res.data.question;
      setQuestion(q.question);
      setQuestionType(q.question_type);
      setQuestionTypes(res.data.question_types);
      const loadedOptions = q.options.map(opt => opt.option_name);
      setOptions([...loadedOptions, '', '', '', ''].slice(0, 4));
      const correctIndex = q.options.findIndex(opt => opt.id === q.answer);
      setAnswerIndex(correctIndex);
    });
  }, [question_id]);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) return alert('At least 2 options required');
    if (answerIndex === null || answerIndex >= filteredOptions.length)
      return alert('Select a valid answer');

    try {
      const res = await axios.post(`${api}/edit-question-post`, {
        question_id,
        question,
        question_type: questionType,
        option: filteredOptions,
        answer_index: answerIndex
      }, { withCredentials: true });

      alert(res.data.message);
      navigate('/all-questions');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="container-fluid">
      <h2>Edit Question</h2>
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
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Options</label>
          <table className="table">
            <thead>
              <tr><th>#</th><th>Option</th><th>Answer</th></tr>
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
                      name="answer"
                      checked={answerIndex === idx}
                      onChange={() => setAnswerIndex(idx)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn btn-success">Update</button>
      </form>
    </div>
  );
};

export default EditQuestion;

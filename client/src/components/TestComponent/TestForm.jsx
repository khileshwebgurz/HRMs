import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/TestComplete.css'; 

const TestForm = ({ test = {}, testId }) => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [pendingTime, setPendingTime] = useState(() => test?.pending_time || '20:00');
    const [currentPage, setCurrentPage] = useState(test?.question_page || 0);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (test?.questions) {
            const initialAnswers = {};
            test.questions.forEach(q => {
                if (q.candidate_answer) {
                    initialAnswers[q.id] = q.candidate_answer;
                }
            });
            setAnswers(initialAnswers);
        }

        if (test?.pending_time && test.pending_time !== '00:00') {
            const [mins, secs] = test.pending_time.split(':').map(Number);
            startTimer(mins * 60 + secs);
        } else {
            startTimer(20 * 60);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [test]);

    const startTimer = (totalSeconds) => {
        if (timerRef.current) clearInterval(timerRef.current);
        let remainingSeconds = totalSeconds;

        timerRef.current = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
                clearInterval(timerRef.current);
                handleTimeout();
                return;
            }

            const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
            const secs = String(remainingSeconds % 60).padStart(2, '0');
            setPendingTime(`${mins}:${secs}`);
        }, 1000);
    };

    const saveProgress = async (isFinal = false) => {
        try {
            setSubmitting(true);
            await axios.post('http://localhost:8000/api/test/save', {
                test_token: testId,
                ans: answers,
                pending_time: pendingTime,
                question_page: currentPage,
                finalsave: isFinal
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                withCredentials: true
            });

            if (isFinal) {
                Swal.fire({
                    icon: 'success',
                    title: 'Test Submitted!',
                    text: 'Your answers have been successfully submitted.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => navigate('/test-completed'));
            }
        } catch (error) {
            console.error('Save error:', error);
            let msg = 'Failed to save progress';
            if (error.response?.status === 404) msg = 'Endpoint not found - please contact support';
            else if (error.response?.data?.message) msg = error.response.data.message;
            Swal.fire('Error', msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTimeout = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Timeout!',
            text: "Your test will be automatically submitted.",
            showConfirmButton: true,
            allowOutsideClick: false
        });

        if (result.isConfirmed) await saveProgress(true);
    };

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveProgress(true);
    };

    if (!test?.questions) return <div className="loading">Loading test questions...</div>;

    const currentQuestion = test.questions[currentPage];
    const [mins, secs] = pendingTime.split(':');

    return (
        <div className="test-container">
            <div className="timer-box">
                <span className="timer-label">Time Remaining:</span>
                <div className="timer-value">{mins}:{secs}</div>
            </div>

            <form onSubmit={handleSubmit} className="test-form">
                <div className="question-box">
                    <h3 className="question-title">Q{currentPage + 1}. {currentQuestion.question.question}</h3>

                    <ul className="options-list">
                        {currentQuestion.options.map(option => (
                            <li key={option.id} className="option-item">
                                <label className={`option-label ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`q_${currentQuestion.id}`}
                                        value={option.id}
                                        checked={answers[currentQuestion.id] === option.id}
                                        onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                                    />
                                    <span>{option.option_name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nav-buttons">
                    {currentPage > 0 && (
                        <button type="button" className="btn" onClick={() => setCurrentPage(p => p - 1)}>
                            Previous
                        </button>
                    )}

                    {currentPage < test.questions.length - 1 ? (
                        <button type="button" className="btn primary" onClick={() => setCurrentPage(p => p + 1)}>
                            Next
                        </button>
                    ) : (
                        <button type="submit" className="btn primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TestForm;

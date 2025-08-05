import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TestForm = ({ test = {}, testId }) => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [pendingTime, setPendingTime] = useState(() => {
        // Initialize with test.pending_time or default 20:00
        return test?.pending_time || '20:00';
    });
    const [currentPage, setCurrentPage] = useState(test?.question_page || 0);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);

    // Initialize answers and timer from test data
    useEffect(() => {
        // Initialize answers
        if (test?.questions) {
            const initialAnswers = {};
            test.questions.forEach(q => {
                if (q.candidate_answer) {
                    initialAnswers[q.id] = q.candidate_answer;
                }
            });
            setAnswers(initialAnswers);
        }

        // Initialize timer with remaining time if available
        if (test?.pending_time && test.pending_time !== '00:00') {
            const [mins, secs] = test.pending_time.split(':').map(Number);
            const totalSeconds = mins * 60 + secs;
            startTimer(totalSeconds);
        } else {
            // Default 20 minutes timer
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
            
            const mins = Math.floor(remainingSeconds / 60);
            const secs = remainingSeconds % 60;
            const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            setPendingTime(formattedTime);
        }, 1000);
    };

   const saveProgress = async (isFinal = false) => {
    try {
        setSubmitting(true);
        const response = await axios.post('http://localhost:8000/api/test/save', {  // This matches your Laravel route
            test_token: testId,
            ans: answers,
            pending_time: pendingTime,
            question_page: currentPage,
            finalsave: isFinal
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true  // Important for session/cookie auth
        });

        if (isFinal) {
            Swal.fire({
                icon: 'success',
                title: 'Test Submitted!',
                text: 'Your answers have been successfully submitted.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/test-completed');
            });
        }
    } catch (error) {
        console.error('Save error:', error);
        let errorMessage = 'Failed to save progress';
        
        if (error.response) {
            if (error.response.status === 404) {
                errorMessage = 'Endpoint not found - please contact support';
            } else if (error.response.data?.message) {
                errorMessage = error.response.data.message;
            }
        }
        
        Swal.fire('Error', errorMessage, 'error');
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

        if (result.isConfirmed) {
            await saveProgress(true);
        }
    };

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await saveProgress(true);
    };

    if (!test?.questions) {
        return <div className="loading">Loading test questions...</div>;
    }

    const currentQuestion = test.questions[currentPage];
    const [mins, secs] = pendingTime.split(':');

    return (
        <div className="test-container">
            <div className="timer-container">
                <span>Time Remaining:</span>
                <div className="timer">
                    <span>{mins}:</span>
                    <span>{secs}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="question-container">
                    <h3>Q{currentPage + 1}. {currentQuestion.question.question}</h3>
                    
                    <ul className="options-list">
                        {currentQuestion.options.map(option => (
                            <li key={option.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`q_${currentQuestion.id}`}
                                        value={option.id}
                                        checked={answers[currentQuestion.id] === option.id}
                                        onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                                    />
                                    {option.option_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="navigation-buttons">
                    {currentPage > 0 && (
                        <button 
                            type="button" 
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </button>
                    )}
                    
                    {currentPage < test.questions.length - 1 ? (
                        <button 
                            type="button" 
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TestForm;
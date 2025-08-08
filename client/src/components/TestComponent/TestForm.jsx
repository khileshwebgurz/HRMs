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
    const [isTestCompleted, setIsTestCompleted] = useState(false);
    const timerRef = useRef(null);
    const totalSecondsRef = useRef(null);
    const isTimerInitialized = useRef(false);
    const lastSavedTime = useRef(null);

    useEffect(() => {
        if (test?.questions) {
            const initialAnswers = {};
            test.questions.forEach(testOption => {
                if (testOption.candidate_answer) {
                    // Use the actual question ID for consistency
                    const questionId = testOption.question?.id || testOption.question_id;
                    initialAnswers[questionId] = testOption.candidate_answer;
                }
            });
            setAnswers(initialAnswers);
        }

        // Initialize timer only once and handle resume correctly
        if (!isTimerInitialized.current) {
            isTimerInitialized.current = true;
            
            if (test?.pending_time && test.pending_time !== '00:00') {
                const [mins, secs] = test.pending_time.split(':').map(Number);
                const remainingSeconds = mins * 60 + secs;
                totalSecondsRef.current = remainingSeconds;
                startTimer(remainingSeconds);
            } else {
                totalSecondsRef.current = 20 * 60; // 20 minutes default
                startTimer(20 * 60);
            }
        }

        // Handle page visibility change to prevent timer reset on window focus/blur
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Save current time when page becomes hidden
                lastSavedTime.current = totalSecondsRef.current;
            } else {
                // Resume with saved time when page becomes visible
                if (lastSavedTime.current !== null && !isTestCompleted) {
                    totalSecondsRef.current = lastSavedTime.current;
                    if (timerRef.current) clearInterval(timerRef.current);
                    startTimer(totalSecondsRef.current);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Auto-save progress every 30 seconds
        const autoSaveInterval = setInterval(() => {
            if (!isTestCompleted && !submitting) {
                saveProgress(false, true); // Silent auto-save
            }
        }, 30000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(autoSaveInterval);
        };
    }, [test]);

    const startTimer = (initialSeconds) => {
        if (timerRef.current) clearInterval(timerRef.current);
        let remainingSeconds = initialSeconds;
        totalSecondsRef.current = remainingSeconds;

        timerRef.current = setInterval(() => {
            remainingSeconds--;
            totalSecondsRef.current = remainingSeconds;
            
            if (remainingSeconds <= 0) {
                clearInterval(timerRef.current);
                if (!isTestCompleted) {
                    handleTimeout();
                }
                return;
            }

            const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
            const secs = String(remainingSeconds % 60).padStart(2, '0');
            setPendingTime(`${mins}:${secs}`);
        }, 1000);
    };

    const saveProgress = async (isFinal = false, silent = false) => {
        if (isTestCompleted && !isFinal) return; // Prevent multiple saves after completion
        
        try {
            if (!silent) setSubmitting(true);
            
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/test/save`, {
                test_token: testId,
                ans: answers,
                pending_time: pendingTime,
                question_page: currentPage,
                finalsave: isFinal,
                auto_save: silent // Send auto_save flag when it's a silent save
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                withCredentials: true
            });

            if (isFinal) {
                setIsTestCompleted(true);
                if (timerRef.current) clearInterval(timerRef.current);
                
                const result = response.data;
                let message = 'Your answers have been successfully submitted.';
                let icon = 'success';
                
                if (result.status === 'completed') {
                    message = result.message || message;
                }

                Swal.fire({
                    icon: icon,
                    title: 'Test Submitted!',
                    text: message,
                    timer: 3000,
                    showConfirmButton: true
                }).then(() => {
                    navigate('/test-completed');
                });
            }
        } catch (error) {
            console.error('Save error:', error);
            if (!silent) {
                let msg = 'Failed to save progress';
                if (error.response?.status === 404) msg = 'Endpoint not found - please contact support';
                else if (error.response?.data?.message) msg = error.response.data.message;
                Swal.fire('Error', msg, 'error');
            }
        } finally {
            if (!silent) setSubmitting(false);
        }
    };

    const handleTimeout = async () => {
        if (isTestCompleted) return;
        
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Time Up!',
            text: "Your test time has expired. The test will be automatically submitted.",
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        if (result.isConfirmed) {
            await saveProgress(true);
        }
    };

    const handleAnswerChange = (questionId, answerId) => {
        if (isTestCompleted) return;
        // Use the actual question ID from the question object, not the test option ID
        const actualQuestionId = test.questions.find(q => q.id === questionId)?.question?.id || questionId;
        setAnswers(prev => ({ ...prev, [actualQuestionId]: answerId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isTestCompleted || submitting) return;

        // Show confirmation dialog
        const result = await Swal.fire({
            icon: 'question',
            title: 'Submit Test?',
            text: 'Are you sure you want to submit your test? You cannot change your answers after submission.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await saveProgress(true);
        }
    };

    const handleNavigation = (direction) => {
        if (isTestCompleted) return;
        
        if (direction === 'next' && currentPage < test.questions.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
        
        // Auto-save progress when navigating
        saveProgress(false, true);
    };

    // Prevent accidental page refresh/close
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isTestCompleted) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your test progress may be lost.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isTestCompleted]);

    if (!test?.questions) return <div className="loading">Loading test questions...</div>;

    const currentQuestion = test.questions[currentPage];
    const [mins, secs] = pendingTime.split(':');
    const isLastQuestion = currentPage === test.questions.length - 1;

    return (
        <div className="test-container">
            <div className="timer-box">
                <span className="timer-label">Time Remaining:</span>
                <div className={`timer-value ${parseInt(mins) < 5 ? 'timer-warning' : ''}`}>
                    {mins}:{secs}
                </div>
            </div>

            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${((currentPage + 1) / test.questions.length) * 100}%` }}
                ></div>
                <span className="progress-text">
                    Question {currentPage + 1} of {test.questions.length}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="test-form">
                <div className="question-box">
                    <h3 className="question-title">
                        Q{currentPage + 1}. {currentQuestion.question.question}
                    </h3>

                    <ul className="options-list">
                        {currentQuestion.options.map(option => (
                            <li key={option.id} className="option-item">
                                <label className={`option-label ${answers[currentQuestion.question.id] === option.id ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`q_${currentQuestion.question.id}`}
                                        value={option.id}
                                        checked={answers[currentQuestion.question.id] === option.id}
                                        onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                                        disabled={isTestCompleted}
                                    />
                                    <span>{option.option_name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nav-buttons">
                    {currentPage > 0 && (
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={() => handleNavigation('prev')}
                            disabled={isTestCompleted}
                        >
                            Previous
                        </button>
                    )}

                    <div className="right-buttons">
                        {!isLastQuestion ? (
                            <button 
                                type="button" 
                                className="btn primary" 
                                onClick={() => handleNavigation('next')}
                                disabled={isTestCompleted}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                className="btn submit-btn" 
                                disabled={submitting || isTestCompleted}
                            >
                                {submitting ? 'Submitting...' : 'Submit Test'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Answer summary */}
                <div className="answer-summary">
                    <p>Answered: {Object.keys(answers).length} / {test.questions.length} questions</p>
                    <div className="question-indicators">
                        {test.questions.map((testOption, index) => {
                            const questionId = testOption.question?.id || testOption.question_id;
                            return (
                                <span 
                                    key={index}
                                    className={`indicator ${index === currentPage ? 'current' : ''} ${answers[questionId] ? 'answered' : 'unanswered'}`}
                                    onClick={() => !isTestCompleted && setCurrentPage(index)}
                                >
                                    {index + 1}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TestForm;
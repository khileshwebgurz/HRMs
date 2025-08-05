import React from 'react';

const TestView = ({ test, percentage }) => {
    return (
        <div className="test-results">
            <div className="result-summary">
                <div className="result-box">
                    <h4>Total Points</h4>
                    <p>{test.result}/{test.questions.length}</p>
                </div>
                <div className="result-box">
                    <h4>Total Percentage</h4>
                    <p>{percentage.toFixed(2)}%</p>
                </div>
            </div>

            <div className="questions-review">
                {test.questions.map((question, index) => (
                    <div key={question.id} className="question-review">
                        <h5>Q{index + 1}. {question.question.question}</h5>
                        <ul className="options-list">
                            {question.options.map(option => {
                                let className = '';
                                if (question.candidate_answer) {
                                    if (option.id === question.candidate_answer && 
                                        question.correct_answer !== question.candidate_answer) {
                                        className = 'wrong';
                                    }
                                    if (option.id === question.correct_answer) {
                                        className = 'correct';
                                    }
                                }
                                return (
                                    <li key={option.id} className={className}>
                                        {option.option_name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestView;
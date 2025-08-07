import React from 'react';
import '../../assets/css/TestComplete.css'; 

const TestComplete = () => {
  return (
    <div className="test-complete-container">
      <div className="test-complete-card">
        <h1>🎉 Test Completed!</h1>
        <p>Thank you for completing the aptitude test.</p>
        <p>Our team will review your submission and get back to you soon.</p>
        <div className="success-icon">✅</div>
      </div>
    </div>
  );
};

export default TestComplete;


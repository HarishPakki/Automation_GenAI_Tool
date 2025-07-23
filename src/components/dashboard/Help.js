import React from 'react';
// import '../Dashboard/Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h1>Help Center</h1>
      <div className="help-content">
        <div className="help-section">
          <h2>Getting Started</h2>
          <p>This is a placeholder for getting started documentation.</p>
          <p>Detailed instructions will be provided here.</p>
        </div>
        
        <div className="help-section">
          <h2>FAQs</h2>
          <div className="faq-item">
            <h3>How to create a test case?</h3>
            <p>Navigate to Test Cases section and click "Add Test Case" button.</p>
          </div>
          <div className="faq-item">
            <h3>How to execute tests?</h3>
            <p>Select test cases and go to Execution section to run them.</p>
          </div>
        </div>
        
        <div className="help-section">
          <h2>Contact Support</h2>
          <p>Email: support@testautomation.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
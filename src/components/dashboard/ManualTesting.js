import React, { useState } from 'react';
import './ManualTesting.css';

const ManualTesting = () => {
  const [testCases, setTestCases] = useState([]);
  const [scenario, setScenario] = useState('');

  const generateTestCases = () => {
    // Simulate AI generation
    const generated = [
      { id: 1, name: 'Verify login with valid credentials', steps: 3 },
      { id: 2, name: 'Verify login with invalid credentials', steps: 4 },
      { id: 3, name: 'Verify password reset functionality', steps: 5 },
    ];
    setTestCases(generated);
  };

  return (
    <div className="manual-testing-container">
      <h1>Manual Testing</h1>
      
      <div className="manual-testing-content">
        <div className="test-generation">
          <h2>Test Case Generation</h2>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe the test scenario..."
            rows="5"
          ></textarea>
          <button 
            onClick={generateTestCases}
            disabled={!scenario.trim()}
            className="generate-btn"
          >
            Generate Test Cases
          </button>
          
          {testCases.length > 0 && (
            <div className="generated-tests">
              <h3>Generated Test Cases</h3>
              <ul>
                {testCases.map(test => (
                  <li key={test.id}>
                    <strong>{test.name}</strong> ({test.steps} steps)
                  </li>
                ))}
              </ul>
              <button className="upload-btn">Upload to Test Cases</button>
            </div>
          )}
        </div>
        
        <div className="test-execution">
          <h2>Test Execution</h2>
          <div className="placeholder-box">
            <p>Please add test cases to execute</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTesting;
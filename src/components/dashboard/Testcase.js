import React from 'react';
import './Testcase.css';

const Testcase = () => {
  const testCases = [
    { id: 'TC001', name: 'Login Test', status: 'Passed', lastRun: '2023-06-15', priority: 'High' },
    { id: 'TC002', name: 'Checkout Test', status: 'Failed', lastRun: '2023-06-14', priority: 'Critical' },
    { id: 'TC003', name: 'Search Test', status: 'Not Run', lastRun: '2023-06-10', priority: 'Medium' },
  ];

  return (
    <div className="testcase-container">
      <h1>Test Case Management</h1>
      <div className="testcase-actions">
        <button className="btn-primary">+ Add Test Case</button>
        <button className="btn-secondary">Import</button>
      </div>
      
      <div className="testcase-table-container">
        <table className="testcase-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Last Run</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map(testCase => (
              <tr key={testCase.id}>
                <td>{testCase.id}</td>
                <td>{testCase.name}</td>
                <td>
                  <span className={`status-badge ${testCase.status.toLowerCase().replace(' ', '-')}`}>
                    {testCase.status}
                  </span>
                </td>
                <td>{testCase.lastRun}</td>
                <td>
                  <span className={`priority-badge ${testCase.priority.toLowerCase()}`}>
                    {testCase.priority}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn run">Run</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testcase;
import React from 'react';
import './Report.css';

const Report = () => {
  return (
    <div className="report-container">
      <h1>Report Analysis</h1>
      <div className="report-content">
        <div className="report-grid">
          <div className="report-card">
            <h3>Test Execution Summary</h3>
            <div className="chart-placeholder"></div>
          </div>
          <div className="report-card">
            <h3>Defect Analysis</h3>
            <div className="chart-placeholder"></div>
          </div>
          <div className="report-card">
            <h3>Test Coverage</h3>
            <div className="chart-placeholder"></div>
          </div>
          <div className="report-card">
            <h3>Execution Trend</h3>
            <div className="chart-placeholder"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
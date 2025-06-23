import React from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Testcase from './Testcase';
import Execution from './Execution';
import Report from './Report';
import Help from './Help';
import '../../styles/layout.css';

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="main-content">
        <h1>🧩 Welcome to TOSCA-Style Automation Layout</h1>
        <p>Select an application from the left panel to expand its controls.</p>
      </div>
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-panel">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/testcase" element={<Testcase />} />
            <Route path="/execution" element={<Execution />} />
            <Route path="/report" element={<Report />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import Header from '../common/Header';
import TopNav from './TopNav';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Testcase from './Testcase';
import Execution from './Execution';
import Report from './Report';
import Help from './Help';
import UIAutomation from './UIAutomation';
import APIAutomation from './APIAutomation';
import ManualTesting from './ManualTesting';
import '../../styles/layout.css';

const Dashboard = () => {
  const location = useLocation();
  const showWelcome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  return (
    <div className="dashboard-layout">
      <Header />
      <TopNav />
      {showWelcome && (
        <div className="main-content">
          <h1>🧩 Welcome to TOSCA-Style Automation Layout</h1>
          <p></p>
        </div>
      )}
      <div className="dashboard-content">
        <main className="main-panel">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/testcase" element={<Testcase />} />
            <Route path="/uiauto" element={<UIAutomation />} />
            <Route path="/apiauto" element={<APIAutomation />} />
            <Route path="/manualtest" element={<ManualTesting />} />
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

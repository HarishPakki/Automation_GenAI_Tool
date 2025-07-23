import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
  const location = useLocation();

  return (
    <div className="top-nav">
      <Link 
        to="/dashboard" 
        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/dashboard/testcase" 
        className={`nav-link ${location.pathname.includes('/testcase') ? 'active' : ''}`}
      >
        Test Cases
      </Link>
      <Link 
        to="/dashboard/uiauto" 
        className={`nav-link ${location.pathname.includes('/uiauto') ? 'active' : ''}`}
      >
        UI Automation
      </Link>
      <Link 
        to="/dashboard/apiauto" 
        className={`nav-link ${location.pathname.includes('/apiauto') ? 'active' : ''}`}
      >
        API Automation
      </Link>
      <Link 
        to="/dashboard/manualtest" 
        className={`nav-link ${location.pathname.includes('/manualtest') ? 'active' : ''}`}
      >
        Manual Testing
      </Link>
      <Link 
        to="/dashboard/execution" 
        className={`nav-link ${location.pathname.includes('/execution') ? 'active' : ''}`}
      >
        Execution
      </Link>
      <Link 
        to="/dashboard/report" 
        className={`nav-link ${location.pathname.includes('/report') ? 'active' : ''}`}
      >
        Report
      </Link>
      <Link 
        to="/dashboard/help" 
        className={`nav-link ${location.pathname.includes('/help') ? 'active' : ''}`}
      >
        Help
      </Link>
    </div>
  );
};

export default TopNav;
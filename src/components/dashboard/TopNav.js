import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TopNav.css';

const TopNav = () => {
  return (
    <div className="top-nav">
  <Link to="/dashboard" className="nav-link">Home</Link>
<Link to="/dashboard/testcase" className="nav-link">UI Automation</Link>
<Link to="/dashboard/uiauto" className="nav-link">API Automation</Link>
<Link to="/dashboard/apiauto" className="nav-link">Manual Testing</Link>
<Link to="/dashboard/report" className="nav-link">Report Analysis</Link>
<Link to="/dashboard/help" className="nav-link">Help</Link>

    </div>
  );
};

export default TopNav;

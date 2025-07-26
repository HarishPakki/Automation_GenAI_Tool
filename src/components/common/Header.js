// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography } from '@mui/material';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <img 
            src="/automation-tool-logo.png" 
            alt="Automation Tool Logo" 
            className="logo"
          />
          <Typography variant="h6" className="app-title">
            AUTOMATION TOOL
          </Typography>
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          <LogoutIcon className="logout-icon" />
          <span>LOGOUT</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
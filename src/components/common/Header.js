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
          <img src="/sandp-1 (1).png" alt="Automation Tool Logo" className="logo" />
        </div>
        
        <Typography variant="h6" className="app-title">
          Automation Tool
        </Typography>

        <button className="logout-button" onClick={handleLogout}>
          <LogoutIcon className="logout-icon" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;

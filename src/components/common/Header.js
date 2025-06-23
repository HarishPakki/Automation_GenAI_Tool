import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="logo">🚀 Automation Tool</div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;

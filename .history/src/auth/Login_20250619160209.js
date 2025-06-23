import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username && password) {
      const success = loginUser(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      setError('Please enter both fields');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animated fadeIn">
        <h2>🚀 Automation Tool Login</h2>
        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;

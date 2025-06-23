import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { getLoggedInUser } from './auth/authService';

function App() {
  const isLoggedIn = getLoggedInUser();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

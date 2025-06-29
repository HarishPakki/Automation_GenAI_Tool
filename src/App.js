import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { getLoggedInUser } from './auth/authService';
import FileExplorerContextWrapper from './components/TreeView/context/FileExplorerContext';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!getLoggedInUser());

  useEffect(() => {
    setLoggedIn(!!getLoggedInUser());
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/dashboard" element={loggedIn ? <FileExplorerContextWrapper><Dashboard /></FileExplorerContextWrapper> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

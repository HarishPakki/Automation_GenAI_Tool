import React from 'react';

const Dashboard = () => {
  const username = sessionStorage.getItem('username');
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome {username} 🎉</h1>
      <p>This is the main Automation Tool dashboard.</p>
    </div>
  );
};

export default Dashboard;

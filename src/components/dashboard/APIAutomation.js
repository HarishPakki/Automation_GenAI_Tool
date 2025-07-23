import React, { useState } from 'react';
import './APIAutomation.css';

const APIAutomation = () => {
  const [collections, setCollections] = useState([
    { id: 'API001', name: 'User API', version: '1.2', endpoints: 8 },
    { id: 'API002', name: 'Product API', version: '2.0', endpoints: 12 },
  ]);

  const handleUpload = (e) => {
    // Simulate upload
    const newCollection = {
      id: `API00${collections.length + 1}`,
      name: `New Collection ${collections.length + 1}`,
      version: '1.0',
      endpoints: Math.floor(Math.random() * 10) + 3
    };
    setCollections([...collections, newCollection]);
  };

  return (
    <div className="api-automation-container">
      <h1>API Automation</h1>
      
      <div className="upload-section">
        <h2>Upload API Collection</h2>
        <div className="upload-box">
          <p>Drag & drop your Insomnia/Postman collection here</p>
          <input type="file" onChange={handleUpload} />
          <button className="upload-btn">Upload Collection</button>
        </div>
      </div>
      
      <div className="collections-section">
        <h2>API Collections</h2>
        <div className="collections-grid">
          {collections.map(collection => (
            <div key={collection.id} className="collection-card">
              <h3>{collection.name}</h3>
              <p>Version: {collection.version}</p>
              <p>Endpoints: {collection.endpoints}</p>
              <div className="collection-actions">
                <button className="action-btn">View</button>
                <button className="action-btn">Run</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APIAutomation;
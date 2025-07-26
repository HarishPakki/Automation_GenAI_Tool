import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import './APIAutomation.css';

const APIAutomation = () => {
  // State management
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [environments, setEnvironments] = useState([
    { id: 'dev', name: 'Development', variables: { baseUrl: 'https://dev.api.com' } },
    { id: 'prod', name: 'Production', variables: { baseUrl: 'https://api.com' } }
  ]);
  const [activeEnvironment, setActiveEnvironment] = useState('dev');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const fileInputRef = useRef(null);

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedCollections = JSON.parse(localStorage.getItem('api-collections')) || [];
    setCollections(savedCollections);
    
    const savedHistory = JSON.parse(localStorage.getItem('api-history')) || [];
    setHistory(savedHistory);
    
    const savedActiveEnv = localStorage.getItem('active-environment') || 'dev';
    setActiveEnvironment(savedActiveEnv);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('api-collections', JSON.stringify(collections));
    localStorage.setItem('api-history', JSON.stringify(history));
    localStorage.setItem('active-environment', activeEnvironment);
  }, [collections, history, activeEnvironment]);

  // Parse variables in strings
  const parseVariables = (input, variables = {}) => {
    if (typeof input !== 'string') return input;
    
    if (!input.includes('{{') || !input.includes('}}')) {
      return input;
    }
    
    try {
      const jsonInput = JSON.parse(input);
      if (typeof jsonInput === 'object') {
        return JSON.parse(parseVariables(JSON.stringify(jsonInput), variables));
      }
    } catch (e) {}
    
    return input.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      return variables[varName.trim()] || match;
    });
  };

  // Add request to history
  const addToHistory = (request, response) => {
    const newHistoryItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status: response.status,
      duration: response.duration
    };
    
    const updatedHistory = [newHistoryItem, ...history.slice(0, 49)];
    setHistory(updatedHistory);
  };

  // Send API request
  const sendRequest = async () => {
    if (!activeRequest?.url) return;
    
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const currentEnv = environments.find(e => e.id === activeEnvironment);
      const parsedUrl = parseVariables(activeRequest.url, currentEnv?.variables);
      
      const config = {
        method: activeRequest.method,
        url: parsedUrl,
        headers: {},
        validateStatus: () => true
      };

      // Add headers
      if (activeRequest.headers) {
        activeRequest.headers.filter(h => h.enabled).forEach(({ key, value }) => {
          config.headers[key] = parseVariables(value, currentEnv?.variables);
        });
      }

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(activeRequest.method)) {
        config.data = parseVariables(activeRequest.body, currentEnv?.variables);
      }

      // Add query params
      if (activeRequest.params) {
        config.params = {};
        activeRequest.params.filter(p => p.enabled).forEach(({ key, value }) => {
          config.params[key] = parseVariables(value, currentEnv?.variables);
        });
      }

      const apiResponse = await axios(config);
      const duration = Date.now() - startTime;
      
      setResponse({
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: apiResponse.headers,
        data: apiResponse.data,
        size: JSON.stringify(apiResponse.data).length,
        duration,
        config: apiResponse.config
      });

      addToHistory(activeRequest, {
        status: apiResponse.status,
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      setResponse({
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Error',
        headers: error.response?.headers || {},
        data: error.response?.data || { message: error.message },
        size: 0,
        error: true,
        duration,
        config: error.config
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new collection
  const createCollection = () => {
    const newCollection = {
      id: Date.now(),
      name: `Collection ${collections.length + 1}`,
      requests: []
    };
    setCollections([...collections, newCollection]);
    setActiveCollection(newCollection);
  };

  // Add new request to collection
  const addRequest = (collectionId) => {
    const newRequest = {
      id: Date.now(),
      name: 'New Request',
      method: 'GET',
      url: '',
      headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
      body: '',
      params: []
    };
    
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          requests: [...collection.requests, newRequest]
        };
      }
      return collection;
    });
    
    setCollections(updatedCollections);
    setActiveRequest(newRequest);
    setActiveCollection(updatedCollections.find(c => c.id === collectionId));
  };

  // Update request field
  const updateRequest = (field, value) => {
    if (!activeRequest) return;
    
    const updatedRequest = {
      ...activeRequest,
      [field]: value
    };
    
    setActiveRequest(updatedRequest);
    
    // Update in collections
    const updatedCollections = collections.map(collection => {
      if (collection.id === activeCollection?.id) {
        return {
          ...collection,
          requests: collection.requests.map(req => 
            req.id === activeRequest.id ? updatedRequest : req
          )
        };
      }
      return collection;
    });
    
    setCollections(updatedCollections);
    setActiveCollection(updatedCollections.find(c => c.id === activeCollection?.id));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        // Basic validation for Insomnia format
        if (!jsonData.resources || !Array.isArray(jsonData.resources)) {
          throw new Error('Invalid file format');
        }
        
        const requests = jsonData.resources
          .filter(r => r._type === 'request')
          .map(req => ({
            id: req._id,
            name: req.name,
            method: req.method,
            url: req.url,
            headers: req.headers || [],
            body: req.body?.text ? JSON.parse(req.body.text) : {},
            params: []
          }));

        const newCollection = {
          id: jsonData.resources.find(r => r._type === 'workspace')?._id || `col_${Date.now()}`,
          name: jsonData.resources.find(r => r._type === 'workspace')?.name || 'Imported Collection',
          requests,
          createdAt: new Date().toISOString()
        };
        
        setCollections([...collections, newCollection]);
        setActiveCollection(newCollection);
        setActiveRequest(newCollection.requests[0]);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error: Invalid file format. Please upload a valid Insomnia collection.');
      }
    };
    reader.readAsText(file);
  };

  // Format response headers for display
  const formatHeaders = (headers) => {
    if (!headers) return null;
    return Object.entries(headers).map(([key, value]) => (
      <div key={key} className="header-row">
        <span className="header-key">{key}:</span>
        <span className="header-value">{Array.isArray(value) ? value.join(', ') : value}</span>
      </div>
    ));
  };

  return (
    <div className="api-automation-container">
      {/* Header */}
      <header className="tool-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => {
              if (isHistoryOpen) setIsHistoryOpen(false);
              else if (response) setResponse(null);
            }}
            disabled={!isHistoryOpen && !response}
          >
            ← Back
          </button>
          <h1>API Automation Tool</h1>
        </div>
        
        <div className="header-right">
          <select
            value={activeEnvironment}
            onChange={(e) => setActiveEnvironment(e.target.value)}
            className="environment-selector"
          >
            {environments.map(env => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>
          
          <button 
            className="history-button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            {isHistoryOpen ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className={`sidebar ${isCollectionsOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Collections</h3>
            <div className="sidebar-actions">
              <button 
                className="icon-button"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
              >
                {isCollectionsOpen ? '◀' : '▶'}
              </button>
              <button 
                className="icon-button"
                onClick={createCollection}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="collections-list">
            {collections.map(collection => (
              <div key={collection.id} className="collection">
                <div 
                  className="collection-header"
                  onClick={() => setActiveCollection(collection)}
                >
                  <span>{collection.name}</span>
                  <button 
                    className="icon-button small"
                    onClick={(e) => {
                      e.stopPropagation();
                      addRequest(collection.id);
                    }}
                  >
                    +
                  </button>
                </div>
                
                <div className="requests-list">
                  {collection.requests.map(request => (
                    <div
                      key={request.id}
                      className={`request-item ${activeRequest?.id === request.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveRequest(request);
                        setActiveCollection(collection);
                        setResponse(null);
                      }}
                    >
                      <span className={`method ${request.method.toLowerCase()}`}>
                        {request.method}
                      </span>
                      <span className="request-name">{request.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="upload-section">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current.click()}
            >
              Import Collection
            </button>
          </div>
        </div>
        
        {/* Request/Response area */}
        <div className="content-area">
          {isHistoryOpen ? (
            <div className="history-panel">
              <h2>Request History</h2>
              <div className="history-items">
                {history.map(item => (
                  <div 
                    key={item.id} 
                    className="history-item"
                    onClick={() => {
                      // Find the request in collections
                      let foundRequest = null;
                      let foundCollection = null;
                      
                      for (const collection of collections) {
                        foundRequest = collection.requests.find(req => 
                          req.method === item.method && req.url === item.url
                        );
                        if (foundRequest) {
                          foundCollection = collection;
                          break;
                        }
                      }
                      
                      if (foundRequest && foundCollection) {
                        setActiveRequest(foundRequest);
                        setActiveCollection(foundCollection);
                        setIsHistoryOpen(false);
                      }
                    }}
                  >
                    <div className="history-method-url">
                      <span className={`method ${item.method.toLowerCase()}`}>
                        {item.method}
                      </span>
                      <span className="history-url">{item.url}</span>
                    </div>
                    <div className="history-status-time">
                      <span className={`status ${item.status >= 200 && item.status < 300 ? 'success' : 'error'}`}>
                        {item.status}
                      </span>
                      <span className="time">{item.duration}ms</span>
                    </div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="empty-history">No history yet</div>
                )}
              </div>
            </div>
          ) : response ? (
            <div className="response-viewer">
              <div className="response-header">
                <h2>Response</h2>
                <div className="response-status">
                  <span className={`status-code ${response.status >= 200 && response.status < 300 ? 'success' : 'error'}`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="response-time">{response.duration}ms</span>
                  <span className="response-size">{response.size} bytes</span>
                </div>
              </div>
              
              <div className="response-tabs">
                <button className="active">Body</button>
                <button onClick={() => setActiveTab('headers')}>Headers</button>
                <button onClick={() => setActiveTab('preview')}>Preview</button>
              </div>
              
              <div className="response-content">
                {activeTab === 'headers' ? (
                  <div className="headers-view">
                    {formatHeaders(response.headers)}
                  </div>
                ) : activeTab === 'preview' ? (
                  <div className="preview-view">
                    {typeof response.data === 'string' ? (
                      response.data
                    ) : (
                      <pre>{JSON.stringify(response.data, null, 2)}</pre>
                    )}
                  </div>
                ) : (
                  <div className="body-view">
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : activeRequest ? (
            <div className="request-builder">
              <div className="request-header">
                <h2>{activeRequest.name}</h2>
                <button
                  className="run-button"
                  onClick={sendRequest}
                  disabled={isLoading || !activeRequest.url}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : 'Send Request'}
                </button>
              </div>
              
              <div className="request-method-url">
                <select
                  value={activeRequest.method}
                  onChange={(e) => updateRequest('method', e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                </select>
                
                <input
                  type="text"
                  value={activeRequest.url}
                  onChange={(e) => updateRequest('url', e.target.value)}
                  placeholder="Enter request URL"
                />
              </div>
              
              <div className="request-tabs">
                <button
                  className={activeTab === 'params' ? 'active' : ''}
                  onClick={() => setActiveTab('params')}
                >
                  Params
                </button>
                <button
                  className={activeTab === 'headers' ? 'active' : ''}
                  onClick={() => setActiveTab('headers')}
                >
                  Headers
                </button>
                <button
                  className={activeTab === 'body' ? 'active' : ''}
                  onClick={() => setActiveTab('body')}
                >
                  Body
                </button>
              </div>
              
              <div className="request-content">
                {activeTab === 'params' && (
                  <div className="params-container">
                    {activeRequest.params?.map((param, index) => (
                      <div key={index} className="param-row">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) => {
                            const updated = [...activeRequest.params];
                            updated[index].enabled = e.target.checked;
                            updateRequest('params', updated);
                          }}
                        />
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => {
                            const updated = [...activeRequest.params];
                            updated[index].key = e.target.value;
                            updateRequest('params', updated);
                          }}
                          placeholder="Key"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => {
                            const updated = [...activeRequest.params];
                            updated[index].value = e.target.value;
                            updateRequest('params', updated);
                          }}
                          placeholder="Value"
                        />
                        <button 
                          className="remove-button"
                          onClick={() => {
                            updateRequest('params', activeRequest.params.filter((_, i) => i !== index));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-button"
                      onClick={() => {
                        updateRequest('params', [...(activeRequest.params || []), 
                          { key: '', value: '', enabled: true }]);
                      }}
                    >
                      + Add Param
                    </button>
                  </div>
                )}
                
                {activeTab === 'headers' && (
                  <div className="headers-container">
                    {activeRequest.headers?.map((header, index) => (
                      <div key={index} className="header-row">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => {
                            const updated = [...activeRequest.headers];
                            updated[index].enabled = e.target.checked;
                            updateRequest('headers', updated);
                          }}
                        />
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => {
                            const updated = [...activeRequest.headers];
                            updated[index].key = e.target.value;
                            updateRequest('headers', updated);
                          }}
                          placeholder="Header"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => {
                            const updated = [...activeRequest.headers];
                            updated[index].value = e.target.value;
                            updateRequest('headers', updated);
                          }}
                          placeholder="Value"
                        />
                        <button 
                          className="remove-button"
                          onClick={() => {
                            updateRequest('headers', activeRequest.headers.filter((_, i) => i !== index));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-button"
                      onClick={() => {
                        updateRequest('headers', [...(activeRequest.headers || []), 
                          { key: '', value: '', enabled: true }]);
                      }}
                    >
                      + Add Header
                    </button>
                  </div>
                )}
                
                {activeTab === 'body' && (
                  <div className="body-container">
                    <textarea
                      value={typeof activeRequest.body === 'string' 
                        ? activeRequest.body 
                        : JSON.stringify(activeRequest.body, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateRequest('body', parsed);
                        } catch {
                          updateRequest('body', e.target.value);
                        }
                      }}
                      placeholder="Enter request body (JSON, XML, etc.)"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <h2>Welcome to API Automation Tool</h2>
                <p>Select a request or create a new collection to get started</p>
                <button 
                  className="primary-button"
                  onClick={createCollection}
                >
                  Create New Collection
                </button>
                <button 
                  className="secondary-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  Import Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIAutomation;
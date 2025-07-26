import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaDownload, FaSync, FaEdit, FaPlay, FaBug } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './Testcase.css';

const Testcase = () => {
  // State management
  const [testCases, setTestCases] = useState([
    { id: 'TC001', name: 'Login with valid credentials', status: 'Passed', lastRun: '2023-06-15', priority: 'High' },
    { id: 'TC002', name: 'Checkout process validation', status: 'Failed', lastRun: '2023-06-14', priority: 'Critical' },
    { id: 'TC003', name: 'Product search functionality', status: 'Not Run', lastRun: '2023-06-10', priority: 'Medium' }
  ]);
  
  const [showGenModal, setShowGenModal] = useState(false);
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [testPlans, setTestPlans] = useState([
    { id: 'TP1', name: 'Regression Suite 2023' },
    { id: 'TP2', name: 'Sanity Check' }
  ]);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Generate test cases from requirements
  const generateTestCases = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate sample test cases based on input
      const newTestCases = activeTab === 'manual' 
        ? generateFromText(manualInput)
        : generateFromDocuments(documents);
      
      setTestCases([...testCases, ...newTestCases]);
      setShowGenModal(false);
      return newTestCases;
    } catch (error) {
      console.error('Error generating test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for test generation
  const generateFromText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, i) => ({
      id: `AUTO-${Date.now()}-${i}`,
      name: line,
      status: 'Not Run',
      lastRun: '',
      priority: i === 0 ? 'High' : 'Medium',
      expectedResult: `Should ${line.toLowerCase()}`
    }));
  };

  const generateFromDocuments = (docs) => {
    return docs.map((doc, i) => ({
      id: `DOC-${Date.now()}-${i}`,
      name: `Test from ${doc.name.split('.')[0]}`,
      status: 'Not Run',
      lastRun: '',
      priority: i === 0 ? 'High' : 'Medium',
      expectedResult: `Validate ${doc.name.split('.')[0]} requirements`
    }));
  };

  // Excel export functionality
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(testCases.map(tc => ({
      ID: tc.id,
      'Test Case': tc.name,
      Status: tc.status,
      'Last Run': tc.lastRun,
      Priority: tc.priority,
      'Expected Result': tc.expectedResult || ''
    })));
    
    XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
    XLSX.writeFile(wb, "TestCases.xlsx");
  };

  // ADO integration functions
  const syncToADO = async () => {
    if (!selectedPlan) {
      alert('Please select a test plan first');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Successfully synced ${testCases.length} test cases to ${testPlans.find(p => p.id === selectedPlan).name}`);
    } catch (error) {
      console.error('Error syncing to ADO:', error);
    } finally {
      setLoading(false);
    }
  };

  // Defect management
  const createDefect = async (testCase) => {
    setSelectedTest(testCase);
    setShowDefectModal(true);
  };

  const submitDefect = async (defectData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Defect created for ${selectedTest.name}`);
      setShowDefectModal(false);
      
      // Update test case status
      setTestCases(testCases.map(tc => 
        tc.id === selectedTest.id ? { ...tc, status: 'Failed' } : tc
      ));
    } catch (error) {
      console.error('Error creating defect:', error);
    } finally {
      setLoading(false);
    }
  };

  // File handling
  const handleFileUpload = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  return (
    <div className="testcase-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>Test Case Management</h1>
        <div className="breadcrumb">
          ADO › Test Plans › {selectedPlan ? testPlans.find(p => p.id === selectedPlan).name : 'Select Plan'}
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="left-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowGenModal(true)}
          >
            <FaFileUpload /> Generate with AI
          </button>
          <button className="btn btn-secondary">
            <FaDownload /> Import
          </button>
          <select
            className="plan-selector"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            <option value="">Select Test Plan</option>
            {testPlans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        </div>
        <div className="right-actions">
          <button 
            className="btn btn-sync" 
            onClick={syncToADO}
            disabled={!selectedPlan || loading}
          >
            <FaSync /> {loading ? 'Syncing...' : 'Sync to ADO'}
          </button>
          <button className="btn btn-export" onClick={exportToExcel}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <table className="testcase-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Test Case</th>
              <th>Status</th>
              <th>Last Run</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map(testCase => (
              <tr key={testCase.id}>
                <td>{testCase.id}</td>
                <td>{testCase.name}</td>
                <td>
                  <span className={`status-badge ${testCase.status.toLowerCase().replace(' ', '-')}`}>
                    {testCase.status}
                  </span>
                </td>
                <td>{testCase.lastRun || '-'}</td>
                <td>
                  <span className={`priority-badge ${testCase.priority.toLowerCase()}`}>
                    {testCase.priority}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-action edit">
                    <FaEdit />
                  </button>
                  <button className="btn-action run">
                    <FaPlay />
                  </button>
                  <button 
                    className="btn-action defect"
                    onClick={() => createDefect(testCase)}
                  >
                    <FaBug />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generation Modal */}
      {showGenModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Generate Test Cases from Requirements</h2>
            
            <div className="tab-container">
              <button 
                className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                From Documents
              </button>
              <button 
                className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
              >
                Manual Input
              </button>
            </div>

            {activeTab === 'documents' ? (
              <div className="document-section">
                <h3>Upload Requirements Documents</h3>
                <input 
                  type="file" 
                  id="document-upload"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xlsx,.txt"
                  style={{ display: 'none' }}
                />
                <label htmlFor="document-upload" className="btn btn-upload">
                  Select Files
                </label>
                
                <div className="document-list">
                  {documents.length > 0 ? (
                    documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <span>{doc.name}</span>
                        <button 
                          onClick={() => setDocuments(docs => docs.filter((_, i) => i !== index))}
                          className="btn-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No documents selected</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="manual-section">
                <h3>Paste Requirements Text</h3>
                <textarea
                  className="manual-textarea"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste your requirements here (one per line)..."
                />
                <div className="example-text">
                  <strong>Example:</strong><br />
                  "User should be able to login with valid credentials"<br />
                  "System should validate credit card information"
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowGenModal(false);
                  setDocuments([]);
                  setManualInput('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={generateTestCases}
                disabled={loading || 
                  (activeTab === 'documents' && documents.length === 0) || 
                  (activeTab === 'manual' && !manualInput.trim())}
              >
                {loading ? 'Generating...' : 'Generate Test Cases'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Defect Modal */}
      {showDefectModal && selectedTest && (
        <div className="modal-overlay">
          <div className="modal defect-modal">
            <h2>Create Defect for: {selectedTest.name}</h2>
            
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                defaultValue={`Defect in ${selectedTest.name}`}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Severity</label>
              <select className="form-input">
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea 
                className="form-textarea"
                defaultValue={`1. Execute test case ${selectedTest.id}\n2. Observe the following behavior:`}
              />
            </div>

            <div className="form-group">
              <label>Expected vs Actual Results</label>
              <div className="results-comparison">
                <div className="expected">
                  <h4>Expected</h4>
                  <p>{selectedTest.expectedResult || 'N/A'}</p>
                </div>
                <div className="actual">
                  <h4>Actual</h4>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Describe actual behavior"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Attachments</label>
              <div className="attachment-upload">
                <button className="btn btn-secondary">
                  <FaFileUpload /> Add Screenshot
                </button>
                <button className="btn btn-secondary">
                  <FaFileUpload /> Add Logs
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDefectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={submitDefect}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Defect in ADO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testcase;
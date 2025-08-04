import React, { useState, useEffect } from 'react';
import './UIAutomation.css';

const UIAutomation = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [appPath, setAppPath] = useState('');
  const [pageObjects, setPageObjects] = useState('');
  const [testScript, setTestScript] = useState('');
  const [executionLog, setExecutionLog] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [selfHealingEnabled, setSelfHealingEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isRecording) {
        const status = await window.electronAPI.getRecordingStatus();
        setIsRecording(status.isRecording);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setExecutionLog(prev => [...prev, {
      id: Date.now(),
      message: `${timestamp}: ${message}`,
      type
    }]);
  };

  const selectApp = async () => {
    try {
      const path = await window.electronAPI.openFileDialog();
      if (path) {
        setAppPath(path);
        addLog(`Selected app: ${path}`);
      }
    } catch (error) {
      addLog(`Error selecting app: ${error.message}`, 'error');
    }
  };

  const startRecording = async () => {
    if (!appPath) {
      addLog('Please select an application first', 'error');
      return;
    }

    setIsRecording(true);
    addLog(`Starting recording session with ${selfHealingEnabled ? 'self-healing' : 'standard'} locators...`);

    try {
      const result = await window.electronAPI.startRecording({
        appPath,
        enableSelfHealing: selfHealingEnabled
      });
      
      setPageObjects(result.pageObjects);
      setTestScript(result.testScript);
      setGeneratedFiles({
        pageObjectFile: result.pageObjectFile,
        testScriptFile: result.testScriptFile
      });
      
      addLog('Recording completed successfully!', 'success');
      addLog(`Generated ${result.pageObjects.split('\n').length} page object methods`, 'info');
    } catch (error) {
      addLog(`Recording failed: ${error.message}`, 'error');
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    const { status } = await window.electronAPI.stopRecording();
    addLog(`Recording ${status}`);
    setIsRecording(false);
  };

  const executeScript = async () => {
    if (!testScript) return;

    setIsExecuting(true);
    addLog('Starting test execution...');

    try {
      const { logs } = await window.electronAPI.executeScript({
        script: testScript,
        filePath: generatedFiles.testScriptFile
      });

      logs.forEach(log => {
        const type = log.includes('ERROR:') ? 'error' : 'info';
        addLog(log, type);
      });
      addLog('Execution completed', 'success');
    } catch (error) {
      addLog(`Execution failed: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadFile = async (filename, content) => {
    try {
      await window.electronAPI.saveFile({ filename, content });
      addLog(`Downloaded ${filename}`, 'success');
    } catch (error) {
      addLog(`Error saving file: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => setExecutionLog([]);

  return (
    <div className="ui-automation-container">
      <h1>Electron App Recorder with Self-Healing</h1>
      
      <div className="control-panel">
        <button onClick={selectApp}>
          {appPath ? 'Change App' : 'Select App'}
        </button>
        
        {appPath && (
          <div className="path-display">
            Selected: <span className="path-text">{appPath.split(/[\\/]/).pop()}</span>
          </div>
        )}

        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={selfHealingEnabled}
            onChange={() => setSelfHealingEnabled(!selfHealingEnabled)}
          />
          <span className="slider round"></span>
          <span>Self-Healing Locators</span>
        </label>

        {!isRecording ? (
          <button 
            onClick={startRecording} 
            disabled={!appPath}
            className="record-btn"
          >
            Start Recording
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="record-btn recording"
          >
            Stop Recording
          </button>
        )}

        <button 
          onClick={executeScript}
          disabled={!testScript || isExecuting}
          className="execute-btn"
        >
          {isExecuting ? 'Executing...' : 'Execute Test'}
        </button>

        <button onClick={clearLogs}>
          Clear Logs
        </button>
      </div>

      <div className="output-section">
        <div className="code-section">
          <h2>Page Objects</h2>
          {pageObjects ? (
            <>
              <button 
                onClick={() => downloadFile('page_objects.py', pageObjects)}
                className="download-btn"
              >
                Download Page Objects
              </button>
              <pre>{pageObjects}</pre>
            </>
          ) : (
            <p>No page objects generated yet. Start recording to generate code.</p>
          )}
        </div>

        <div className="xpath-section">
          <h2>Test Script</h2>
          {testScript ? (
            <>
              <button 
                onClick={() => downloadFile('test_script.py', testScript)}
                className="download-btn"
              >
                Download Test Script
              </button>
              <pre>{testScript}</pre>
            </>
          ) : (
            <p>No test script recorded yet.</p>
          )}
        </div>
      </div>

      <div className="log-section">
        <h2>Execution Log</h2>
        <div className="log-box">
          {executionLog.length > 0 ? (
            executionLog.map(log => (
              <div 
                key={log.id} 
                className={`log-entry ${log.type}`}
              >
                {log.message}
              </div>
            ))
          ) : (
            <p>No logs yet. Actions will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIAutomation;
import React, { useState } from 'react';
import './ExpandableTable.css';

const initialData = [
  {
    app: 'AD',
    children: {
      ObjectControls: {
        Common: 'Select * from AD_Controls where ApplicationName = "AD" and ValueStream = "Common"',
        CG: 'Select * from AD_Controls where ApplicationName = "AD" and ValueStream = "CG"',
        SF: 'Select * from AD_Controls where ApplicationName = "AD" and ValueStream = "SF"',
        PF: 'Select * from AD_Controls where ApplicationName = "AD" and ValueStream = "PF"',
      },
      TestData: {
        CG: ['Table1'],
        SF: ['Table2'],
        PF: ['Table1', 'Table2'],
      },
      ReusableLibraries: {
        Common: '',
        CG: '',
        SF: '',
        PF: '',
      },
      TestCases: {
        CG: ['TestCase1', 'TestCase2'],
        SF: ['TestCase1', 'TestCase2'],
        PF: ['TestCase1', 'TestCase2'],
      },
      Execution: {
        CG: ['Execution Flow 1', 'Execution Flow 2'],
        SF: ['Execution Flow 1'],
        PF: ['Execution Flow 1', 'Execution Flow 2'],
      },
    },
  }
];

function ExpandableTable() {
  const [expandedApp, setExpandedApp] = useState({});

  const toggleApp = (app) => {
    setExpandedApp((prev) => ({ ...prev, [app]: !prev[app] }));
  };

  return (
    <div className="expandable-table">
      {initialData.map((entry, idx) => (
        <div key={idx} className="app-block">
          <div className="app-header" onClick={() => toggleApp(entry.app)}>
            <span>{expandedApp[entry.app] ? '▼' : '▶'} <strong>{entry.app}</strong></span>
          </div>

          {expandedApp[entry.app] && (
            <div className="child-section">
              {Object.entries(entry.children).map(([section, values], i) => (
                <div key={i} className="section-block">
                  <div className="section-title">
                    {section} <button className="add-btn">+</button>
                  </div>

                  {typeof values === 'object' && !Array.isArray(values)
                    ? Object.entries(values).map(([key, val], j) => (
                        <div key={j} className="row-item" onContextMenu={(e) => e.preventDefault()}>
                          <div className="row-key">{key}</div>
                          <div className="row-value">
                            {Array.isArray(val)
                              ? val.map((v, vi) => (
                                  <div className="chip" key={vi}>
                                    {v} <span className="delete">🗑️</span>
                                  </div>
                                ))
                              : val}
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpandableTable;

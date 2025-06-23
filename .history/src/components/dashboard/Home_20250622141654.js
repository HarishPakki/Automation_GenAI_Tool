import React, { useState } from 'react';
import './Home.css';
import staticData from '../../utils/staticData';

const Home = () => {
  const [expanded, setExpanded] = useState({});

  const toggleSection = (app) => {
    setExpanded((prev) => ({ ...prev, [app]: !prev[app] }));
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Applications</h2>
        <ul>
          {Object.keys(staticData).map((app, index) => (
            <li key={index}>
              <div className="app-name" onClick={() => toggleSection(app)}>
                {expanded[app] ? '▼' : '▶'} {app}
              </div>
              {expanded[app] && (
                <ul className="sections">
                  {Object.keys(staticData[app]).map((section, i) => (
                    <li key={i}>
                      <h4>{section}</h4>
                      <table className="data-table">
                        <tbody>
                          {Object.entries(staticData[app][section]).map(
                            ([subtype, val], idx) => (
                              <tr key={idx}>
                                <td className="subtype">{subtype}</td>
                                <td className="value">{val}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h1>🧩 Welcome to TOSCA-Style Automation Layout</h1>
        <p>Select an application from the left panel to expand its controls.</p>
      </div>
    </div>
  );
};

export default Home;

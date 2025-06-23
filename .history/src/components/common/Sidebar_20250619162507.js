import React from 'react';
import { useNavigate } from 'react-router-dom';
import menuOptions from '../../utils/menuOptions';
import '../../styles/sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <ul>
        {menuOptions.map((item, index) => (
          <li key={index} onClick={() => navigate(item.path)}>
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

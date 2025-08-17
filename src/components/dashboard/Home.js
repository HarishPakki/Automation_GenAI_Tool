import React, { useState } from 'react';
import './Home.css';
import TreeView from '../TreeView/TreeView';
import TableData from '../TableData/TableData';

const Home = () => {
  const [selectedTreeItem, setSelectedTreeItem] = useState(null);

  return (
    <div className="home-container">
      <TreeView setSelectedTreeItem={setSelectedTreeItem} />
      <TableData selectedTreeItem={selectedTreeItem} />
    </div>
  );
};

export default Home;
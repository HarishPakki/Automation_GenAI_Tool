import { createContext, useState } from "react";

export const FileExplorerContext = createContext();

export default function FileExplorerContextWrapper({ children }) {
  const initialNodes = {
    1: { id: 1, name: "AD", type: "application", parentId: null, children: [2, 3, 4, 5] },
    2: { id: 2, name: "Object Controls", type: "folder", parentId: 1, children: [6, 7, 8, 9] },
    3: { id: 3, name: "Test Data", type: "folder", parentId: 1, children: [10, 11, 12, 13] },
    4: { id: 4, name: "Reusable Libraries", type: "folder", parentId: 1, children: [14, 15, 16, 17] },
    5: { id: 5, name: "Test Cases", type: "folder", parentId: 1, children: [18, 19, 20, 21] },
    // Object Controls subfolders
    6: { id: 6, name: "Common", type: "folder", parentId: 2, children: [] },
    7: { id: 7, name: "CG", type: "folder", parentId: 2, children: [] },
    8: { id: 8, name: "SF", type: "folder", parentId: 2, children: [] },
    9: { id: 9, name: "PF", type: "folder", parentId: 2, children: [] },
    // Test Data subfolders
    10: { id: 10, name: "Common", type: "folder", parentId: 3, children: [] },
    11: { id: 11, name: "CG", type: "folder", parentId: 3, children: [] },
    12: { id: 12, name: "SF", type: "folder", parentId: 3, children: [] },
    13: { id: 13, name: "PF", type: "folder", parentId: 3, children: [] },
    // Reusable Libraries subfolders
    14: { id: 14, name: "Common", type: "folder", parentId: 4, children: [] },
    15: { id: 15, name: "CG", type: "folder", parentId: 4, children: [] },
    16: { id: 16, name: "SF", type: "folder", parentId: 4, children: [] },
    17: { id: 17, name: "PF", type: "folder", parentId: 4, children: [] },
    // Test Cases subfolders
    18: { id: 18, name: "Common", type: "folder", parentId: 5, children: [] },
    19: { id: 19, name: "CG", type: "folder", parentId: 5, children: [] },
    20: { id: 20, name: "SF", type: "folder", parentId: 5, children: [] },
    21: { id: 21, name: "PF", type: "folder", parentId: 5, children: [] },
  };

  const [nodes, setNodes] = useState(initialNodes);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null
  });

  const addNode = (parentId, value, newType) => {
    const newId = Date.now();
    const newData = { 
      id: newId, 
      name: value, 
      parentId: parentId, 
      type: newType 
    };
    
    if(newType === "folder") {
      newData.children = [];
    }
    
    const updatedNodes = { ...nodes, [newId]: newData };
    updatedNodes[parentId].children.unshift(newId);
    setNodes(updatedNodes);
  };

  const editNode = (id, value) => {
    const updatedNodes = { ...nodes };
    updatedNodes[id].name = value;
    setNodes(updatedNodes);
  };

  const deleteNode = (id) => {
    const updatedNodes = { ...nodes };
    const parentId = updatedNodes[id].parentId;
    
    if (parentId) {
      updatedNodes[parentId].children = updatedNodes[parentId].children.filter(
        (childId) => childId !== id
      );
    }
    
    const queue = [id];
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (nodes[currentId]?.children) queue.push(...nodes[currentId].children);
      delete updatedNodes[currentId];
    }
    
    setNodes(updatedNodes);
  };

  const handleContextMenu = (e, nodeId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      nodeId: nodeId
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <FileExplorerContext.Provider
      value={{ 
        nodes, 
        deleteNode, 
        addNode, 
        editNode,
        contextMenu,
        handleContextMenu,
        closeContextMenu
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
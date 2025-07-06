import { createContext, useState } from "react";

export const FileExplorerContext = createContext();

export default function FileExplorerContextWrapper({ children }) {
  const [nodes, setNodes] = useState({});
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null
  });

  const createApplication = () => {
    const newId = Date.now();
    const newData = { 
      id: newId, 
      name: `Application ${Object.keys(nodes).length + 1}`, 
      type: "application", 
      parentId: null, 
      children: [] 
    };
    
    setNodes(prev => ({ ...prev, [newId]: newData }));
  };

  const addNode = (parentId, value, newType) => {
    const newId = Date.now();
    const newData = { 
      id: newId, 
      name: value, 
      parentId: parentId, 
      type: newType 
    };
    
    if(newType === "folder" || newType === "application") {
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

// ... (keep all existing code)

const deleteNode = (id) => {
  const updatedNodes = { ...nodes };
  const parentId = updatedNodes[id]?.parentId;
  
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

// ... (rest of the file remains the same)

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
        createApplication,
        contextMenu,
        handleContextMenu,
        closeContextMenu
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
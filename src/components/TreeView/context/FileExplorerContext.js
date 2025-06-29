import { createContext, useState } from "react";

import data from "../data/FileExplorerData.js";

export const FileExplorerContext = createContext();

export default function FileExplorerContextWrapper({ children }) {
  const [nodes, setNodes] = useState(data);

  const addNode = (parentId, value, newType) => {
    const newId = Date.now();
    const newData = { id: newId, name: value, parentId: parentId };
    const isFolder = value.split(".");
    // if (isFolder.length > 1) {
    //   //it is a file
    //   newData.type = "file";
    // } else {
    //   //it is a folder
    //   newData.type = "folder";
    //   newData.children = [];
    // }
    newData.type = newType;
    if(newType === "folder"){
      newData.children = [];
    }
    const updatedNodes = { ...nodes, [newId]: newData };
    console.log(updatedNodes);
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
        (childId) => {
          return childId !== id;
        }
      );
    }
    const queue = [id];
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (nodes[currentId].children) queue.push(...nodes[currentId].children);
      delete updatedNodes[currentId];
    }
    setNodes(updatedNodes);
  };

  return (
    <FileExplorerContext.Provider
      value={{ nodes, deleteNode, addNode, editNode }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}

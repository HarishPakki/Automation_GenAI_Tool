import { useState, useContext } from 'react';
import { FileExplorerContext } from './context/FileExplorerContext';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiPlus, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import './TreeView.css';

const TreeNode = ({ node, depth = 0, setSelectedTreeItem }) => {
  const { nodes, addNode, editNode, deleteNode } = useContext(FileExplorerContext);
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first two levels
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      setSelectedTreeItem(node.name);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const saveEdit = () => {
    if (newName.trim()) {
      editNode(node.id, newName.trim());
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setNewName(node.name);
    setIsEditing(false);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addNode(node.id, newFolderName.trim(), 'folder');
      setNewFolderName('');
      setShowAddFolder(false);
      setIsExpanded(true); // Auto-expand when adding a folder
    }
  };

  const confirmDelete = () => {
    deleteNode(node.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`tree-node ${isLeaf ? 'is-leaf' : ''}`} style={{ '--depth': depth }}>
      <div className="node-header">
        <div className="node-content" onClick={handleToggle}>
          {hasChildren ? (
            <span className="toggle-icon">
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          ) : (
            <span className="toggle-icon spacer"></span>
          )}

          <span className="node-icon">
            {node.type === 'folder' ? <FiFolder /> : <FiFile />}
          </span>

          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              autoFocus
              className="edit-input"
            />
          ) : (
            <span className="node-name">{node.name}</span>
          )}
        </div>

        {!isEditing && node.id !== 1 && (
          <div className="node-actions">
            <button 
              className="action-btn more-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <FiMoreVertical />
            </button>

            {showActions && (
              <div className="action-menu">
                <button className="action-item" onClick={handleEdit}>
                  <FiEdit2 /> Rename
                </button>
                <button 
                  className="action-item" 
                  onClick={() => {
                    setShowAddFolder(true);
                    setShowActions(false);
                  }}
                >
                  <FiPlus /> Add Folder
                </button>
                <button 
                  className="action-item delete" 
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowActions(false);
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="node-children">
          {node.children.map(childId => (
            <TreeNode key={childId} node={nodes[childId]} depth={depth + 1} setSelectedTreeItem={setSelectedTreeItem} />
          ))}
        </div>
      )}

      {showAddFolder && (
        <div className="add-folder-container">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={handleAddFolder}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
            placeholder="Folder name"
            autoFocus
            className="add-input"
          />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <p>Delete "{node.name}"?</p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TreeView({ setSelectedTreeItem }) {
  const { nodes } = useContext(FileExplorerContext);

  return (
    <div className="tree-view">
      {Object.values(nodes)
        .filter(node => node.parentId === null)
        .map(node => (
          <TreeNode key={node.id} node={node} setSelectedTreeItem={setSelectedTreeItem} />
        ))
      }
    </div>
  );
};
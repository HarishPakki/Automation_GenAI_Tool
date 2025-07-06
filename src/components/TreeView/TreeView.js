import { useContext, useState } from "react";
import Input from "./Input";
import { FileExplorerContext } from "./context/FileExplorerContext";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import AppsIcon from '@mui/icons-material/Apps';
import "./TreeView.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const iconStyles = {
  fontSize: '18px',
  marginRight: '8px'
};

const applicationIcon = <AppsIcon sx={{ ...iconStyles, color: '#1976d2' }} />;
const folderIcon = <FolderIcon sx={{ ...iconStyles, color: '#ffb74d' }} />;
const fileIcon = <InsertDriveFileOutlinedIcon sx={{ ...iconStyles, color: '#78909c' }} />;

function TreeNode({ node }) {
  const [showChildren, setShowChildren] = useState(true);
  const [showAddInput, setShowAddInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  const [newType, setNewType] = useState(null);
  
  const { 
    nodes, 
    deleteNode, 
    addNode, 
    editNode,
    handleContextMenu
  } = useContext(FileExplorerContext);

  const handleClick = () => {
    if (node.children?.length > 0) {
      setShowChildren(!showChildren);
    }
  };

  const renderDeleteConfirmationDialog = () => {
    return (
      <Dialog
        open={showDeleteConfirmationDialog}
        onClose={() => setShowDeleteConfirmationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{node.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmationDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              deleteNode(node.id);
              setShowDeleteConfirmationDialog(false);
            }} 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div 
      className="node-container"
      onContextMenu={(e) => handleContextMenu(e, node.id)}
    >
      {renderDeleteConfirmationDialog()}
      
      <div className="file-row">
        <div onClick={handleClick}>
          {node.type === "application" && applicationIcon}
          {node.type === "folder" && (showChildren ? 
            <KeyboardArrowDownIcon fontSize="medium" sx={iconStyles} /> : 
            <KeyboardArrowRightIcon fontSize="medium" sx={iconStyles} />)}
          {node.type === "file" && fileIcon}
        </div>

        {showEditInput ? (
          <div>
            <Input
              name={node.name}
              cancel={() => setShowEditInput(false)}
              id={node.id}
              submit={editNode}
            />
          </div>
        ) : (
          <div className="file-actions">
            <div className="file-name" onClick={handleClick}>{node.name}</div>
            
            <div className="action-icons">
              {(node.type === "application" || node.type === "folder") && (
                <div onClick={(e) => {
                  e.stopPropagation();
                  setShowAddInput(true);
                  setNewType("folder");
                }}>
                  <CreateNewFolderOutlinedIcon fontSize="medium" sx={iconStyles} />
                </div>
              )}
              <div onClick={(e) => {
                e.stopPropagation();
                setShowEditInput(true);
              }}>
                <EditOutlinedIcon fontSize="medium" sx={iconStyles} />
              </div>
              <div onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirmationDialog(true);
              }}>
                <DeleteOutlineOutlinedIcon fontSize="medium" sx={iconStyles} />
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddInput && (
        <div style={{ marginLeft: '1.5rem' }}>
          <Input
            submit={addNode}
            id={node.id}
            cancel={() => setShowAddInput(false)}
            newType={newType}
          />
        </div>
      )}

      {showChildren && node.children?.map(childId => (
        <div key={childId} style={{ marginLeft: '1.5rem' }}>
          <TreeNode node={nodes[childId]} />
        </div>
      ))}
    </div>
  );
}

export default function FileExplorer() {
  const { 
    nodes, 
    createApplication,
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    addNode,
    editNode
  } = useContext(FileExplorerContext);

  const renderContextMenu = () => {
    if (!contextMenu.visible || !nodes[contextMenu.nodeId]) return null;
    
    const node = nodes[contextMenu.nodeId];
    const isApplication = node.type === "application";
    
    return (
      <Menu
        open={contextMenu.visible}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: contextMenu.y,
          left: contextMenu.x
        }}
      >
        {isApplication && (
          <>
            <MenuItem onClick={() => {
              addNode(node.id, "Folder A", "folder");
              closeContextMenu();
            }}>
              Create A (Folder)
            </MenuItem>
            <MenuItem onClick={() => {
              addNode(node.id, "File B", "file");
              closeContextMenu();
            }}>
              Create B (File)
            </MenuItem>
            <MenuItem onClick={() => {
              addNode(node.id, "Folder C", "folder");
              closeContextMenu();
            }}>
              Create C (Folder)
            </MenuItem>
            <MenuItem onClick={() => {
              addNode(node.id, "File D", "file");
              closeContextMenu();
            }}>
              Create D (File)
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => {
          editNode(node.id, prompt("Enter new name", node.name));
          closeContextMenu();
        }}>
          Rename
        </MenuItem>
        {/* <MenuItem onClick={() => {
          if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
            deleteNode(node.id);
          }
          closeContextMenu();
        }}>
          Delete
        </MenuItem> */}
      </Menu>
    );
  };

  return (
    <div className="tree-view-container">
      {renderContextMenu()}
      
      <div className="create-app-container">
        <Button 
          variant="contained" 
          color="primary"
          onClick={createApplication}
          startIcon={<AppsIcon />}
        >
          Create Application
        </Button>
      </div>

      {Object.keys(nodes).length === 0 ? (
        <div className="no-data">No applications created yet</div>
      ) : (
        <div className="applications-list">
          {Object.values(nodes)
            .filter(node => node.parentId === null)
            .map(node => (
              <TreeNode key={node.id} node={node} />
            ))
          }
        </div>
      )}
    </div>
  );
}
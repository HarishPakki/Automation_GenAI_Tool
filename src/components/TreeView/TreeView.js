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
import "./TreeView.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Reference: https://codesandbox.io/p/sandbox/file-explorer-2-74dlgy?file=%2Fsrc%2Fstyles.css%3A10%2C1

const styles = {
    fontSize: '20px'
};

export default function FileExplorer({ id = 1 }) {
    const [showChildren, setShowChildren] = useState(true);
    const [showAddInput, setShowAddInput] = useState(false);
    const [showEditInput, setShowEditInput] = useState(false);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [newType, setNewType] = useState(null);
    const { nodes, deleteNode, addNode, editNode } =
        useContext(FileExplorerContext);

    const handleClick = () => {
        setShowChildren(!showChildren);
        let selectedNode;
        for (let node in nodes) {
            if (node === String(id)) {
                selectedNode = id;
            }
        }
        console.log(selectedNode);
        // Here call db query API by passing selectedNode
    };

    const renderDeleteConfirmationDialog=()=>{
        return(
            <Dialog
                open={showDeleteConfirmationDialog}
                onClose={()=>setShowDeleteConfirmationDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setShowDeleteConfirmationDialog(false)}>No</Button>
                    <Button variant="contained" onClick={()=>{
                        deleteNode(id);
                        setShowDeleteConfirmationDialog(false);
                    }} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    console.log(nodes);
    return (
        <div className="container" style={{ background: "#e3e5f8", padding: '5px 18px' }}>
            {renderDeleteConfirmationDialog()}
            {
                nodes[id] && (
                    <div className="file-row">
                        <div onClick={handleClick}>
                            {nodes[id].type === "folder" ? (showChildren ? <KeyboardArrowDownIcon fontSize="medium" sx={styles} /> : <KeyboardArrowRightIcon sx={styles} />) : <InsertDriveFileOutlinedIcon fontSize="medium" sx={{...styles, fontSize: '18px'}} />}
                        </div>

                        {showEditInput ? (
                            <div>
                                <Input
                                    name={nodes[id].name}
                                    cancel={() => setShowEditInput(false)}
                                    id={id}
                                    submit={editNode}
                                />
                            </div>
                        ) : (
                            <div className="file-actions">
                                <div className="file-name" onClick={handleClick}>{nodes[id].name}</div>

                                {nodes[id].type === "folder" && (
                                    <div className="folder-actions">
                                        <div onClick={(event) => {
                                            event.preventDefault();
                                            setShowAddInput(true);
                                            setNewType('file');
                                        }}><NoteAddOutlinedIcon fontSize="medium" sx={styles} /></div>
                                        <div onClick={() => {
                                            setShowAddInput(true);
                                            setNewType('folder');
                                        }}><CreateNewFolderOutlinedIcon fontSize="medium" sx={styles} /></div>
                                    </div>
                                )}
                                <div onClick={() => setShowEditInput(true)}><EditOutlinedIcon fontSize="medium" sx={styles} /></div>
                                <div onClick={() => setShowDeleteConfirmationDialog(true)}><DeleteOutlineOutlinedIcon fontSize="medium" sx={styles} /></div>
                            </div>
                        )}
                    </div>
                )
            }
            <>
                {showAddInput && (
                    <div style={{marginLeft:'1.5rem'}}>
                        <Input
                            submit={addNode}
                            id={id}
                            cancel={() => setShowAddInput(false)}
                            newType={newType}
                        />
                    </div>
                )}
            </>
            {showChildren &&
                nodes[id]?.children?.map((childId, index) => {
                    return <FileExplorer key={index} id={childId} />;
                })}
        </div>
    );
}

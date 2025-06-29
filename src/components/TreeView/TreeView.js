import { useContext, useState } from "react";
import Input from "./Input";
import { FileExplorerContext } from "./context/FileExplorerContext";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import "./TreeView.css";

// Reference: https://codesandbox.io/p/sandbox/file-explorer-2-74dlgy?file=%2Fsrc%2Fstyles.css%3A10%2C1

const styles={
    margin: '-11px -6px'
};

export default function FileExplorer({ id = 1 }) {
    const [showChildren, setShowChildren] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const [showEditInput, setShowEditInput] = useState(false);
    const [newType, setNewType] = useState(null);
    const { nodes, deleteNode, addNode, editNode } =
        useContext(FileExplorerContext);

    const handleClick = () => {
        setShowChildren(!showChildren);
        let selectedNode;
        for(let node in nodes){
            if(node === String(id)){
                selectedNode = id;
            }
        }
        console.log(selectedNode);
        // Here call db query API by passing selectedNode
    };

    console.log(nodes);
    return (
        <div className="container" style={{background:"#e3e5f8"}}>
            <h5>
                {
                    nodes[id] && (
                        <>
                            {/* {nodes[id] && nodes[id].type === "folder" ? (showChildren ? "📂" : "📁") : "📄"} */}
                            {nodes[id] && nodes[id].type === "folder" ? (showChildren ? <ArrowDropDownIcon fontSize="large" sx={styles} /> : <ArrowRightIcon fontSize="large" sx={styles} />) : "📄"}

                            {showEditInput ? (
                                <Input
                                    name={nodes[id].name}
                                    cancel={() => setShowEditInput(false)}
                                    id={id}
                                    submit={editNode}
                                />
                            ) : (
                                <>
                                    <span onClick={handleClick}>{nodes[id] && nodes[id].name}</span>

                                    {nodes[id] && nodes[id].type === "folder" && (
                                        <>
                                            <span onClick={() => {
                                                setShowAddInput(true);
                                                setNewType('file');
                                            }}><NoteAddIcon sx={styles}/></span>
                                            <span onClick={() => {
                                                setShowAddInput(true);
                                                setNewType('folder');
                                            }}><CreateNewFolderIcon sx={styles}/></span>
                                        </>
                                    )}
                                    <span onClick={() => setShowEditInput(true)}><EditIcon sx={styles} /></span>
                                    <span onClick={() => deleteNode(id)}><DeleteIcon sx={styles}/></span>
                                </>
                            )}
                        </>
                    )
                }
            </h5>
            <>
                {showAddInput && (
                    <Input
                        submit={addNode}
                        id={id}
                        cancel={() => setShowAddInput(false)}
                        newType={newType}
                    />
                )}
            </>
            {showChildren &&
                nodes[id]?.children?.map((childId, index) => {
                    return <FileExplorer key={index} id={childId} />;
                })}
        </div>
    );
}

import React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import './TreeView.css';
import { testCasesTreeData } from '../../utils/treeUtil';

const TreeView = ({setSelectedTreeItem}) => {

    const handleItemClick=(event, itemId)=>{
        console.log("handleItemClick",itemId);
        setSelectedTreeItem(itemId);

    };

    return (
        <Box className='tree-view-box' sx={{ minHeight: 352, minWidth: 250 }}>
            <SimpleTreeView onItemClick={handleItemClick}>
                {
                    testCasesTreeData.map((module, parentIndex)=>{
                        const testCases = module.items;
                        return (
                            <TreeItem key={parentIndex} itemId={module.id} label={module.label}>
                                {
                                    testCases.map((testCase,childrenIndex)=>{
                                        return(
                                            <TreeItem key={childrenIndex} itemId={testCase.id} label={testCase.label} />
                                        )
                                    })
                                }
                            </TreeItem>            
                        )
                    })
                }
            </SimpleTreeView>
        </Box>
    );
}

export default TreeView;
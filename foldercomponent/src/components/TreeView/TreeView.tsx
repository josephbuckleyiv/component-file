import { createContext, useState } from 'react';

// Components
import { Folder } from '../Folder'

// Hooks
import { useDrag, useFileView } from '../../hooks'

import example from './example.json';
import { Folder as FolderType } from '../../Types'
import { DragContext, SelectionContext } from './contexts';



const treeStructure = example as FolderType;
    treeStructure.isExpanded = false;

export const TreeView = () => {
    const [tree] = useState(treeStructure)
    const dragObj = useDrag();
    const fileObj = useFileView();


    return (
        <div className="text-start p-2">
            <DragContext.Provider value={dragObj} >
                <SelectionContext.Provider value={fileObj} >
                    <Folder loadedFolder={tree} />
                </SelectionContext.Provider>
            </DragContext.Provider>

        </div>
    )

}
import { useState } from 'react';

// Components
import { Object } from '../Object'

// Hooks
import { useDrag, useFileView } from '../../hooks'

import example from './example_2.json';
import { Object as ObjectType } from '../../Types'
import { DragContext, SelectionContext } from './contexts';



const treeStructure = example as ObjectType;
treeStructure.isExpanded = false;
treeStructure.depth = 0;

export const TreeView = () => {
    const [tree] = useState(treeStructure)
    const dragObj = useDrag();
    const fileObj = useFileView();

    // We will later create a dummy tree which has depth 0
    // in order to allow multiple root elements.

    return (
        <div>
            Files
            <div className="text-start p-2">
                <DragContext.Provider value={dragObj} >
                    <SelectionContext.Provider value={fileObj} >
                        <Object loadedObject={tree} />
                    </SelectionContext.Provider>
                </DragContext.Provider>

            </div>
        </div>
        )

}
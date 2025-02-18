import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Object } from '../Object';

// Hooks
import { useDrag, useSelection } from '../../hooks';

import example from './example_2.json';
import { Object as ObjectType, TreeOptions } from '../../Types';
import { DragContext, SelectionContext } from './contexts';



const treeStructure = example as ObjectType;
treeStructure.id = uuidv4();
treeStructure.isExpanded = false;
treeStructure.depth = 0;

export const TreeView = ({ edit }: TreeOptions) => {
    const [id] = useState(uuidv4());
    const [tree] = useState(treeStructure);
    const dragObj = useDrag({ canDrag: edit });
    const fileObj = useSelection({ canCopy: edit });

    // We will later create a dummy tree which has depth 0
    // in order to allow multiple root elements.

    return (
        <div id={id}>
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
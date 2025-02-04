import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { File as FileType } from '../../Types'

// Styles and Icons
import { FaRegFile } from 'react-icons/fa6';
import './file.css'

import { useState } from 'react';
import { DragContext } from '../TreeView/contexts';


export const File = ({ fileName, parentFiles, rerender }: any ) => {
    const dragContext = useContext(DragContext)
    const [id] = useState(uuidv4());


    return (
        <div
            id={id}
            className="droppable hover-class w-100 px-1 d-inline-flex align-items-center"
            draggable="true"
            onDragOver={(event: React.MouseEvent) => dragContext.dragOver(id, fileName, { fileName, parentFiles }, event)}
            onDragLeave={() => dragContext.dragLeave(id)}
            onDrop={() => dragContext.dragEnd(id, rerender, fileName, parentFiles)} >
            <FaRegFile />
            <div className="px-1"> 
                <div> {fileName} </div>
            </div>
        </div>
    );
}
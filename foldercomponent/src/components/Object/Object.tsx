import { useState, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Object as ObjectType } from '../../Types'

// Icons and Styles
import { FaRegFile, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import './object.css'
import { DragContext } from '../TreeView/contexts';


export const Object = ({ loadedObject, parentObjects, parentRerender }: {
    loadedObject: ObjectType,
    parentObjects: ObjectType[],
    parentRerender: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [objectProps, setObjectProps] = useState(loadedObject); // This is changing the rendering on every load.
    const [rerenderMyself, setRerenderMyself] = useState(false);

    const dragContext = useContext(DragContext)
    const [id] = useState(uuidv4());
    const dragObject = {
        objectName: objectProps.objectName,
        subObjects: objectProps.subObjects,
        hasChildren: objectProps.hasChildren,
        isExpanded: objectProps.isExpanded ?? undefined,
        depth: objectProps.depth,
        rerenderDragged: parentRerender,
        parent: parentObjects
    };

    // This function generates the subObject by mapping
    // object references to the subobjects to child function components.
    // New logic gives isExpanded property only to elements with children.
    const loadChildren = useCallback(() => {   

        return <div key={uuidv4()} className="ms-3">
            {objectProps.subObjects?.map((object: ObjectType) => { // I know the issue is HERE!*/
                // NEED TO SORT ACCORING TO WHO HAS CHILDREN.
                object.depth = (objectProps.depth == undefined) ? 0 : objectProps.depth + 1;

                if (!object.hasChildren) { // THis is the object analogue of 
                    return (<div key={uuidv4()}>
                        <Object loadedObject={object} parentObjects={objectProps.subObjects} parentRerender={setRerenderMyself} />
                    </div>);
                }
                else { // These are the object analogue of directories
                    object.isExpanded = object.isExpanded ?? false;
                    return (<div key={uuidv4()}>
                        <Object loadedObject={object} parentObjects={objectProps.subObjects} parentRerender={setRerenderMyself} />
                    </div>);
                }
            })}
        {/*    {objectProps.files?.map((file: FileType) => <div key={uuidv4()}> <File fileName={file.fileName} parentFiles={objectProps.files} rerender={setRerender } /> </div>)} */}
        </div> 

    }, [objectProps, rerenderMyself]);

    

    
        
    return (
        <div
            id={id}
            draggable="true"
            className="box-sizing-border-box"
            onDragOver={(event: React.MouseEvent) => { event.preventDefault(); dragContext?.dragOver(id, objectProps.objectName, dragObject, event) }}
            onDragLeave={(event: React.MouseEvent) => { event.preventDefault(); dragContext?.dragLeave(id) }}
            onDrop={(event: React.MouseEvent) => { event.preventDefault();  dragContext?.dragEnd(id, parentRerender, objectProps.objectName, objectProps.depth, parentObjects) }} 
        > 
            <div id={uuidv4()} className="hover-class px-1 w-100 d-inline-flex align-items-center"
                onClick={() => {
                objectProps.isExpanded = !objectProps.isExpanded;

                setObjectProps(objectProps); // here
                setRerenderMyself(!rerenderMyself);
                }}
            >
                {!objectProps.hasChildren ? <FaRegFile /> : (objectProps.isExpanded ? <FaRegFolderOpen/> : <FaRegFolder />) }
                <div className="px-1"> {objectProps.objectName} </div>
            </div>
            {objectProps.hasChildren && objectProps.isExpanded && loadChildren()}
        </div>
    );
}

//<div
//    id={id}
//    className="droppable hover-class w-100 px-1 d-inline-flex align-items-center"
//    draggable="true"
//    onDragOver={(event: React.MouseEvent) => dragContext?.dragOver(id, fileName, { fileName, parentFiles }, event)}
//    onDragLeave={() => dragContext?.dragLeave(id)}
//    onDrop={() => dragContext?.dragEnd(id, rerender, fileName, parentFiles)} >
//    <FaRegFile />
//    <div className="px-1">
//        <div> {fileName} </div>
//    </div>
//</div>
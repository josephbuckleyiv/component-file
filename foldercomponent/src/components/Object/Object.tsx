import { useState, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Object as ObjectType } from '../../Types'

// Icons and Styles
import { FaRegFile, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import './object.css'
import { DragContext, SelectionContext } from '../TreeView/contexts';


export const Object = ({ loadedObject, parentObjects, parentRerender }: {
    loadedObject: ObjectType,
    parentObjects: ObjectType[],
    parentRerender: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [objectProps, setObjectProps] = useState(loadedObject); // This is changing the rendering on every load.
    const [rerenderMyself, setRerenderMyself] = useState(false);

    const dragContext = useContext(DragContext)
    const selectionContext = useContext(SelectionContext)
    const [id] = useState(uuidv4());
    const dragObject = {
        id: objectProps.id,
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
                object.id = object.id ?? uuidv4();
                object.isExpanded = object.isExpanded ?? false;
                if (object.subObjects == undefined) {
                    object.subObjects = [];
                }

                return (<div key={uuidv4()}>
                    <Object loadedObject={object} parentObjects={objectProps.subObjects} parentRerender={setRerenderMyself} />
                </div>);
            })}
        </div> 

    }, [objectProps, rerenderMyself]);

    return (
        <div
            id={id}
            draggable="true"
            className="box-sizing-border-box"
            onDragOver={(event: React.MouseEvent) => { event.preventDefault(); dragContext?.dragOver(id, objectProps.objectName, dragObject, event) }}
            onDragLeave={(event: React.MouseEvent) => { event.preventDefault(); dragContext?.dragLeave(id) }}
            onDrop={(event: React.MouseEvent) => { event.preventDefault();  dragContext?.dragEnd(id, parentRerender, objectProps.id, objectProps.depth, parentObjects) }} 
        > 
            <div id={uuidv4()} className={"hover-class px-1 w-100 d-inline-flex align-items-center" + (selectionContext?.fileToShow.current == objectProps.objectName ? " bg-bl" : "" )}
                onClick={() => {
                objectProps.isExpanded = !objectProps.isExpanded;
                selectionContext?.getFile(objectProps.objectName)
                setObjectProps(objectProps); // here
                setRerenderMyself(!rerenderMyself);
                }}
            >
                {!objectProps.subObjects?.length ? <FaRegFile /> : (objectProps.isExpanded ? <FaRegFolderOpen/> : <FaRegFolder />) }
                <div className="px-1"> {objectProps.objectName} </div>
            </div>
            {objectProps.hasChildren && objectProps.isExpanded && loadChildren()}
        </div>
    );
}


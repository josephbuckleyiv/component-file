import { useRef, useCallback } from "react";

// Types
import { DragInfo, Object, BorderLocation } from '../Types'

export const useDrag = () => {
    const dragObject = useRef<DragInfo | null>(null);
    const borderLocation = useRef<BorderLocation | null>(null);
    const dragOverDiv = useRef<string | null>(null);



    const dragOver = useCallback((id: string, objectName: string, draggingObj: DragInfo , event: React.DragEvent<HTMLDivElement>) => {

        if (dragOverDiv.current == null) {
            dragOverDiv.current = id;
        }

        const dropDiv = document.getElementById(dragOverDiv.current);


        if (dragObject.current == null) { dragObject.current = draggingObj }
        if (dropDiv == null) { return };
        const rect = dropDiv.getBoundingClientRect();
        const top = rect.y;

        // This for dragging sensitivity
        if (borderLocation.current == null && top + 11  > event.clientY && event.clientY > top + dropDiv.offsetHeight -11 ) {
            dropDiv.classList.remove('border-top');
            dropDiv.classList.remove('border-primary');
            borderLocation.current = null;
        }
        else if (borderLocation.current == "top" && Math.abs(event.clientY - top) > 11) {
            dropDiv.classList.remove('border-top');
            dropDiv.classList.remove('border-primary');
            console.log("here top")
            console.log(event.clientY - top)
            borderLocation.current = null;
        }
        else if (borderLocation.current == "bottom" && Math.abs(event.clientY - top - dropDiv.offsetHeight) > 11) {
            dropDiv.classList.remove('border-bottom');
            dropDiv.classList.remove('border-primary');
            console.log("here bottom")
            borderLocation.current = null;
        }


        if (borderLocation.current) return;
        
        if ( Math.abs(event.clientY - top) < 10) {
            if (!dropDiv.classList.contains('border-top')) {
                dropDiv.classList.add('border-top');
                dropDiv.classList.add('border-black');
            }

                borderLocation.current = "top";
        }
        else if (Math.abs(event.clientY - top - dropDiv.offsetHeight) < 10) {
            //console.log("here bottom", event.clientY, top,  dropDive.offsetHeight)
            if (!dropDiv.classList.contains('border-bottom')) {
                dropDiv.classList.add('border-bottom');
                dropDiv.classList.add('border-black');
            }
            borderLocation.current = "bottom";
        }
        
        else {
            dropDiv.classList.remove('border-top');
            dropDiv.classList.remove('border-bottom');
            dropDiv.classList.remove('border-primary');
            borderLocation.current = null;

        }

    }, []);

    // onDragLeave
    const dragLeave = useCallback((id: string) => {
        const dropDive = document.getElementById(id);
        if (dropDive == null) { return };
        dropDive.classList.remove('border-top');
        dropDive.classList.remove('border-bottom');
        dropDive.classList.remove('border-primary');
        borderLocation.current = null;
        dragOverDiv.current = null;
    }, []);

  


    // Take reference to the current object --> make it null,
    // But first copy it, and then add it to the desired array.
    // To find the proper place to drop we mark all draggable elements with
    // drag class

    // We refresh depending on whose depth is the most.
    const dragEnd = (id: string, rerender: React.Dispatch<React.SetStateAction<boolean>>, dropLocationId: string, dropLocationDepth: number, dragLocationParents: Object[]) => {
        const droppedItem = dragObject.current;
        const borderLocationVal = borderLocation.current;
        dragOverDiv.current = null;
        if (droppedItem == null) return;

        // If we drop the same one 
        if (droppedItem.id == dropLocationId) {
            dragObject.current = null;
            rerender((state) => !state);
            return;
        }


        // Return if the dropped element is a parent of the draggedOver
        // element.


        //if (borderLocationVal == null) return;
        // Refresh the elder of the two elements.
        if (droppedItem.depth < dropLocationDepth) {
            rerender = droppedItem.rerenderDragged;
        }

        let offset = (borderLocationVal == "bottom") ? 1 : 0;

        // Make it the child of the drop element.
        if (borderLocationVal == null) {
            offset = -1;
        }


        // This locates the object we are dragging.
        // Removes it.
        const idx = droppedItem.parent.findIndex(x => x.id == droppedItem.id)
        if (idx !== -1) {
            droppedItem.parent.splice(idx, 1);
        }

        // This locates  the drop.
        // Add it.
        const dropIdx = dragLocationParents.findIndex(x => x.id == dropLocationId)
        const newElement = {
            id: droppedItem.id,
            objectName: droppedItem.objectName,
            subObjects: droppedItem.subObjects,
            isExpanded: droppedItem.isExpanded ?? undefined,
            hasChildren: droppedItem.hasChildren,
            depth: dropLocationDepth + 1

        } as Object

        if (offset == -1) {
            dragLocationParents[dropIdx].subObjects?.push(newElement);
            dragLocationParents[dropIdx].hasChildren = true;
            dragLocationParents[dropIdx].isExpanded = true;
        }
        else {
          dragLocationParents.splice(dropIdx + offset, 0, newElement);
        }

        const dropDiv = document.getElementById(id);

        dropDiv?.classList.remove('border-top');
        dropDiv?.classList.remove('border-bottom');
        dropDiv?.classList.remove('border-primary');

        borderLocation.current = null;

        dragObject.current = null;
        // Decide which element to rerender.
        if (droppedItem.depth < dropLocationDepth) {
            droppedItem.rerenderDragged((state) => !state);
        }
        else {

            rerender((state) => !state);
        }
    }


    return { dragOver, dragLeave, dragEnd }
}
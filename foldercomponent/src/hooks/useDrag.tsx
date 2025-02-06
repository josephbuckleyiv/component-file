import { useRef, useCallback } from "react";

// Types
import { DragInfo, Object, BorderLocation } from '../Types'

export const useDrag = () => {
    const dragObject = useRef<DragInfo | null>(null);
    const borderLocation = useRef<BorderLocation | null>(null);
    const borderSemaphore = useRef<number>(0);
    console.log(borderSemaphore.current)

    const dragOver = useCallback((id: string, objectName: string, draggingObj: DragInfo , event: React.DragEvent<HTMLDivElement>) => {
        const dropDive = document.getElementById(id);
        if (dragObject.current == null) { dragObject.current = draggingObj }
        if (dropDive == null) { console.log("hello"); return };
        event.dataTransfer.effectAllowed = "move";
        console.log(borderSemaphore.current)
        const rect = dropDive.getBoundingClientRect();
        const top = rect.top;
        //setDragInfo({ dragObject: fileName, position: { x: 0, y: 0 } });

        if (borderSemaphore.current) return;
        if ( Math.abs(event.clientY - top) < 12) {
            if (!dropDive.classList.contains('border-top')) {
                dropDive.classList.add('border-top');
                dropDive.classList.add('border-black');
                borderSemaphore.current++;
                borderLocation.current = "top";
            }
        }
        else if (Math.abs(event.clientY - top - dropDive.offsetHeight) < 12) {
            if (!dropDive.classList.contains('border-bottom')) {
                dropDive.classList.add('border-bottom');
                dropDive.classList.add('border-black');
                borderSemaphore.current++;
                borderLocation.current = "bottom";
            }
        }
        else {
            dropDive.classList.remove('border-top');
            dropDive.classList.remove('border-bottom');
            dropDive.classList.remove('border-primary');
        }

    }, []);

    // onDragLeave
    const dragLeave = useCallback((id: string) => {
        const dropDive = document.getElementById(id);
        if (dropDive == null) { return };
        dropDive.classList.remove('border-top');
        dropDive.classList.remove('border-bottom');
        dropDive.classList.remove('border-primary');
        borderSemaphore.current = 0;
        borderLocation.current = null;

    }, []);

  


    // Take reference to the current object --> make it null,
    // But first copy it, and then add it to the desired array.
    // To find the proper place to drop we mark all draggable elements with
    // drag class

    // We refresh depending on whose depth is the most.
    const dragEnd = (id: string, rerender: React.Dispatch<React.SetStateAction<boolean>>, dropLocation: string, dropLocationDepth: number, dragLocationParents: Object[]) => {
        const dropThisSucker = dragObject.current;
        if (dropThisSucker == null) return;


        // Refresh the elder of the two elements.
        if (dropThisSucker.depth < dropLocationDepth) {
            rerender = dropThisSucker.rerenderDragged;
        }

        if (dropThisSucker.objectName == dropLocation) {
            dragObject.current = null;
            rerender((state) => !state);
            return;
        }
        const offset = (borderLocation.current == "bottom") ? 1 : 0;

        // This locates the object we are dragging.
        // Removes it.
        const idx = dropThisSucker.parent.findIndex(x => x.objectName == dropThisSucker.objectName)
        if (idx !== -1) {
            dropThisSucker.parent.splice(idx, 1);
        }

        // This locates  the drop.
        // Add it.
        const dropIdx = dragLocationParents.findIndex(x => x.objectName == dropLocation)
        const newElement = {
            objectName: dropThisSucker.objectName,
            subObjects: dropThisSucker.subObjects,
            isExpanded: dropThisSucker.isExpanded ?? undefined,
            hasChildren: dropThisSucker.hasChildren,
            depth: dropLocationDepth + 1

        }
        console.log(newElement.depth)
        dragLocationParents.splice(dropIdx + offset, 0, newElement);

        const dropDive = document.getElementById(id);
        dropDive?.classList.remove('border-top');
        dropDive?.classList.remove('border-bottom');
        dropDive?.classList.remove('border-primary');
        borderSemaphore.current = 0;

        dragObject.current = null;
        if (dropThisSucker.depth < dropLocationDepth) {
            dropThisSucker.rerenderDragged((state) => !state);
        }
        else {

            rerender((state) => !state);
        }
    }


    return { dragOver, dragLeave, dragEnd }
}
import { useRef, useCallback } from "react";

// Types
import { DragInfo, File } from '../Types'

export const useDrag = () => {
    //const [dragObject, setDragObject] = useState(null);
    //const [dragInfo, setDragInfo] = useState<DragInfo>({ dragObject: "", position: { x: 0, y: 0 }});
    const dragObject = useRef<DragInfo | null>(null);

    const dragOver = useCallback((id: string, fileName: string, draggingObj: DragInfo , event: React.DragEvent<HTMLDivElement>) => {
        const dropDive = document.getElementById(id);
        if (dragObject.current == null) { dragObject.current = draggingObj }
        if (dropDive == null) { console.log("hello"); return };
        event.preventDefault();

        const rect = dropDive.getBoundingClientRect();
        const top = rect.top;
        //setDragInfo({ dragObject: fileName, position: { x: 0, y: 0 } });

        if (Math.abs(event.clientY - top) < 12) {
            if (!dropDive.classList.contains('border-top')) {
                dropDive.classList.add('border-top');
                dropDive.classList.add('border-black');
            }
        }
        else {
            dropDive.classList.remove('border-top');
            dropDive.classList.remove('border-primary');
        }

    }, []);

    // onDragLeave
    const dragLeave = useCallback((id: string) => {
        const dropDive = document.getElementById(id);
        if (dropDive == null) { return };
        dropDive.classList.remove('border-top');
        dropDive.classList.remove('border-primary');

    }, []);

    // To find the proper place to drop we mark all draggable elements with
    // drag class
    //const dragElement = (name: string, mousePosition: React.DragEvent<HTMLDivElement>) => {
    //    setDragInfo({dragObject: name, position: { x: mousePosition.clientX, y: mousePosition.clientY }});
    //}


    // Take reference to the current object --> make it null,
    // But first copy it, and then add it to the desired array.
    // To find the proper place to drop we mark all draggable elements with 
    // drag class
    const dragEnd = (id: string, rerender: React.Dispatch<React.SetStateAction<boolean>>, dropLocation: string, dragLocationParents: File[]) => {
        const dropThisSucker = dragObject.current;
        if (dropThisSucker == null) return;

        // This locates the object we are dragging.
        // Removes it.
        const idx = dropThisSucker.parentFiles.findIndex(x => x.fileName == dropThisSucker.fileName)
        if (idx !== -1) {
            dropThisSucker.parentFiles.splice(idx, 1);
        }

        // This locates of the drop.
        // Add it.
        const dropIdx = dragLocationParents.findIndex(x => x.fileName == dropLocation)
        const newElement = { fileName: dropThisSucker.fileName }

        dragLocationParents.splice(dropIdx, 0, newElement);

        const dropDive = document.getElementById(id);
        dropDive?.classList.remove('border-top');
        dropDive?.classList.remove('border-primary');

        dragObject.current = null;
        rerender((state) => !state);
    }


    return { dragOver, dragLeave, dragEnd }
}
import { useRef, useCallback } from "react";

// Types
import { Object, SelectionOptions } from '../Types'

// Use this in tandem with React.Provider
// to provide state to child components.
export const useSelection = ({ canCopy }: SelectionOptions) => {
    const fileToShow = useRef<string | null>(null); // Want to pass only this id.
    const fileSelected = useRef<Object | null>(null);

    const fileRerender = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null);
    const fileParentRerender = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null);

    const copyThisFile = useRef<Object | null>(null);
    //const getFile = async (url : string) => {
    //    fetch(url)
    //        .then(response => response.json())
    //        .then(data => setFileToShow(data))
    //}

    // HERE WE HOLD THE EVENT HANDLERS.
    const handleCopyEvent = function (event: KeyboardEvent) {
        if (event.ctrlKey && event.key == 'c') {
            copyThisFile.current = fileSelected.current;
            console.log(copyThisFile.current)
        }
    }

    const handlePasteEvent = function (event: KeyboardEvent) {
        if (event.ctrlKey && event.key == 'v') {
            const copied = JSON.parse(JSON.stringify(copyThisFile.current));

            // Modify depth.

            fileSelected.current?.subObjects.push(copied);
            fileSelected.current!.hasChildren = true;
            fileSelected.current!.isExpanded = true;
            fileRerender.current?.((state) => !state)

        }
    }

    const handleDeleteEvent = function (event: KeyboardEvent) { // The logic for this is a bit more complicated.
        if (event.key == 'Delete') {
            fileSelected.current!.deleted = true;
            console.log("rerender");
            fileParentRerender.current?.(state => !state);
            
        }
    }


    const selectFile = useCallback((id: string, file: Object,
        rerender: React.Dispatch<React.SetStateAction<boolean>>,
        parentRerender: React.Dispatch<React.SetStateAction<boolean>>) => {
        // Everytime we select a file, delete all former connections.
        // We are relying on the property that only one file can be selected at a time.
        if (canCopy) {
            document.removeEventListener('keydown', handleCopyEvent);
            document.removeEventListener('keydown', handlePasteEvent);
            document.removeEventListener('keydown', handleDeleteEvent);
        }

        if (id == fileToShow.current) { // If its the same element.
            const previousSelected = document.getElementById(fileToShow.current);
            previousSelected?.classList.remove('bg-primary-subtle')

            fileToShow.current = null;
            fileSelected.current = null;
            fileRerender.current = null;
            return;
        }

        if (fileToShow.current) {
            const previousSelected = document.getElementById(fileToShow.current);
            previousSelected?.classList.remove('bg-primary-subtle');
            fileSelected.current = null;
            fileRerender.current = null;
        }


        const selectedElement = document.getElementById(id);
        selectedElement?.classList.add('bg-primary-subtle');

        fileToShow.current = id;
        fileSelected.current = file;

        fileRerender.current = rerender;
        fileParentRerender.current = parentRerender;

        // Add the required listeners
        if (canCopy) {
            document.addEventListener('keydown', handleCopyEvent);
            document.addEventListener('keydown', handlePasteEvent);
            document.addEventListener('keydown', handleDeleteEvent);
        }

    }, [canCopy])

    return { fileToShow, selectFile };
}


// NEED UTIL THAT UPDATES 
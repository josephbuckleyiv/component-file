import { useRef, useCallback } from "react";



// Use this in tandem with React.Provider
// to provide state to child components.
export const useSelection = () => {
    const fileToShow = useRef('');
   
    //const getFile = async (url : string) => {
    //    fetch(url)
    //        .then(response => response.json())
    //        .then(data => setFileToShow(data))
    //}

    const getFile = useCallback((id: string) => {
        if (id == fileToShow.current) {
            fileToShow.current = '';
            return;
        }
        fileToShow.current = id;
    }, [])

    return { fileToShow, getFile };
}
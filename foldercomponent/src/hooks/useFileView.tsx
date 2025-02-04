import { useState } from "react";



// Use this in tandem with React.Provider
// to provide state to child components.
export const useFileView = () => {
    const [fileToShow, setFileToShow] = useState('');
   
    const getFile = async (url : string) => {
        fetch(url)
            .then(response => response.json())
            .then(data => setFileToShow(data))
    }

    return { fileToShow, getFile };
}
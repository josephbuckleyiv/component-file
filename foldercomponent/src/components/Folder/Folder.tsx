import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { File } from '../File';
import { Folder as FolderType, File as FileType } from '../../Types'

// Icons and Styles
import { FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import './folder.css'
import { useEffect } from 'react';

export const Folder = ({ loadedFolder }: { loadedFolder: FolderType }) => {

    const [folderProps, setFolderProps] = useState(loadedFolder); // This is changing the rendering on every load.
    const [rerender, setRerender] = useState(false);

    // This function generates the subFolders by mapping
    // object references to the subobjects to child function components.
    const loadSubFiles = useCallback(() => {   

        return <div key={uuidv4()} className="ms-3">
            {folderProps.subFolders?.map((folder: FolderType) => { // I know the issue is HERE!*/
                folder.isExpanded = folder.isExpanded ?? false;
                return (<div key={uuidv4()}>
                    <Folder loadedFolder={folder} />
                </div>);
            })}
            {folderProps.files?.map((file: FileType) => <div key={uuidv4()}> <File fileName={file.fileName} parentFiles={folderProps.files} rerender={setRerender } /> </div>)} 
        </div> 

    }, [folderProps, rerender]);

    useEffect(() => {



    }, [])
        
    return (
        <div draggable="true" > 
            <div id={uuidv4()} className=" hover-class px-1 w-100 d-inline-flex align-items-center"
                onClick={() => {
                folderProps.isExpanded = !folderProps.isExpanded;

                setFolderProps(folderProps); // here
                setRerender(!rerender);
                }}
                
            >
                {folderProps.isExpanded ? <FaRegFolderOpen/> : <FaRegFolder /> }
                <div className="px-1"> {folderProps.folderName} </div>
            </div>
            {folderProps.isExpanded && loadSubFiles()}
        </div>
    );
}
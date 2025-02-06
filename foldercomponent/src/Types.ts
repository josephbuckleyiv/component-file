import internal from "stream"


export type Folder = {
   // id: string,
    folderName: string,
    subFolders?: Folder[],
    files?: File[],
    isExpanded?: boolean
}

export type File = {
   // id: string,
    fileName: string
}

export type DragInfo = {
    objectName: string,
    subObjects: Object[],
    hasChildren: boolean,
    depth: number,
    isExpanded: boolean,
    rerenderDragged: React.Dispatch<React.SetStateAction<boolean>>,
    parent: Object[]
}

export type DragContextType = {
    dragOver: any,
    dragLeave: any,
    dragEnd: any

}

export type SelectionContextType = {
    fileToShow: any,
    getFile: any
}

export type Object = {
    objectName: string,
    subObjects: Object[],
    isExpanded?: boolean,
    hasChildren: boolean,
    depth?: number
}

export type BorderLocation = "top" | "bottom";
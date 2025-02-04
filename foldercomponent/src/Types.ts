

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
    fileName: string,
    parentFiles: File[]
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


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
    id: string,
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
    selectFile: any
}

export type Object = {
    id: string,
    objectName: string,
    subObjects: Object[],
    isExpanded?: boolean,
    hasChildren: boolean,
    depth?: number,
    deleted?: boolean
}

export type TreeViewItem = {
    loadedObject: Object,
    parentObjects?: Object[],
    parentRerender?: React.Dispatch<React.SetStateAction<boolean>>
}

export type CopyAction = {

}

export type DeleteAction = {

}

export type MoveAction = {

}


export type Action = CopyAction | DeleteAction | MoveAction; 




export type BorderLocation = "top" | "bottom";



/* 
    Define types for passed options.
*/

export type TreeOptions = {
    edit: boolean
}

export type DragOptions = {
    canDrag: boolean
}

export type SelectionOptions = {
    canCopy: boolean
}
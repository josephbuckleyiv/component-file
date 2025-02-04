import { createContext } from "react";
import { DragContextType, SelectionContextType } from "../../Types";

export const DragContext = createContext<DragContextType>(null);
export const SelectionContext = createContext<SelectionContextType>(null);
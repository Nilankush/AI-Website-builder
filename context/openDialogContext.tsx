import { createContext } from "react";

interface openDialogSchema{
    openDialog: boolean;
    setOpenDialog: (openDialog: boolean)=>void;
}


export const OpenDialogContext = createContext<openDialogSchema | null>(null);
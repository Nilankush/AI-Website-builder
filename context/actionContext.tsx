import { createContext } from "react";

interface actionSchema{
    actionType: "export"|"deploy";
    timeStamp: number
};

interface actionContextSchema{
    action: actionSchema | null;
    setAction: (action: actionSchema | null)=>void
};

export const ActionContext = createContext<actionContextSchema | null>(null)
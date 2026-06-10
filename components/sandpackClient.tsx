"use client"

import { ActionContext } from "@/context/actionContext";
import { SandpackPreview, SandpackPreviewRef, useSandpack } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useRef } from "react";

export default function SandpackClient(){

    const {sandpack} = useSandpack();
    const previewRef = useRef<SandpackPreviewRef>(null);
    const actionContext = useContext(ActionContext);

    if(!actionContext){
        throw new Error("Use ActionContext properly with a provider.");
    };

    const{action, setAction} = actionContext;

    const getClientId = async() => {
        const client = await previewRef.current?.getClient();
        if(client){
            const result = await client.getCodeSandboxURL();
                        
            if(action?.actionType === "deploy"){
                window.open(`https://${result?.sandboxId}.csb.app/`);
            }else if(action?.actionType === "export"){
                window.open(result?.editorUrl);
            };                                         
        };
    };

    useEffect(()=>{
        getClientId();
    },[sandpack,action]);

    return(
        <SandpackPreview ref={previewRef} style={{height: "75vh"}} showNavigator={true}/>
    );
};
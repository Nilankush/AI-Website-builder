"use Client"

import { useContext } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { UserDetailsContext } from "@/context/userDetailContext";
import { usePathname } from "next/navigation";
import { Menu } from "./dropdownMenu";
import { OpenDialogContext } from "@/context/openDialogContext";
import { ActionContext } from "@/context/actionContext";

export default function Header(){

    const path = usePathname();
    const userContext = useContext(UserDetailsContext);
    const openDialogContext = useContext(OpenDialogContext);
    const actionContext = useContext(ActionContext);

    if(!userContext){
        throw new Error("Use userContext properly with a provider.");
    };
    const{userDetails, setUserDetails} = userContext;

    
    if(!openDialogContext){
        throw new Error("Use OpenDialogContext properly with a provider.");
    };
    const{openDialog, setOpenDialog} = openDialogContext;  
    
    if(!actionContext){
        throw new Error("Use ActionContext properly with a provider.");
    };

    const{action, setAction} = actionContext;

    const onAction = (action: "deploy"|"export") => {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        });
    };

    return(
        <div className="fixed top-0 z-1 bg-accent w-full flex p-4 items-center justify-between shadow-cyan-300 shadow-2xl">
            <h2 className="text-xl font-bold">AI WEBSITE BUILDER</h2>
            <div className="flex gap-5 items-center justify-between">
                <ModeToggle/>
                {!userDetails?.name && 
                (<div className="flex gap-5 items-center justify-between">
                <Button onClick={()=>setOpenDialog(true)} variant={"ghost"}>Sign in</Button>
                <Button variant={"secondary"} className="bg-blue-500">Get Started</Button>
                </div>)}
                {path.includes("workspace") && 
                (<div className="flex gap-5 items-center justify-between">
                    <Button onClick={()=>onAction("export")} variant={"secondary"} className="bg-blue-500">Export</Button>
                </div>)}
                <Menu/>
            </div>
        </div>
    );
};
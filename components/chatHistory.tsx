"use client"

import { UserDetailsContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvex } from "convex/react";
import { History } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Loader } from "./loader";
import { useRouter } from "next/navigation";

interface workspacesSchema{
    _id: Id<"workspace">;
    _creationTime: number;
    filedata?: any;
    messages: any;
    user: Id<"users">;
};

export default function ChatHistory(){
    const convex = useConvex()
    const userDetailsContext = useContext(UserDetailsContext);
    const[workspaces, setWorkspaces] = useState<workspacesSchema[]>()
    const[isLoading,setIsLoading] = useState<boolean>(false)
    const router = useRouter();

    if(!userDetailsContext){
        throw new Error("UserDetailsContext is empty");
    }

    const{userDetails, setUserDetails} = userDetailsContext;

    const getAllWorkspaces = async() => {
        setIsLoading(true)
        const result = await convex.query(api.workspace.getAllWorkspace,{
            id: userDetails?._id
        });
        setWorkspaces([...result])
        setIsLoading(false)
    };
    useEffect(()=>{
        userDetails && getAllWorkspaces();
    },[userDetails]);

    return(
        <>
            {isLoading ? <Loader content="Loading..."/> :(
                <div className="max-h-[80vh]">            
                {workspaces && workspaces.map((w,index)=>(
                    <div key={index} 
                    className="rounded-xl flex text-accent-foreground/80 text-sm font-semibold p-2 border cursor-pointer hover:bg-cyan-300/40"
                    onClick={()=>router.push("/workspace/"+w._id)}>
                        <History height={20} width={20}/>{w.messages[0]?.content}
                    </div>))}
            </div>)}
        </>
    );
};
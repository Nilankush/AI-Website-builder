"use client"

import { MessagesContext } from "@/context/messagesContext";
import default_file from "@/data/default_file";
import dependencies from "@/data/dependencies";
import prompt from "@/data/prompt";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackFileExplorer,
  } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState } from "react";
import { Loader } from "./loader";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import axios from "axios";
import { UserDetailsContext } from "@/context/userDetailContext";
import { countToken } from "./chatView";
import SandpackClient from "./sandpackClient";
import { ActionContext } from "@/context/actionContext";
import { useTheme } from "next-themes";


export default function CodeView(){

    const[activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const[files, setFiles] = useState(default_file.DEFAULT_FILE);
    const[loading, setLoading] = useState<boolean>(false);
    const[theme, setTheme] = useState<"dark"|"light">();
    const actionContext = useContext(ActionContext);
    const messagesContext = useContext(MessagesContext);
    const userDetailsContext = useContext(UserDetailsContext);
    const updateFiles = useMutation(api.workspace.updateFiles);
    const updateToken = useMutation(api.users.updateToken);
    const {id}: any = useParams();
    const convex = useConvex();

    if(!messagesContext){
        throw new Error("MessagesContext is empty.");
    };

    const{messages, setMessages} = messagesContext;

    if(!userDetailsContext){
        throw new Error("UserDetailsContext is empty.");
    };

    const{userDetails, setUserDetails} = userDetailsContext;

    if(!actionContext){
        throw new Error("Use ActionContext properly with a provider.");
    };

    const{action, setAction} = actionContext;

    const getAiResp = async() => {
        setLoading(true);
        const Prompt = JSON.stringify(messages)+" "+prompt.code_gen_prompt;
        const AiResp: any =  await axios.post("/api/getCode",{
            prompt: Prompt
        });
        
        const mergedFiles = {...files, ...AiResp?.data};
        setFiles(mergedFiles);
        await updateFiles({
            workspaceId: id,
            files: AiResp?.data
        })

        const token = Number(userDetails?.token)-Number(countToken(JSON.stringify(AiResp.data)));

        const updatedDetails = {...userDetails,token}
        setUserDetails(updatedDetails);
                
        await updateToken({
            userId: userDetails?._id,
            token: token
        });

        setLoading(false)     
    };

    useEffect(()=>{
       if(messages?.length > 0){
            const role = messages[messages.length-1].role;
            if(role === "user"){
                getAiResp();
            };
        }
    },[messages]);

    const getFiles = async()=>{
        const result = await convex.query(api.workspace.getWorkspace,{
            workspaceId: id
        });

        const mergedFiles = {...files,...result?.filedata};
        setFiles(mergedFiles);
    };

    useEffect(()=>{
        id && getFiles();
    },[id]);

    useEffect(()=>{
        if(typeof window !== undefined){
            const theme : any = localStorage.getItem("theme")
            setTheme(theme);
        }
    });

    useEffect(()=>{
        setActiveTab("preview");
    },[action])

    return(
        <div>
           {loading === false ?
           <>
                <div className="flex flex-row gap-2 bg-accent py-1 px-2">
                    <h2 onClick={()=>{setActiveTab("preview")}}
                    className={`cursor-pointer p-1 text-sm rounded-2xl ${activeTab === "preview" && "text-blue-500 bg-blue-500/25"}`}>
                        Preview
                    </h2>
                    <h2
                    onClick={()=>{setActiveTab("code")}} 
                    className={`cursor-pointer p-1 text-sm rounded-2xl ${activeTab === "code" && "text-blue-500 bg-blue-500/25"}`}>
                        Code
                    </h2>
                </div>
                <div>
                    <SandpackProvider 
                    template="react" 
                    theme={theme} 
                    customSetup={{
                        dependencies: dependencies.dependencies
                    }}
                    files={files}
                    options={{
                        externalResources: ["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"]
                    }}>
                        <SandpackLayout>
                            {activeTab === "code" ?
                            (<>
                            <SandpackFileExplorer style={{height: "75vh"}}/>
                            <SandpackCodeEditor style={{height: "75vh"}} showLineNumbers={true}/>
                            </>) :
                            <SandpackClient/>}
                        </SandpackLayout>
                    </SandpackProvider>
                </div>
            </> : 
            <div className="p-10 top-0 h-full w-full flex justify-center items-center">
                <Loader content="Generating preview..."/>
            </div>}
        </div>
    )
};
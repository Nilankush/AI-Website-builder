"use client"

import { MessagesContext } from "@/context/messagesContext";
import { UserDetailsContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import prompt from "@/data/prompt";
import { useConvex, useMutation } from "convex/react"
import { ArrowRight, Link } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loader } from "./loader";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "./ui/sidebar";
import axios from "axios";
import { toast } from "sonner";

interface messagesSchema{
    role: "user" | "ai";
    content: string
};

export const countToken = (input: string) => {
    return input.trim().split(/\S+/).filter(word=>word).length;
};

export default function ChatView(){

    const updateWorkspace = useMutation(api.workspace.updateWorkspace);
    const updateToken = useMutation(api.users.updateToken);
    const[userInput, setUserInput] = useState<string>();
    const[loading, setLoading] = useState<boolean>(false)
    const convex = useConvex();
    const messagesContext = useContext(MessagesContext);
    const userDetailContext = useContext(UserDetailsContext);
    const {id}:any= useParams();
    const {toggleSidebar} = useSidebar();

    if(!messagesContext){
        throw new Error("MessagesContext is empty.");
    };
    if(!userDetailContext){
        throw new Error("UserDetailsContext is empty");
    };
    
    const{messages, setMessages} = messagesContext;
    const{userDetails, setUserDetails} = userDetailContext;

    const getWorkspace = async() => {
        const result = await convex.query(api.workspace.getWorkspace,{ workspaceId: id })
        setMessages([...result?.messages]);      
    };

    const getAiResp = async() => {
        setLoading(true);
        const Prompt = JSON.stringify(messages)+prompt.chat_prompt;
        
        const AiResp = await axios.post("/api/getChat",{
            prompt: Prompt
        });
        const updatedMessages: messagesSchema[] = [...messages,{
            role: "ai",
            content: AiResp?.data || ""
        }];
        setMessages(updatedMessages);
        await updateWorkspace({
            workspaceId: id,
            messages: updatedMessages
        });

        const token = Number(userDetails?.token)-Number(countToken(JSON.stringify(AiResp.data)));

        const updatedDetails = {...userDetails,token};
        setUserDetails(updatedDetails);

        await updateToken({
            userId: userDetails?._id,
            token: token
        });
        
        
        setLoading(false);
    };



    useEffect(()=>{
        if(id){
            getWorkspace();            
        }
    },[id]);

    useEffect(()=>{
        if(messages?.length > 0){
            const role = messages[messages.length - 1]?.role;
            if(role === "user"){
                getAiResp();
            }
        };
    },[messages]);

    
    const onGenerate = async(input: string) => {

        if(userDetails.token<100){
            return toast.warning("You don't have enough tokens.",{position: "top-center"});
        };

        const updatedMsg: messagesSchema[] = [...messages,{
            role: "user",
            content: input
        }];

        setMessages(updatedMsg);
        setUserInput("");
    };

    return(
        <div className="relative h-[80vh] flex flex-col">
                {userDetails?.name && 
                <div className="flex md:hidden fixed top-22 left-0 items-end p-1">
                    <Image 
                    onClick={toggleSidebar}
                    src={userDetails?.picture} alt="user" height={30} width={30} 
                    className="rounded-full cursor-pointer"/>
                </div>}
            <div className="flex-1 overflow-y-scroll">
                {messages?.map((msg,index)=>(
                    <div key={index} className="bg-accent rounded-3xl flex flex-row gap-2 p-1 mb-1 mr-1 text-sm">
                        <div>{msg?.role === "user" ? (
                            <Image src={userDetails?.picture} alt="UserPicture" height={30} width={30} className="rounded-full"/>)
                            : null}</div>
                        <ReactMarkdown>{msg?.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && <Loader content="Generating response..."/>}
            </div> 
            <div className="flex">
                {userDetails?.name && 
                <div className="hidden md:flex items-end p-1">
                    <Image 
                    onClick={toggleSidebar}
                    src={userDetails?.picture} alt="user" height={30} width={30} 
                    className="rounded-full cursor-pointer"/>
                </div>}
                <div className="border rounded-2xl p-5 max-w-2xl w-full mt-5">
                    <div className="flex gap-2">
                        <textarea
                        value={userInput}
                        placeholder="Add features..."
                        onChange={(e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>)=>setUserInput(e.target.value)}
                        className="bg-transparent outline-none w-full h-32 resize-none"
                        />
                        {userInput && (
                        <ArrowRight
                        onClick={()=>onGenerate(userInput)}
                        className="bg-blue-500"
                        />
                        )}
                    </div>
                    <Link className="w-5 h-5"/>
                </div>
            </div>   
        </div>
    )
};
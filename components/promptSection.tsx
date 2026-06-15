"use client"

import { MessagesContext } from "@/context/messagesContext";
import { ArrowRight, Link } from "lucide-react";
import { ChangeEvent, useContext, useState } from "react";
import SigninDialog from "./signInDiolog";
import { UserDetailsContext } from "@/context/userDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OpenDialogContext } from "@/context/openDialogContext";

interface messagesSchema {
    role: "user" | "ai";
    content: string
};

export default function PromptSection(){

    const[userInput, setUserInput] = useState<string>();
    const createWorkspace = useMutation(api.workspace.createWorkspace);
    const router = useRouter();
    const openDialogContext = useContext(OpenDialogContext);
    const messageContext = useContext(MessagesContext);
    const userDetailsContext = useContext(UserDetailsContext);

    if(!openDialogContext){
        throw new Error("OpenDialog Contetxt must be used within OpenDialogProvider");
    }

    if (!userDetailsContext) {
        throw new Error("UserDetailsContext must be used within a UserDetailsProvider")
    }

    if (!messageContext) {
        throw new Error("MessagesContext must be used within a MessagesProvider");
    };

    const { userDetails, setUserDetails } = userDetailsContext;
    const { messages, setMessages } = messageContext;
    const {openDialog, setOpenDialog} = openDialogContext;

    const onGenerate = async(Input: string) => {
        if(!userDetails?.name){
            return setOpenDialog(true);
        };

        if(userDetails.token<100){
            return toast.warning("You don't have enough tokens.",{position: "top-center"})
        };

        const msg: messagesSchema = {
            role: "user",
            content: Input
        }
        setMessages([msg]);
        
        const workspaceId = await createWorkspace({
            messages: msg,
            user: userDetails?._id as Id<"users">
        })

        console.log(workspaceId);

        router.push("/workspace/"+workspaceId);
    };

 return(
    <div className="flex flex-col items-center justify-center gap-4 mt-50 px-2">
        <h2 className="text-2xl md:text-5xl font-bold">What will you build today?</h2>
        <p className="font-medium">Create stunning apps & websites by chatting with AI.</p>
        <div className="border rounded-2xl p-5 max-w-2xl w-full mt-5">
            <div className="flex gap-2">
                <textarea
                placeholder="What do you want to build?"
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
        {openDialog && <SigninDialog openDialog={openDialog} closeDialog={setOpenDialog}/>}
    </div>
 );
};
import ChatHistory from "@/components/chatHistory";
import { History } from "lucide-react";

export default function Chat_History(){

    return(
        <div className="flex flex-col justify-center items-center">
            <h1 className="mt-5 flex text-2xl font-bold items-center mb-2"><History/>Chat History</h1>
            <div className="overflow-x-hidden overflow-y-scroll">                
                <ChatHistory/>
            </div>
           
        </div>
    );
};
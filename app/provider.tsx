"use client"

import Header from "@/components/header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";;
import { ThemeProvider } from "@/components/theme-provider";
import { MessagesContext } from "@/context/messagesContext";
import { UserDetailsContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { OpenDialogContext } from "@/context/openDialogContext";
import { useRouter } from "next/navigation";
import { ActionContext } from "@/context/actionContext";

type ProviderProps = {
    children: React.ReactNode;
};

interface messagesSchema {
    role: "user" | "ai";
    content: string
};

interface actionSchema{
    actionType: "export"|"deploy";
    timeStamp: number
};

export default function Provider({ children }: ProviderProps) {

    const convex = useConvex();
    const router = useRouter();

    const authenticate = async() => {
        if(typeof window !== undefined){
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            if(!user){
                router.push("/");
                return;
            };
            const result = await convex.query(api.users.getUser,{email: user?.email});
            if(result){
                setUserDetails(result);
            }; 
         
        };
    };

    useEffect(()=>{
        authenticate();        
    },[])

    const[messages, setMessages] = useState<messagesSchema[]>([]);
    const[userDetails, setUserDetails] = useState<any>();
    const[openDialog, setOpenDialog] = useState<boolean>(false);
    const[action, setAction] = useState<actionSchema|null>(null);

    return(
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "your-default-client-id"}>
            <PayPalScriptProvider options={{ clientId : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_KEY || "" }}>
            <UserDetailsContext.Provider value={{userDetails, setUserDetails}}>
                <OpenDialogContext.Provider value={{openDialog, setOpenDialog}}>
                <MessagesContext.Provider value={{messages, setMessages}}>
                <ActionContext.Provider value={{action, setAction}}>
                    <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    >
                        <Header/>   
                        {children}
                        <Toaster/>        
                    </ThemeProvider>
                </ActionContext.Provider>
                </MessagesContext.Provider>
                </OpenDialogContext.Provider>
            </UserDetailsContext.Provider>
            </PayPalScriptProvider>
            </GoogleOAuthProvider>
        </div>
    )
}
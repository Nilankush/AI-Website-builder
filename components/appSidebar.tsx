"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { HelpCircle, History, LogOut, MessageCircle, Wallet } from "lucide-react"
import ChatHistory from "./chatHistory"
import { useRouter } from "next/navigation"
import { UserDetailsContext } from "@/context/userDetailContext"
import { useContext } from "react"

  
  export function AppSidebar() {

    const router = useRouter();
    const userDetailContext = useContext(UserDetailsContext);
    if(!userDetailContext){
        throw new Error("UserDetailsContext must be used with in UserDetailsContext.Provider");
    };

    const{userDetails, setUserDetails} = userDetailContext;    

    const logOut = () => {
      if(typeof window !== undefined){
        localStorage.removeItem("user");
        setUserDetails({...userDetails,name: "",email:"",picture:"",token:0});
        router.replace("/");
      }
    };

    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mt-2 whitespace-nowrap">AI WEBSITE BUILDER</h2>
            <SidebarTrigger className="cursor-pointer" size={"icon-lg"}/>
          </div>
            <Button onClick={()=>router.push("/")} className="mt-5 mb-5">
                <MessageCircle/>Start New Chat
            </Button>
            <h2 className="flex font-bold"><History/>Chat History</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <ChatHistory/>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button
          onClick={()=>router.push("/Faq_section")}
          variant={"outline"}
          ><HelpCircle/>{" "}Help Center</Button>
          <Button
          onClick={()=>router.push("/Pricing")}
          variant={"outline"}
          ><Wallet/>{" "}Buy Tokens</Button>
          <Button variant={"outline"} onClick={logOut}><LogOut/>{" "}LogOut</Button>
        </SidebarFooter>
      </Sidebar>
    )
  }
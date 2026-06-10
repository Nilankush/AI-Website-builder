"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDetailsContext } from "@/context/userDetailContext"
import { History, Home, LogOut, Wallet2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react"

export function Menu() {

  const router = useRouter();
  const userDetailContext = useContext(UserDetailsContext);
   if(!userDetailContext){
        throw new Error("UserDetailsContext must be used with in UserDetailsContext.Provider")
   };

  const{userDetails, setUserDetails} = userDetailContext;

  const logOut = () => {
    if(typeof window !== undefined){
      localStorage.removeItem("user");
      setUserDetails(null);
      router.push("/")
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {userDetails && 
        <div className="flex items-end p-1">
            <Image
            src={userDetails?.picture} alt="user" height={30} width={30} 
            className="rounded-full cursor-pointer"/>
        </div>}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={()=>router.push("/")}>
            <Home/>Home
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>router.push("/Pricing")}>
            <Wallet2/>Buy Tokens
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>router.push("/Chat_History")}>
            <History/> Chat History
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logOut}>
            <LogOut/> Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

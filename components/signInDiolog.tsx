import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog";
import { useContext } from "react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import { UserDetailsContext } from "@/context/userDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

  interface SignInDialogProps{
    openDialog: boolean;
    closeDialog: (openDialog: boolean) => void;
  };

  interface userSchema{
    name: string;
    email: string;
    picture: string;
    _id: Id<"users">;
    token: number;
  };

  export default function SigninDialog({openDialog, closeDialog}: SignInDialogProps){

    const createUser = useMutation(api.users.createUser);

    const userContext = useContext(UserDetailsContext);
    if (!userContext) {
        throw new Error("UserDetailsContext is null. Ensure the context provider is properly set.");
    }
    const { userDetails, setUserDetails } = userContext;

    const googleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer${tokenResponse?.access_token}` } },
        );
        //save to database
        const user = userInfo?.data;
        const userId = await createUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          token: 10000
         });

        const userData: userSchema = {
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          _id: userId,
          token: 10000
        };

        if(typeof window !== undefined){
          localStorage.setItem("user", JSON.stringify(userData));
         };

        setUserDetails(userData);        
        closeDialog(false);
      },
      onError: errorResponse => console.log(errorResponse),
    });

    return(
        <div>
            <Dialog open={openDialog} onOpenChange={()=>closeDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="flex justify-center">Sign In</DialogTitle>
                    <DialogDescription className="mt-4">
                        To use the app you need to Login to an existing account or you can open a new one.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 flex flex-col items-center justify-center">
                            <Button
                            onClick={()=>googleLogin()} 
                            variant={"outline"}>
                              <FaGoogle/>SignIn with Google
                            </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
  };
import { Id } from "@/convex/_generated/dataModel";
import { createContext } from "react";

interface userSchema {
    name: string;
    email: string;
    picture: string;
    _id: Id<"users">;
    token: number;
}

interface userDetailsSchema {
    userDetails: userSchema;
    setUserDetails: (userDetails: userSchema) => void;
}

export const UserDetailsContext = createContext<userDetailsSchema | null>(null);
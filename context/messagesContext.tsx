import { createContext } from "react";

interface messagesSchema {
    role: "user" | "ai";
    content: string
};

type MessagesContextSchema = {
    messages: messagesSchema[];
    setMessages: (message: messagesSchema[]) => void;
};

export const MessagesContext = createContext<MessagesContextSchema | null>(null);

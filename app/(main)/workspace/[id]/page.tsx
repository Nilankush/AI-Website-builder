import { AppSidebar } from "@/components/appSidebar";
import ChatView from "@/components/chatView";
import CodeView from "@/components/codeView";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Workspace(){
    return(
        <div >
            <SidebarProvider defaultOpen={false}>
                <AppSidebar/>
                <div className="grid grid-cols-1 md:grid-cols-4 p-10 gap-5">
                    <ChatView/>
                    <div className="col-span-3">
                        <CodeView/>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
};
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Faq(){
    return(
        <div className="w-full h-full flex flex-col items-center gap-4 mt-10">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-20 mb-2">FAQs:</h1>
            <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Button variant="link" className="border-2">How to download AI generated code?!</Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col gap-0.5">
                    <div>Click the Export button.It'll open code Sandbox.</div>
                    <div>You can download your code from there.</div>
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Button variant="link" className="border-2">How to share your projects?!</Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col gap-0.5">
                    <div>Click the Export button. It'll open code Sandbox.</div>
                    <div>From there you can share your project link from the preview section.</div>
                    <div>Generally the link looks some thing like: "https://(sandbox.id).csb.app/"</div>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
};
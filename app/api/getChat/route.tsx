import { getAiChat } from "@/config/AiModel";

export async function POST(req: Request) {
    try {
        
        const {prompt} = await req.json();
        
        const aiResp = await getAiChat(prompt);
        const res = aiResp?.text;
        
        
         
        return new Response(JSON.stringify(res),{
            status: 200
        })

    } catch (error) {
        return new Response(JSON.stringify({err: error}),{
            status: 500
        })
    }
}
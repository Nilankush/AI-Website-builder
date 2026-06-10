import { getAiCode } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
    try {
        const {prompt} =  await req.json();

        const aiResp = await getAiCode(prompt);        
        const res = aiResp?.files;              
        
        return new Response(JSON.stringify(res),{
            status: 200
      });  


    } catch (error) {
        return NextResponse.json({err: error},{
            status: 500
        });
        }
}
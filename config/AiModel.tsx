import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});

export async function getAiChat(prompt: any) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: prompt,
    config:{
      responseMimeType: "text/plain"
    }
  });
  return response;
};

export async function getAiCode(prompt: any) {
  const response: any = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: prompt,
    config:{
      responseMimeType: "application/json",
    }
  });
  return (JSON.parse(response?.text));
};









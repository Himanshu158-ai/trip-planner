import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();


export const plannerService = async (prompt) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
    });

    return interaction;
}
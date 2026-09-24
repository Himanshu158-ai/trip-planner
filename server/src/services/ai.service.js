import { GoogleGenAI } from "@google/genai";
import { config } from "../config/config.js";


export const plannerService = async (prompt) => {
    const ai = new GoogleGenAI({ apiKey: config.googleApiKey || '' });

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
    });

    return interaction;
}
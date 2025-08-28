import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

import config from "../config/app.config.js";

const geminiai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY,
});

const deepSeekai = new OpenAI({
    baseURL: "https:/openrouter.ai/api/v1",
    apiKey: config.DEEPSEEK_API_KEY,
});

const qwenai = new OpenAI({
    baseURL: "https:/openrouter.ai/api/v1",
    apiKey: config.QWEN_API_KEY,
});

// GEMINI Flash
export const callGeminiFlash = async function (
    model: string,
    system: string,
    query: string
): Promise<string> {
    const response = await geminiai.models.generateContent({
        model,
        contents: query,
        config: {
            systemInstruction: system,
        },
    });
    return response.text ?? "";
};

// DEEPSEEK
export const callDeepSeek = async function (
    model: string,
    system: string,
    query: string
) {
    const completion = await deepSeekai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: query },
        ],
    });
    return completion.choices[0]?.message.content ?? "";
};

// OPENAI
export const callQwenai = async function (
    model: string,
    system: string,
    query: string
) {
    const completion = await qwenai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: query },
        ],
    });
    return completion.choices[0]?.message.content ?? "";
};

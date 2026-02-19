import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: "Prompt is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY environment variable is not set");
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Using a stable model name
            generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                maxOutputTokens: 2048,
            },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error in gemini function:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

export const config = {
    path: "/api/gemini",
};

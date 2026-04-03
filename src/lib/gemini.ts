import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export const model = "gemini-3-flash-preview";

export async function askAI(prompt: string, systemInstruction?: string) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please add it in the Secrets panel.");
  }

  const response = await genAI.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are a helpful study assistant. Explain concepts clearly and concisely. Use Google Search for accurate, real-time information when needed.",
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}

export async function generateSpeech(text: string) {
  if (!apiKey) throw new Error("API Key missing");

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

export async function generateQuiz(topic: string, count: number = 5) {
  const prompt = `Generate a quiz with ${count} multiple choice questions about "${topic}". Return the response in JSON format with the following structure:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0
      }
    ]
  }`;

  const response = await genAI.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function summarizeText(text: string) {
  const prompt = `Summarize the following study notes into key bullet points and a brief conclusion. Make it easy to read and understand:
  
  ${text}`;

  const response = await genAI.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: "You are a professional academic summarizer. Extract the most important information from the provided text.",
    },
  });

  return response.text;
}

export async function generateExam(className: string, subject: string, count: number = 10) {
  const prompt = `Generate a high-quality MCQ exam for Class ${className} on the subject "${subject}". 
  The exam should have ${count} questions. 
  Return the response in JSON format with the following structure:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0
      }
    ]
  }`;

  const response = await genAI.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

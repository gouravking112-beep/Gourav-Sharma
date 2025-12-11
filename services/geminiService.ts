import { GoogleGenAI, Chat } from "@google/genai";
import { CLARA_SYSTEM_INSTRUCTION_BASE, MODE_SPECIFIC_INSTRUCTIONS } from '../constants';
import { AppMode } from '../types';

let chatInstance: Chat | null = null;
let currentMode: AppMode | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (mode: AppMode) => {
  const ai = getClient();
  
  // Combine base persona with mode-specific instructions
  const systemInstruction = `${CLARA_SYSTEM_INSTRUCTION_BASE}\n\n${MODE_SPECIFIC_INSTRUCTIONS[mode]}`;

  chatInstance = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7, // Balance between creativity and helpfulness
    },
  });
  
  currentMode = mode;
  return chatInstance;
};

export const sendMessageStream = async (message: string, mode: AppMode) => {
  // Re-initialize if mode changed or chat doesn't exist
  if (!chatInstance || currentMode !== mode) {
    initializeChat(mode);
  }

  if (!chatInstance) {
    throw new Error("Failed to initialize chat");
  }

  try {
    const responseStream = await chatInstance.sendMessageStream({ message });
    return responseStream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
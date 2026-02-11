import { GoogleGenAI, Type } from "@google/genai";
import { SERVICE_CATEGORIES } from "../constants";

const apiKey = process.env.API_KEY || ''; // In a real app, handle missing key gracefully
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isGeminiConfigured = () => !!apiKey;

export interface CategoryAnalysisResult {
  categoryId: string | null;
  reasoning: string;
  suggestedSearchTerm: string;
  detectedLocation: string | null;
}

export const analyzeServiceRequest = async (userQuery: string): Promise<CategoryAnalysisResult> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing");
    return { categoryId: null, reasoning: "API Key missing", suggestedSearchTerm: userQuery, detectedLocation: null };
  }

  try {
    const categoriesList = SERVICE_CATEGORIES.map(c => `${c.id} (${c.name})`).join(", ");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: "${userQuery}"
      
      Available Categories: ${categoriesList}
      
      Task: Analyze the user's query.
      1. Map it to the most relevant Service Category ID.
      2. Extract any specific location mentioned (e.g., "Gulberg", "Clifton", "Lahore").
      3. Provide a refined search term.
      
      If no category fits well, return null for categoryId.
      If no location is mentioned, return null for detectedLocation.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryId: { type: Type.STRING, description: "The ID of the matching category or null" },
            reasoning: { type: Type.STRING, description: "Why this category was chosen" },
            suggestedSearchTerm: { type: Type.STRING, description: "A refined short search term" },
            detectedLocation: { type: Type.STRING, description: "Any location entity detected in the prompt" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as CategoryAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { categoryId: null, reasoning: "Error analyzing request", suggestedSearchTerm: userQuery, detectedLocation: null };
  }
};

export const enhanceProviderBio = async (currentBio: string, name: string, profession: string): Promise<string> => {
  if (!apiKey) return currentBio;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a professional profile copywriter for a service marketplace called HireMe in Pakistan.
        Improve the following bio for a service provider. 
        Make it sound trustworthy, professional, and clear. Keep it under 50 words.
        
        Provider Name: ${name}
        Profession: ${profession}
        Current Bio: "${currentBio}"
      `,
    });
    
    return response.text || currentBio;
  } catch (error) {
    console.error("Gemini Bio Enhancement Error:", error);
    return currentBio;
  }
};
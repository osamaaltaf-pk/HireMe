
import { SERVICE_CATEGORIES, CITIES } from "../constants";

// Helper to check if API key is present (Kept for compatibility, always true now as we don't need it)
export const isGeminiConfigured = () => true;

export interface CategoryAnalysisResult {
  categoryId: string | null;
  reasoning: string;
  suggestedSearchTerm: string;
  detectedLocation: string | null;
}

// Simple Keyword "Model"
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  plumbing: ['plumber', 'plumbing', 'leak', 'pipe', 'tap', 'sink', 'water', 'drain', 'faucet', 'flush', 'toilet'],
  electrical: ['electric', 'wiring', 'light', 'fan', 'switch', 'ups', 'generator', 'voltage', 'circuit', 'power', 'bulb'],
  ac_repair: ['ac', 'air cond', 'cooling', 'service', 'gas', 'install', 'split', 'inverter', 'maintenance', 'heat', 'vent'],
  cleaning: ['clean', 'dust', 'maid', 'sweep', 'wash', 'housekeeping', 'janitor', 'sofa', 'carpet', 'deep'],
  auto_mechanic: ['car', 'mechanic', 'auto', 'repair', 'oil', 'engine', 'brake', 'tuning', 'tyre', 'tire', 'vehicle'],
  home_tutor: ['tutor', 'teach', 'study', 'math', 'science', 'school', 'grade', 'exam', 'physics', 'chemistry', 'english']
};

export const analyzeServiceRequest = async (userQuery: string): Promise<CategoryAnalysisResult> => {
  const query = userQuery.toLowerCase();
  
  // 1. Detect Location
  let detectedLocation: string | null = null;
  // Check against known cities
  for (const city of CITIES) {
    if (query.includes(city.toLowerCase())) {
      detectedLocation = city;
      break;
    }
  }
  // Fallback: Check for common areas if no city found (Simple mock for demo)
  if (!detectedLocation) {
    const commonAreas = ['gulberg', 'clifton', 'dha', 'bahria', 'f-10', 'johar'];
    for (const area of commonAreas) {
      if (query.includes(area)) {
        detectedLocation = area.charAt(0).toUpperCase() + area.slice(1); // Capitalize
        break;
      }
    }
  }

  // 2. Detect Category (Scoring System)
  let bestCategory = null;
  let maxScore = 0;

  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(word => {
      if (query.includes(word)) score += 1;
    });
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = catId;
    }
  }

  // 3. Construct Result
  // If no category matched but query exists, we still return a sanitized term
  const cleanTerm = userQuery
    .replace(new RegExp(detectedLocation || '', 'gi'), '') // Remove location from search term
    .replace(/in|at|near|fix|my|i|want|need|someone|to|please/gi, '') // Remove stop words
    .trim();

  return {
    categoryId: bestCategory,
    reasoning: bestCategory ? "Matched keywords in query" : "No specific category matched",
    suggestedSearchTerm: cleanTerm || (bestCategory ? SERVICE_CATEGORIES.find(c => c.id === bestCategory)?.name || '' : userQuery),
    detectedLocation: detectedLocation
  };
};

export const enhanceProviderBio = async (currentBio: string, name: string, profession: string): Promise<string> => {
  // Simple mock enhancement since we removed the LLM
  return `Hi, I'm ${name}, a professional ${profession}. ${currentBio} I am dedicated to providing high-quality service with a focus on customer satisfaction and timely completion. Verified by HireMe.`;
};

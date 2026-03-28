import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface GenerationParams {
  platform: string;
  topic: string;
  keywords?: string[];
}

export async function generateSocialPost({ platform, topic, keywords }: GenerationParams) {
  const prompt = `
    You are an expert Social Media SEO strategist. 
    Generate a highly optimized ${platform} post about "${topic}".
    ${keywords?.length ? `Include these keywords naturally: ${keywords.join(", ")}.` : ""}
    
    Requirements:
    - Platform-specific formatting (e.g., hashtags for IG, professional tone for LI).
    - Engagement-driven lead-in.
    - SEO-friendly title and body.
    - 5-10 relevant hashtags.
    
    Return the response as a JSON object with:
    {
      "title": "string",
      "body": "string",
      "image_prompt": "string",
      "keywords": ["string"],
      "score": "number",
      "hashtags": ["string"],
      "seo_explanation": "string"
    }
  `;

  const result = await aiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean up JSON if necessary (sometimes AI wraps in backticks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error("Failed to parse AI response");
}

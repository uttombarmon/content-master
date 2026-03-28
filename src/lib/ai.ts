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
    - **CRITICAL: Do not use markdown like asterisks (**) for bolding or lists. Use plain text only.**
    
    Return the response as a JSON object with:
    {
      "title": "string (Compelling, SEO-optimized title)",
      "body": "string (The full post content)",
      "image_prompt": "string (A descriptive prompt for an AI image generator)",
      "keywords": ["string"] (List of 3-5 primary keywords),
      "score": number (SEO score from 0-100),
      "hashtags": ["string"] (Relevant hashtags),
      "seo_explanation": "string (Structured as 'Analysis: [brief insight]. Recommendations: [actionable step].')"
    }
  `;

  const result = await aiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean up JSON if necessary (sometimes AI wraps in backticks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    
    // Sanitize text to remove asterisks if any remain
    const sanitize = (str: string) => str.replace(/\*/g, "");
    if (data.title) data.title = sanitize(data.title);
    if (data.body) data.body = sanitize(data.body);
    
    return data;
  }
  
  throw new Error("Failed to parse AI response");
}

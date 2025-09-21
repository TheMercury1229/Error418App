// Gemini AI Content Enhancement Service
interface ContentEnhancementRequest {
  title: string;
  description: string;
  tags: string;
  videoFileName?: string;
  context?: string;
}

interface ContentEnhancementResponse {
  success: boolean;
  enhancedTitle: string;
  enhancedDescription: string;
  enhancedTags: string;
  error?: string;
}

/**
 * Enhance YouTube video content using Gemini AI
 * @param content - Original title, description, and tags
 * @returns Enhanced content optimized for YouTube
 */
export async function enhanceContentWithAI(
  content: ContentEnhancementRequest
): Promise<ContentEnhancementResponse> {
  try {
    const response = await fetch("/api/enhance-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to enhance content");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Content enhancement error:", error);
    return {
      success: false,
      enhancedTitle: content.title,
      enhancedDescription: content.description,
      enhancedTags: content.tags,
      error: error.message || "Failed to enhance content",
    };
  }
}

/**
 * Generate content suggestions based on video file name only
 * @param fileName - Video file name
 * @returns AI-generated content suggestions
 */
export async function generateContentFromFileName(
  fileName: string
): Promise<ContentEnhancementResponse> {
  const baseTitle = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return enhanceContentWithAI({
    title: baseTitle,
    description: "",
    tags: "",
    videoFileName: fileName,
    context: "generate_from_filename",
  });
}

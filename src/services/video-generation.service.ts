import axios from "axios";

const API_BASE_URL =
  "https://video-generation-orchestrator-1051522129986.us-central1.run.app";

export interface VideoGenerationApiResponse {
  message: string;
  video_url: string;
  video_uri: string;
  prompt: string;
}

export interface VideoGenerationApiRequest {
  image: File;
  prompt: string;
}

export class VideoGenerationService {
  private static instance: VideoGenerationService;

  private constructor() {}

  public static getInstance(): VideoGenerationService {
    if (!VideoGenerationService.instance) {
      VideoGenerationService.instance = new VideoGenerationService();
    }
    return VideoGenerationService.instance;
  }

  async generateVideo(
    request: VideoGenerationApiRequest
  ): Promise<VideoGenerationApiResponse> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", request.image);
      formData.append("prompt", request.prompt);

      console.log("Sending video generation request:", {
        prompt: request.prompt,
        imageSize: request.image.size,
        imageName: request.image.name,
      });

      // Create axios instance with longer timeout and retry logic
      const axiosInstance = axios.create({
        timeout: 0, // Disable timeout completely for long-running requests
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Add additional configurations for better reliability
        maxRedirects: 5,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const response = await axiosInstance.post<VideoGenerationApiResponse>(
        `${API_BASE_URL}`,
        formData
      );

      console.log("Video generation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Video generation failed:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error("Video generation is taking longer than expected. The process may still be running on the server. Please try again in a few minutes.");
        }
        
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new Error("Network connection error. Please check your internet connection and try again.");
        }
        
        if (error.response?.status === 413) {
          throw new Error("Image file is too large. Please try with a smaller image (under 10MB).");
        }
        
        if (error.response && error.response.status >= 500) {
          throw new Error("Server error occurred during video generation. Please try again later.");
        }
        
        const message = error.response?.data?.message || error.message;
        throw new Error(`Video generation failed: ${message}`);
      }

      throw new Error("Video generation failed: Unknown error");
    }
  }
}

export const videoGenerationService = VideoGenerationService.getInstance();

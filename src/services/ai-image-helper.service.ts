export interface AIImageHelperResponse {
  success: boolean;
  imageBlob?: Blob;
  caption?: string;
  error?: string;
}

export interface AIImageHelperRequest {
  prompt: string;
  image_url?: string;
}

export class AIImageHelperService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use provided URL, environment variable, or default
    this.baseUrl = baseUrl ||
                   (typeof process !== 'undefined' && process.env?.AI_API_URL) ||
                   'https://apiimage-441399025512.europe-west1.run.app';
  }

  async processImage(request: AIImageHelperRequest): Promise<AIImageHelperResponse> {
    try {
      console.log('Calling AI Artisan Post API:', {
        url: this.baseUrl,
        prompt: request.prompt,
        image_url: request.image_url
      });

      const response = await fetch(`${this.baseUrl}/create_artisan_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI Artisan Post API error: ${response.status} ${response.statusText}`);
      }

      // Get the caption from response headers if available
      const caption = response.headers.get('X-Caption') || undefined;

      // Convert the response to a blob (raw image bytes)
      const imageBlob = await response.blob();

      console.log('AI Artisan Post response:', {
        success: true,
        contentType: response.headers.get('Content-Type'),
        blobSize: imageBlob.size,
        blobType: imageBlob.type,
        caption: caption
      });

      return {
        success: true,
        imageBlob: imageBlob,
        caption: caption,
      };
    } catch (error) {
      console.error('AI Artisan Post error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Create object URL from blob for preview
  blobToObjectURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // Helper method to create a blob from image bytes (for compatibility)
  createImageBlob(imageBytes: ArrayBuffer, mimeType: string = 'image/jpeg'): Blob {
    return new Blob([imageBytes], { type: mimeType });
  }

  // Configure the API base URL at runtime
  setApiUrl(url: string): void {
    this.baseUrl = url;
  }

  // Get the current API URL
  getApiUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const aiImageHelperService = new AIImageHelperService();
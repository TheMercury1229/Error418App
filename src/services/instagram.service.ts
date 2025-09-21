export interface InstagramApiResponse {
  success: boolean;
  message?: string;
  container_id?: string;
  media_id?: string;
  error?: string;
}

export interface InstagramAnalyticsResponse {
  success: boolean;
  data?: {
    media_id: string;
    media_type: string;
    analytics: {
      reach: number;
      likes: number;
      comments: number;
      shares: number;
      saved: number;
      views: number;
    };
    raw_analytics: {
      data: Array<{
        name: string;
        period: string;
        values: Array<{ value: number }>;
      }>;
    };
    comments: {
      data: Array<any>;
    };
    media_info: {
      id: string;
      media_type: string;
      media_url: string;
      permalink: string;
      timestamp: string;
      caption: string;
    };
  };
  error?: string;
}

export interface InstagramPageAnalyticsResponse {
  success: boolean;
  data?: {
    account_id: string;
    account_analytics: {
      follower_count: {
        value: number;
        end_time: string;
      };
      reach: {
        value: number;
        end_time: string;
      };
      profile_views: {
        value: number;
        end_time: string;
      };
      website_clicks: {
        value: number;
        end_time: string;
      };
      accounts_engaged: {
        value: number;
        end_time: string;
      };
      total_interactions: {
        value: number;
        end_time: string;
      };
    };
    account_info: {
      id: string;
      username: string;
      name: string;
      biography: string;
      followers_count: number;
      follows_count: number;
      media_count: number;
      profile_picture_url: string;
      website: string;
    };
    recent_media: {
      data: Array<{
        id: string;
        media_type: string;
        media_url: string;
        permalink: string;
        timestamp: string;
        caption: string;
        like_count: number;
        comments_count: number;
      }>;
    };
    influencer_metrics: {
      total_posts_analyzed: number;
      average_engagement_per_post: number;
      engagement_rate_percentage: number;
      total_engagement_last_12_posts: number;
    };
  };
  usage_info?: {
    period_options: string[];
    date_format: string;
    time_series_metrics: string[];
    total_value_metrics: string[];
  };
  influencer_dashboard_ready?: boolean;
  error?: string;
}

export interface InstagramHealthResponse {
  status: string;
  service: string;
  credentials_configured: boolean;
}

export class InstagramService {
  private baseUrl = 'https://instaapi-441399025512.europe-west1.run.app';

  constructor() {
    // No authentication needed - API uses server-side credentials
  }

  private async makeRequest(action: string, data: any = {}): Promise<any> {
    const url = this.baseUrl;

    try {
      // Use POST request with JSON payload as per API documentation
      const payload = { action, ...data };

      console.log('Making Instagram API request to:', url);
      console.log('Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the HTTP status
          console.warn('Could not parse error response:', parseError);
        }

        throw new Error(`Instagram API Error: ${errorMessage}`);
      }

      const result = await response.json();

      // Validate the response structure
      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid response format from Instagram API');
      }

      return result;
    } catch (error) {
      console.error('Instagram API request failed:', error);

      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Instagram API. Please check your internet connection.');
      }

      if (error instanceof Error) {
        // Re-throw with additional context if needed
        throw error;
      }

      throw new Error('Unknown error occurred while communicating with Instagram API');
    }
  }

  // Health check
  async healthCheck(): Promise<InstagramHealthResponse> {
    try {
      const result = await this.makeRequest('health_check');
      return result;
    } catch (error) {
      const errorInfo = this.getErrorInfo(error);
      return {
        status: 'unhealthy',
        service: 'instagram_api',
        credentials_configured: false,
      };
    }
  }

  // Post a photo to Instagram
  async postPhoto(imageUrl: string, caption: string = ''): Promise<InstagramApiResponse> {
    // Validate input data
    const validation = this.validatePostData(imageUrl, caption);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    try {
      const result = await this.makeRequest('post_photo', {
        image_url: imageUrl,
        caption: caption,
      });

      return result;
    } catch (error) {
      const errorInfo = this.getErrorInfo(error);
      return {
        success: false,
        error: errorInfo.userMessage,
      };
    }
  }

  // Post a video or reel to Instagram
  async postVideo(videoUrl: string, caption: string = '', isReel: boolean = true): Promise<InstagramApiResponse> {
    // Validate input data
    const validation = this.validatePostData(videoUrl, caption);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    try {
      const result = await this.makeRequest('post_video', {
        video_url: videoUrl,
        caption: caption,
        is_reel: isReel,
      });

      return result;
    } catch (error) {
      const errorInfo = this.getErrorInfo(error);
      return {
        success: false,
        error: errorInfo.userMessage,
      };
    }
  }

  // Get analytics for a specific post
  async getAnalytics(mediaId: string): Promise<InstagramAnalyticsResponse> {
    try {
      const result = await this.makeRequest('get_analytics', {
        media_id: mediaId,
      });
      return result;
    } catch (error) {
      const errorInfo = this.getErrorInfo(error);
      return {
        success: false,
        error: errorInfo.userMessage,
      };
    }
  }

  // Get page analytics (account overview)
  async getPageAnalytics(): Promise<InstagramPageAnalyticsResponse> {
    try {
      const result = await this.makeRequest('get_page_analytics', {});
      return result;
    } catch (error) {
      const errorInfo = this.getErrorInfo(error);
      return {
        success: false,
        error: errorInfo.userMessage,
      };
    }
  }

  // Helper method to post content based on file type
  async postContent(mediaUrl: string, caption: string = '', isVideo: boolean = false): Promise<InstagramApiResponse> {
    if (isVideo) {
      return this.postVideo(mediaUrl, caption, true); // Default to reel
    } else {
      return this.postPhoto(mediaUrl, caption);
    }
  }

  // Check if the API is healthy and ready
  async isReady(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      console.log('Health check response:', health);

      // For now, just check if the API is responding (status is healthy)
      // You can adjust this logic based on your API's actual response
      return health.status === 'healthy';
    } catch (error) {
      console.error('Instagram API health check failed:', error);
      return false;
    }
  }

  // Get detailed error information
  getErrorInfo(error: any): {
    message: string;
    type: 'network' | 'api' | 'validation' | 'unknown' | 'server_down';
    retryable: boolean;
    userMessage: string;
    title: string;
  } {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: error.message,
        type: 'network',
        retryable: true,
        userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
        title: 'Connection Failed',
      };
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('required') || message.includes('invalid')) {
        return {
          message: error.message,
          type: 'validation',
          retryable: false,
          userMessage: error.message,
          title: 'Invalid Input',
        };
      }

      if (message.includes('api') || message.includes('server') || message.includes('503') || message.includes('502') || message.includes('500')) {
        return {
          message: error.message,
          type: 'server_down',
          retryable: true,
          userMessage: 'The Instagram API service is currently down. This usually resolves automatically within a few minutes. Please try again later.',
          title: 'Service Temporarily Unavailable',
        };
      }

      if (message.includes('timeout') || message.includes('408')) {
        return {
          message: error.message,
          type: 'api',
          retryable: true,
          userMessage: 'The request timed out. The Instagram API might be experiencing high traffic. Please try again in a moment.',
          title: 'Request Timeout',
        };
      }
    }

    return {
      message: error?.message || 'Unknown error occurred',
      type: 'unknown',
      retryable: true,
      userMessage: 'An unexpected error occurred while communicating with Instagram. Please try again.',
      title: 'Unexpected Error',
    };
  }

  // Validate post data before sending
  validatePostData(imageUrl: string, caption?: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!imageUrl || typeof imageUrl !== 'string') {
      errors.push('Image URL is required and must be a valid string');
    } else if (!imageUrl.startsWith('http')) {
      errors.push('Image URL must be a valid HTTP/HTTPS URL');
    }

    if (caption && caption.length > 2200) {
      errors.push('Caption must be 2200 characters or less');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
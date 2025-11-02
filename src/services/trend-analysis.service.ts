/**
 * Trend Analysis Service
 * Provides insights into trending topics for various creative domains
 */

export type Domain =
  | "handloom"
  | "dancing"
  | "singing"
  | "painting"
  | "pottery"
  | "embroidery"
  | "woodwork"
  | "jewellery"
  | "metalwork"
  | "leatherwork"
  | "stonecraft"
  | "weaving"
  | "puppet_art"
  | "calligraphy"
  | "ceramics"
  | "paper_craft"
  | "folk_music"
  | "music"
  | "movie_songs"
  | "pop_music"
  | "indie_music";

export type Region = "IN" | "global";

export interface TrendAnalysisRequest {
  domain: Domain;
  region: Region;
}

export interface TopVideo {
  videoId: string;
  title: string;
  channel: string;
  publishedAt: string;
  views: number;
  url: string;
}

export interface TrendTopic {
  rank: number;
  topic: string;
  description: string;
  trend_score: number;
  view_score: number;
  composite_score: number;
  top_video: TopVideo;
}

export interface TrendAnalysisResponse {
  domain: Domain;
  region: Region;
  generated_at: string;
  top_topics: TrendTopic[];
}

export interface TrendApiError {
  error: string;
  status?: number;
}

/**
 * Fetches trending topics for a specific domain and region
 */
export async function fetchTrendAnalysis(
  request: TrendAnalysisRequest
): Promise<TrendAnalysisResponse | TrendApiError> {
  const API_URL =
    "https://trend-insight-service-1051522129986.us-central1.run.app";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    return data as TrendAnalysisResponse;
  } catch (error) {
    console.error("Trend analysis API error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch trend analysis",
    };
  }
}

/**
 * Domain display names for UI
 */
export const DOMAIN_LABELS: Record<Domain, string> = {
  handloom: "Handloom",
  dancing: "Dancing",
  singing: "Singing",
  painting: "Painting",
  pottery: "Pottery",
  embroidery: "Embroidery",
  woodwork: "Woodwork",
  jewellery: "Jewellery",
  metalwork: "Metalwork",
  leatherwork: "Leatherwork",
  stonecraft: "Stonecraft",
  weaving: "Weaving",
  puppet_art: "Puppet Art",
  calligraphy: "Calligraphy",
  ceramics: "Ceramics",
  paper_craft: "Paper Craft",
  folk_music: "Folk Music",
  music: "Music",
  movie_songs: "Movie Songs",
  pop_music: "Pop Music",
  indie_music: "Indie Music",
};

/**
 * Region display names for UI
 */
export const REGION_LABELS: Record<Region, string> = {
  IN: "India",
  global: "Global",
};

/**
 * Domain categories for better organization in UI
 */
export const DOMAIN_CATEGORIES = {
  "Traditional Crafts": [
    "handloom",
    "pottery",
    "embroidery",
    "woodwork",
    "jewellery",
    "metalwork",
    "leatherwork",
    "stonecraft",
    "weaving",
    "ceramics",
    "paper_craft",
  ] as Domain[],
  "Performing Arts": ["dancing", "singing", "puppet_art"] as Domain[],
  "Visual Arts": ["painting", "calligraphy"] as Domain[],
  Music: [
    "music",
    "folk_music",
    "movie_songs",
    "pop_music",
    "indie_music",
  ] as Domain[],
};

/**
 * Format view count for display
 */
export function formatViewCount(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K`;
  }
  return views.toString();
}

/**
 * Format trend score as percentage
 */
export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

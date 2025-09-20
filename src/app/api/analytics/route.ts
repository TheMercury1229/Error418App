import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { mockYouTubeData } from "@/features/dashboard/mock-data/youtube-data";

const TOKEN_PATH = path.join(os.tmpdir(), "token.json");
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

export async function GET() {
  console.log("Analytics API called");

  // Check if authenticated first
  if (!fs.existsSync(TOKEN_PATH)) {
    console.log("No token file found at", TOKEN_PATH);
    return NextResponse.json(
      { error: "Not authenticated with YouTube", authenticated: false },
      { status: 401 }
    );
  }

  // For prototype: use mock data if configured
  if (USE_MOCK_DATA) {
    console.log("Using mock YouTube data for development");
    return NextResponse.json({ ...mockYouTubeData, authenticated: true });
  }

  try {
    // Read tokens from file
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));

    console.log("Token data read successfully:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiry: tokenData.expiry_date
        ? new Date(tokenData.expiry_date).toISOString()
        : null,
    });

    // Check if token is expired
    const isExpired =
      tokenData.expiry_date && Date.now() > tokenData.expiry_date;

    // Initialize OAuth client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // If token is expired and we have a refresh token, refresh it
    if (isExpired && tokenData.refresh_token) {
      try {
        oAuth2Client.setCredentials({
          refresh_token: tokenData.refresh_token,
        });

        const { credentials } = await oAuth2Client.refreshAccessToken();

        // Save the refreshed tokens
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));

        oAuth2Client.setCredentials(credentials);
        console.log("Token refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return NextResponse.json(
          { error: "Authentication expired", authenticated: false },
          { status: 401 }
        );
      }
    } else {
      // Just set the existing credentials
      oAuth2Client.setCredentials(tokenData);
    }

    console.log("Creating YouTube API clients");
    const youtubeData = google.youtube({ version: "v3", auth: oAuth2Client });
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oAuth2Client,
    });

    console.log("Fetching channel data");
    // Fix part parameter to use array format as required by the API
    const channelResp = await youtubeData.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });
    const channel = channelResp.data.items?.[0];

    console.log("Channel data fetched successfully");

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    console.log("Fetching analytics data");
    const analyticsResp = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate: thirtyDaysAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
      metrics: "views,likes,subscribersGained,estimatedMinutesWatched",
      dimensions: "day",
      sort: "day",
    });

    console.log("Analytics data fetched successfully");
    console.log(analyticsResp.data);
    return NextResponse.json({
      channel,
      analytics: analyticsResp.data,
      authenticated: true,
    });
  } catch (err) {
    console.error("YouTube API error:", err);

    // If there's an auth error, mark as not authenticated
    const error = err as Error;
    const isAuthError =
      error.message?.includes("auth") ||
      error.message?.includes("Authentication") ||
      error.message?.includes("401");

    if (isAuthError) {
      console.log("Auth error detected, attempting to clear token file");
      try {
        // On auth errors, try to remove the token file to force re-authentication
        if (fs.existsSync(TOKEN_PATH)) {
          fs.unlinkSync(TOKEN_PATH);
          console.log("Token file removed due to auth error");
        }
      } catch (e) {
        console.error("Failed to remove token file:", e);
      }
    }

    return NextResponse.json(
      {
        error: "Analytics fetch failed: " + (error.message || "Unknown error"),
        authenticated: !isAuthError,
        errorDetails: {
          message: error.message,
          isAuthError,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

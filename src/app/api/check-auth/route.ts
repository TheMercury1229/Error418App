import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import { NextResponse } from "next/server";

// Use the temp directory for token storage
const TOKEN_PATH = path.join(os.tmpdir(), "token.json");

export async function GET() {
  try {
    // Check if token file exists
    const tokenExists = fs.existsSync(TOKEN_PATH);

    if (!tokenExists) {
      return NextResponse.json({ authenticated: false });
    }

    // Read the token file
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));

    // Check if we have valid tokens
    const hasValidTokens = !!tokenData.access_token;

    console.log("Token validation:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiry: tokenData.expiry_date
        ? new Date(tokenData.expiry_date).toISOString()
        : null,
    });

    // Check if the access token is expired
    const isExpired =
      tokenData.expiry_date && Date.now() > tokenData.expiry_date;

    // If expired but we have a refresh token, try to refresh
    if (isExpired && tokenData.refresh_token) {
      try {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_CLIENT_SECRET!,
          process.env.GOOGLE_REDIRECT_URI!
        );

        oAuth2Client.setCredentials({
          refresh_token: tokenData.refresh_token,
        });

        const { credentials } = await oAuth2Client.refreshAccessToken();

        // Save the new tokens
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));

        return NextResponse.json({
          authenticated: true,
          tokenInfo: {
            hasAccessToken: true,
            hasRefreshToken: !!credentials.refresh_token,
            expiry: credentials.expiry_date
              ? new Date(credentials.expiry_date).toISOString()
              : null,
            refreshed: true,
          },
        });
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return NextResponse.json({
          authenticated: false,
          error: "Token expired and refresh failed",
        });
      }
    }

    return NextResponse.json({
      authenticated: hasValidTokens && !isExpired,
      tokenInfo: hasValidTokens
        ? {
            hasAccessToken: !!tokenData.access_token,
            hasRefreshToken: !!tokenData.refresh_token,
            expiry: tokenData.expiry_date
              ? new Date(tokenData.expiry_date).toISOString()
              : null,
            isExpired,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { error: "Failed to check authentication status", authenticated: false },
      { status: 500 }
    );
  }
}

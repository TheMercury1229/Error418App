import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import { NextResponse } from "next/server";

// Use the temp directory for token storage
const TOKEN_PATH = path.join(os.tmpdir(), "token.json");

export async function GET() {
  try {
    // Debug output
    const debug: {
      tokenPath: string;
      tokenExists: boolean;
      env: {
        hasClientId: boolean;
        hasClientSecret: boolean;
        hasRedirectUri: boolean;
        redirectUri: string | undefined;
        nodeEnv: "development" | "production" | "test" | undefined;
      };
      osTempDir: string;
      token?: {
        hasAccessToken: boolean;
        hasRefreshToken: boolean;
        expiry: string | null;
        isExpired: boolean;
        tokenType: string;
        scope: string;
      };
      tokenReadError?: string;
    } = {
      tokenPath: TOKEN_PATH,
      tokenExists: fs.existsSync(TOKEN_PATH),
      env: {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        nodeEnv: process.env.NODE_ENV,
      },
      osTempDir: os.tmpdir(),
    };

    // Add token data if available
    if (debug.tokenExists) {
      try {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
        debug.token = {
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          expiry: tokenData.expiry_date
            ? new Date(tokenData.expiry_date).toISOString()
            : null,
          isExpired:
            tokenData.expiry_date && Date.now() > tokenData.expiry_date,
          tokenType: tokenData.token_type,
          scope: tokenData.scope,
        };
      } catch (e) {
        debug.tokenReadError = (e as Error).message;
      }
    }

    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json(
      { error: "Debug failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

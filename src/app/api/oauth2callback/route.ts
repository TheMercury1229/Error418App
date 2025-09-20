import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// Use temp directory for token storage in serverless environments
const TOKEN_PATH = path.join(os.tmpdir(), "token.json");

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code)
    return NextResponse.redirect(new URL("/dashboard?auth=error", req.url));

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  try {
    console.log("Exchanging code for tokens");
    const { tokens } = await oAuth2Client.getToken(code);

    // Ensure we have all required tokens
    if (!tokens.access_token) {
      console.error("No access token received");
      return NextResponse.redirect(new URL("/dashboard?auth=error", req.url));
    }

    // Log token info (without sensitive data)
    console.log("Received tokens:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiry: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      tokenType: tokens.token_type,
    });

    oAuth2Client.setCredentials(tokens);

    // Store in temp directory for serverless compatibility
    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log("Tokens saved to:", TOKEN_PATH);

      // Verify tokens were saved correctly
      if (fs.existsSync(TOKEN_PATH)) {
        const savedTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
        console.log("Tokens verification:", {
          hasAccessToken: !!savedTokens.access_token,
          hasRefreshToken: !!savedTokens.refresh_token,
          tokenPath: TOKEN_PATH,
        });
      }
    } catch (writeError) {
      console.error("Error saving tokens:", writeError);
      return NextResponse.redirect(new URL("/dashboard?auth=error", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard?auth=success", req.url));
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(new URL("/dashboard?auth=error", req.url));
  }
}

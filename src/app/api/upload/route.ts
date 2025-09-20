import fs from "fs";
import path from "path";
import os from "os";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// Use the temp directory for token storage in serverless environments
const TOKEN_PATH = path.join(os.tmpdir(), "token.json");

export async function POST(req: NextRequest) {
  console.log("Upload API called");

  try {
    // Check if authenticated
    if (!fs.existsSync(TOKEN_PATH)) {
      console.log("No token file found at", TOKEN_PATH);
      return NextResponse.json(
        { error: "Not authenticated with YouTube", authenticated: false },
        { status: 401 }
      );
    }

    console.log("Token file exists at", TOKEN_PATH);

    // Read the token
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
      console.log("Token expired, attempting refresh");
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

    // Initialize YouTube API
    console.log("Creating YouTube API client");
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    // Parse the multipart form data
    console.log("Parsing form data");
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { error: "Failed to parse form data" },
        { status: 400 }
      );
    }

    const videoFile = formData.get("video") as File | null;

    if (!videoFile) {
      console.log("No video file found in form data, using test file");
      // For prototype: use a temp file if no upload provided
      const tempDir = os.tmpdir();
      const mediaFile = path.join(tempDir, "generated_video.mp4");

      // Check if we need to create a dummy video file for testing
      if (!fs.existsSync(mediaFile)) {
        console.warn(
          "Video file not found, creating a tiny test file for prototype purposes"
        );
        // Create an empty MP4 file (won't actually work with YouTube API, just for testing)
        const minimalMP4Header = Buffer.from([
          0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34,
          0x32, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x70, 0x34, 0x32, 0x69, 0x73,
          0x6f, 0x6d,
        ]);
        fs.writeFileSync(mediaFile, minimalMP4Header);
      }

      // Use the existing file
      const videoStream = fs.createReadStream(mediaFile);

      console.log("Uploading test video to YouTube");
      const response = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
          snippet: {
            title: "Uploaded from Next.js 15 TS",
            description: "Test upload",
            tags: ["nextjs", "youtube", "api"],
            categoryId: "22",
          },
          status: { privacyStatus: "private" },
        },
        media: { body: videoStream },
      });

      console.log("Test video uploaded successfully:", response.data.id);

      return NextResponse.json({
        success: true,
        videoId: response.data.id,
        url: `https://www.youtube.com/watch?v=${response.data.id}`,
      });
    }

    // Get metadata from the form
    console.log("Processing uploaded video with metadata");
    const title =
      (formData.get("title") as string) || "Uploaded from Next.js App";
    const description =
      (formData.get("description") as string) || "Video uploaded via API";
    const tagsString = formData.get("tags") as string;
    const tags = tagsString
      ? tagsString.split(",").map((tag) => tag.trim())
      : ["nextjs", "api"];
    const privacyStatus =
      (formData.get("privacyStatus") as string) || "private";

    // Convert File to buffer and stream
    console.log("Converting file to stream");
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Mark the end of the stream

    // Upload to YouTube
    console.log("Uploading video to YouTube:", {
      title,
      size: buffer.length,
      privacyStatus,
    });

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "22", // Entertainment category
        },
        status: {
          privacyStatus: privacyStatus as "private" | "public" | "unlisted",
        },
      },
      media: {
        body: stream,
      },
    });

    console.log("Video uploaded successfully:", response.data.id);

    return NextResponse.json({
      success: true,
      videoId: response.data.id,
      url: `https://www.youtube.com/watch?v=${response.data.id}`,
    });
  } catch (error) {
    console.error("YouTube upload error:", error);

    // Handle error
    const err = error as Error;
    const isAuthError =
      err.message?.includes("auth") ||
      err.message?.includes("Authentication") ||
      err.message?.includes("401");

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
        error: "Upload failed: " + (err.message || "Unknown error"),
        authenticated: !isAuthError,
        errorDetails: {
          message: err.message,
          isAuthError,
          stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

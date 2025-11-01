import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export interface CollaboratorMatch {
  clerkId: string;
  displayName: string | null;
  bio: string | null;
  email: string | null;
  website: string | null;
  primaryPlatforms: string[];
  contentGenres: string[];
  targetAudience: string | null;
  subscribersTotal: number;
  similarity: number; // percentage match (0-100)
  lastActive: Date;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const rangePercent = parseInt(url.searchParams.get("range") || "20");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // For now, return mock collaborators for demonstration
    // TODO: Replace with real data once users have YouTube analytics synced

    // Use a base subscriber count for demo purposes
    const mySubscribers = 25000; // Demo value
    const lowerBound = Math.floor(mySubscribers * (1 - rangePercent / 100));
    const upperBound = Math.ceil(mySubscribers * (1 + rangePercent / 100));

    // Mock collaborators for demonstration (replace with real DB query later)
    const mockCollaborators = [
      {
        clerkId: "demo_user_1",
        displayName: "Sarah Chen",
        bio: "Tech reviewer and lifestyle content creator focusing on productivity tools and home office setups.",
        email: "sarah.chen.creator@email.com",
        website: "https://sarahchen.tech",
        primaryPlatforms: ["YouTube", "Instagram", "TikTok"],
        contentGenres: ["Technology", "Lifestyle", "Productivity"],
        targetAudience: "Young professionals",
        subscribersTotal: 28500,
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        clerkId: "demo_user_2",
        displayName: "Mike Rodriguez",
        bio: "Food enthusiast creating quick recipes for busy people. Specializing in 15-minute meals and meal prep.",
        email: "mike.food.creator@email.com",
        website: "https://quickbites.com",
        primaryPlatforms: ["YouTube", "Instagram"],
        contentGenres: ["Food", "Cooking", "Lifestyle"],
        targetAudience: "Working adults",
        subscribersTotal: 22800,
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        clerkId: "demo_user_3",
        displayName: "Emma Johnson",
        bio: "Fitness coach and wellness advocate. Helping people build sustainable healthy habits from home.",
        email: "emma.wellness@email.com",
        website: "https://emmawellness.fit",
        primaryPlatforms: ["YouTube", "Instagram", "Facebook"],
        contentGenres: ["Fitness", "Health", "Wellness"],
        targetAudience: "Health-conscious individuals",
        subscribersTotal: 26200,
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    // Calculate similarity scores and format response
    const collaborators: CollaboratorMatch[] = mockCollaborators.map(
      (collab: any) => {
        const subscriberDiff = Math.abs(
          collab.subscribersTotal - mySubscribers
        );
        const maxDiff = Math.max(mySubscribers, collab.subscribersTotal);
        const similarity =
          maxDiff > 0
            ? Math.max(0, 100 - (subscriberDiff / maxDiff) * 100)
            : 100;

        return {
          clerkId: collab.clerkId,
          displayName: collab.displayName,
          bio: collab.bio,
          email: collab.email,
          website: collab.website,
          primaryPlatforms: collab.primaryPlatforms || [],
          contentGenres: collab.contentGenres || [],
          targetAudience: collab.targetAudience,
          subscribersTotal: collab.subscribersTotal,
          similarity: Math.round(similarity * 100) / 100,
          lastActive: collab.lastActive,
        };
      }
    );

    return NextResponse.json({
      success: true,
      mySubscribers,
      searchRange: { min: lowerBound, max: upperBound },
      collaborators,
    });
  } catch (error) {
    console.error("Error finding collaborators:", error);
    return NextResponse.json(
      { error: "Failed to find collaborators" },
      { status: 500 }
    );
  }
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  TrendingUp,
  MapPin,
  Verified,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react";

interface Influencer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followerCount: number;
  engagementRate: number;
  location: string;
  niches: string[];
  verified: boolean;
  bio: string;
  avgLikes: number;
  avgComments: number;
  recentPosts: string[];
  collaborationRate: string;
  responseRate: number;
  tags: string[];
}

interface InfluencerCardProps {
  influencer: Influencer;
  onConnect: () => void;
}

export function InfluencerCard({ influencer, onConnect }: InfluencerCardProps) {
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 6) return "text-green-600 dark:text-green-400";
    if (rate >= 4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-muted/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={influencer.avatar} alt={influencer.name} />
              <AvatarFallback>
                {influencer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {influencer.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <Verified className="h-3 w-3 text-white fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">
                {influencer.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {influencer.username}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">
                {influencer.location}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-lg font-bold">
              {formatFollowerCount(influencer.followerCount)}
            </div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>

          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <div
              className={`text-lg font-bold ${getEngagementColor(
                influencer.engagementRate
              )}`}
            >
              {influencer.engagementRate}%
            </div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        {/* Average Performance */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span className="text-muted-foreground">Avg:</span>
            <span className="font-medium">
              {influencer.avgLikes.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">Avg:</span>
            <span className="font-medium">{influencer.avgComments}</span>
          </div>
        </div>

        {/* Niches */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Niches</div>
          <div className="flex flex-wrap gap-1">
            {influencer.niches.map((niche, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {niche}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {influencer.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-0.5 border-primary/30 text-primary"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Bio</div>
          <p className="text-xs leading-relaxed line-clamp-2">
            {influencer.bio}
          </p>
        </div>

        {/* Collaboration Rate */}
        <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
          <div className="text-xs text-green-700 dark:text-green-300 font-medium">
            {influencer.collaborationRate}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            {influencer.responseRate}% response rate
          </div>
        </div>

        {/* Recent Posts Preview */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Recent Posts</div>
          <div className="grid grid-cols-3 gap-1">
            {influencer.recentPosts.slice(0, 3).map((post, index) => (
              <div
                key={index}
                className="aspect-square bg-muted/50 rounded border overflow-hidden"
              >
                <img
                  src={post}
                  alt={`Recent post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Connect Button */}
        <Button
          onClick={onConnect}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}

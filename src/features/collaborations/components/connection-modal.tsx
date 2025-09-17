"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  TrendingUp,
  MapPin,
  Verified,
  Send,
  Star,
  DollarSign,
  Calendar,
  Target,
  MessageSquare,
  ExternalLink,
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

interface ConnectionModalProps {
  influencer: Influencer | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string, budget: string, timeline: string) => void;
}

const BUDGET_OPTIONS = [
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Negotiable",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "Within 3 months",
  "Flexible",
];

export function ConnectionModal({
  influencer,
  isOpen,
  onClose,
  onSendMessage,
}: ConnectionModalProps) {
  const [message, setMessage] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedBudget || !selectedTimeline) return;

    setIsSending(true);
    try {
      await onSendMessage(message, selectedBudget, selectedTimeline);
      setMessage("");
      setSelectedBudget("");
      setSelectedTimeline("");
      onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

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

  if (!influencer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Connect with {influencer.name}
          </DialogTitle>
          <DialogDescription>
            Send a collaboration proposal to this influencer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Influencer Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={influencer.avatar}
                      alt={influencer.name}
                    />
                    <AvatarFallback>
                      {influencer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {influencer.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Verified className="h-4 w-4 text-white fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{influencer.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {influencer.username}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {influencer.location}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="font-bold text-lg">
                        {formatFollowerCount(influencer.followerCount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Followers
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div
                        className={`font-bold text-lg ${getEngagementColor(
                          influencer.engagementRate
                        )}`}
                      >
                        {influencer.engagementRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Engagement
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="font-bold text-lg text-green-600">
                        {influencer.responseRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Response
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {influencer.niches.map((niche, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {niche}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Budget Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Budget Range</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_OPTIONS.map((budget) => (
                <Button
                  key={budget}
                  variant={selectedBudget === budget ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBudget(budget)}
                  className="justify-start text-sm"
                >
                  {budget}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Timeline</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINE_OPTIONS.map((timeline) => (
                <Button
                  key={timeline}
                  variant={
                    selectedTimeline === timeline ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeline(timeline)}
                  className="justify-start text-sm"
                >
                  {timeline}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">
                Collaboration Message
              </label>
            </div>
            <Textarea
              placeholder={`Hi ${influencer.name}! I'd love to collaborate with you on an exciting project. Here's what I have in mind...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {message.length}/500 characters
            </div>
          </div>

          {/* Collaboration Rate Info */}
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              {influencer.collaborationRate}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Based on {influencer.responseRate}% response rate and recent
              activity
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={
                !message.trim() ||
                !selectedBudget ||
                !selectedTimeline ||
                isSending
              }
              className="flex-1"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Proposal
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                window.open(
                  `https://instagram.com/${influencer.username}`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

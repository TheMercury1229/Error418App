"use client";

import React from "react";
import {
  TrendAnalysisResponse,
  formatViewCount,
  formatScore,
  DOMAIN_LABELS,
  REGION_LABELS,
} from "@/services/trend-analysis.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Eye,
  TrendingUp,
  Calendar,
  ExternalLink,
  Youtube,
} from "lucide-react";
import { format } from "date-fns";

interface TrendResultsProps {
  data: TrendAnalysisResponse;
}

export function TrendResults({ data }: TrendResultsProps) {
  const { domain, region, generated_at, top_topics } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics: {DOMAIN_LABELS[domain]}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Generated on {format(new Date(generated_at), "PPP")} •{" "}
                {REGION_LABELS[region]}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {top_topics.length} Topics Found
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Trends List */}
      <div className="space-y-4">
        {top_topics.map((topic) => (
          <Card key={topic.rank} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 p-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm">
                    {topic.rank}
                  </div>
                  <div>
                    <CardTitle className="text-lg capitalize">
                      {topic.topic}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {topic.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatScore(topic.composite_score)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Composite Score
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trend Score
                    </span>
                    <span className="font-medium">
                      {formatScore(topic.trend_score)}
                    </span>
                  </div>
                  <Progress value={topic.trend_score * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      View Score
                    </span>
                    <span className="font-medium">
                      {formatScore(topic.view_score)}
                    </span>
                  </div>
                  <Progress value={topic.view_score * 100} className="h-2" />
                </div>
              </div>

              {/* Top Video */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Top Performing Video
                    </h4>
                    <p className="font-semibold truncate">
                      {topic.top_video.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Youtube className="h-3 w-3" />
                        {topic.top_video.channel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViewCount(topic.top_video.views)} views
                      </span>
                      <span>
                        {format(
                          new Date(topic.top_video.publishedAt),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => window.open(topic.top_video.url, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      {top_topics.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No trending topics found for this domain and region combination.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

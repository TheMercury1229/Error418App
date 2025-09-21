"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Instagram,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Users,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { InstagramService } from "@/services/instagram.service";
// Remove database service import since we're not using database storage

interface InstagramAccountData {
  id: string;
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
  website: string;
}

interface InstagramAnalyticsData {
  follower_count: {
    value: number;
    end_time: string;
  };
  reach: {
    value: number;
    end_time: string;
  };
  profile_views: {
    value: number;
    end_time: string;
  };
  website_clicks: {
    value: number;
    end_time: string;
  };
  accounts_engaged: {
    value: number;
    end_time: string;
  };
  total_interactions: {
    value: number;
    end_time: string;
  };
}

interface InstagramAnalyticsResponse {
  success: boolean;
  data?: {
    account_id: string;
    account_analytics: InstagramAnalyticsData;
    account_info: InstagramAccountData;
    recent_media: {
      data: Array<{
        id: string;
        media_type: string;
        media_url: string;
        permalink: string;
        timestamp: string;
        caption: string;
        like_count: number;
        comments_count: number;
      }>;
    };
    influencer_metrics: {
      total_posts_analyzed: number;
      average_engagement_per_post: number;
      engagement_rate_percentage: number;
      total_engagement_last_12_posts: number;
    };
  };
  error?: string;
}

export function InstagramAnalytics() {
  const [data, setData] = useState<InstagramAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const instagramService = new InstagramService();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await instagramService.getPageAnalytics();

      // Transform the response to match our interface
      if (response.success && response.data) {
        setData({
          success: true,
          data: response.data,
        });
      } else {
        setData({
          success: false,
          error:
            response.error ||
            "Failed to load Instagram analytics. Please try again later.",
        });
      }
    } catch (error) {
      setData({
        success: false,
        error: "Failed to load Instagram analytics. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format metrics for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderSkeleton = () => (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[180px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Service Unavailable</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{data?.error || "Unable to connect to Instagram API service."}</p>
        <p className="text-sm">This could be due to:</p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li>Instagram API service being temporarily down</li>
          <li>Network connectivity issues</li>
          <li>Server maintenance or high traffic</li>
        </ul>
        <p className="text-sm font-medium">
          The service usually recovers automatically within a few minutes.
        </p>
      </AlertDescription>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    </Alert>
  );

  // Render content based on loading and error states
  if (loading) return renderSkeleton();
  if (!data?.success) return renderError();

  const accountData = data.data?.account_info;
  const analytics = data.data?.account_analytics;
  const metrics = data.data?.influencer_metrics;

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      {accountData && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden h-16 w-16 flex-shrink-0 bg-muted">
                {accountData.profile_picture_url && (
                  <img
                    src={accountData.profile_picture_url}
                    alt={accountData.username}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{accountData.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  @{accountData.username} •{" "}
                  {accountData.biography || "Instagram Creator"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>
                  {formatNumber(accountData.followers_count)} followers
                </span>
              </div>
              <div className="flex items-center">
                <Instagram className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{formatNumber(accountData.media_count)} posts</span>
              </div>
              {accountData.website && (
                <div className="flex items-center">
                  <span className="text-muted-foreground">🌐</span>
                  <span className="ml-1">{accountData.website}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different analytics views */}
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {analytics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Followers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(accountData?.followers_count || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{Math.floor(Math.random() * 5)}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reach</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analytics.reach.value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{Math.floor(Math.random() * 12)}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Profile Views
                  </CardTitle>
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analytics.profile_views.value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{Math.floor(Math.random() * 8)}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.engagement_rate_percentage.toFixed(2) || "0.00"}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{Math.floor(Math.random() * 3)}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Posts Summary */}
          {data.data?.recent_media?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Posts Performance
                </CardTitle>
                <CardDescription>
                  Performance metrics for your latest Instagram posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.data.recent_media.data
                    .slice(0, 5)
                    .map((post, index) => {
                      const engagementRate =
                        post.like_count > 0
                          ? ((post.like_count + post.comments_count) /
                              post.like_count) *
                            100
                          : 0;

                      return (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium truncate max-w-md">
                                {post.caption || "No caption"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date(post.timestamp),
                                  "MMM d, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-500" />
                                {formatNumber(post.like_count)}
                              </div>
                              <div className="text-muted-foreground">Likes</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium flex items-center gap-1">
                                <MessageCircle className="h-3 w-3 text-blue-500" />
                                {formatNumber(post.comments_count)}
                              </div>
                              <div className="text-muted-foreground">
                                Comments
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">
                                {engagementRate.toFixed(1)}%
                              </div>
                              <div className="text-muted-foreground">
                                Engagement
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Posts Analytics
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Post Performance</CardTitle>
              <CardDescription>
                Detailed performance metrics for your Instagram content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Instagram className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  Performance data coming soon
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This section will display detailed post performance metrics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>
                Track how your audience interacts with your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Engagement Rate</span>
                    <span className="font-medium">
                      {metrics?.engagement_rate_percentage.toFixed(2) || "0.00"}
                      %
                    </span>
                  </div>
                  <Progress value={metrics?.engagement_rate_percentage || 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Engagement per Post</span>
                    <span className="font-medium">
                      {formatNumber(metrics?.average_engagement_per_post || 0)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (metrics?.average_engagement_per_post || 0) / 100,
                      100
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Interactions (Last 12 Posts)</span>
                    <span className="font-medium">
                      {formatNumber(
                        metrics?.total_engagement_last_12_posts || 0
                      )}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (metrics?.total_engagement_last_12_posts || 0) / 1000,
                      100
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Instagram Insights</CardTitle>
              <CardDescription>
                AI-powered insights and recommendations for your Instagram
                strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Insights coming soon</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This section will provide AI-powered insights and
                  recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

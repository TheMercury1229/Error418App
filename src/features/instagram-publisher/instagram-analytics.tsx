"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Eye,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  RefreshCw,
  Calendar,
  Users,
  Activity,
  Target,
} from "lucide-react";
import { InstagramService } from "@/services/instagram.service";
import { instagramDbService } from "@/services/instagram-db.service";

interface InstagramAnalyticsProps {
  mediaId?: string;
  clerkId: string;
}

interface AnalyticsData {
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  views: number;
  engagementRate: number;
}

interface PostAnalytics {
  mediaId: string;
  mediaType: string;
  analytics: AnalyticsData;
  mediaInfo: any;
  timestamp: string;
}

interface AccountAnalytics {
  followerCount: number;
  reach: number;
  profileViews: number;
  websiteClicks: number;
  accountsEngaged: number;
  totalInteractions: number;
  engagementRate: number;
  averageEngagementPerPost: number;
  totalEngagementLast12Posts: number;
  totalPostsAnalyzed: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function InstagramAnalytics({ mediaId, clerkId }: InstagramAnalyticsProps) {
  const [postAnalytics, setPostAnalytics] = useState<PostAnalytics | null>(null);
  const [accountAnalytics, setAccountAnalytics] = useState<AccountAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const instagramService = new InstagramService();

  useEffect(() => {
    if (mediaId) {
      loadPostAnalytics();
    }
    loadAccountAnalytics();
  }, [mediaId, clerkId]);

  const loadPostAnalytics = async () => {
    if (!mediaId) return;

    setLoading(true);
    setError(null);

    try {
      // Try to get from API first
      const response = await instagramService.getAnalytics(mediaId);

      if (response.success && response.data) {
        const data = response.data;
        const analytics: AnalyticsData = {
          reach: data.analytics.reach,
          likes: data.analytics.likes,
          comments: data.analytics.comments,
          shares: data.analytics.shares,
          saved: data.analytics.saved,
          views: data.analytics.views,
          engagementRate: data.analytics.reach > 0
            ? ((data.analytics.likes + data.analytics.comments + data.analytics.shares + data.analytics.saved) / data.analytics.reach) * 100
            : 0,
        };

        setPostAnalytics({
          mediaId: data.media_id,
          mediaType: data.media_type,
          analytics,
          mediaInfo: data.media_info,
          timestamp: data.media_info.timestamp,
        });

        // Save to database
        await instagramDbService.syncInstagramPostFromApiResponse(response, clerkId);
      } else {
        // Try to get from database
        const dbPost = await instagramDbService.getInstagramPostByMediaId(mediaId, clerkId);
        if (dbPost) {
          setPostAnalytics({
            mediaId: dbPost.mediaId,
            mediaType: dbPost.mediaType,
            analytics: {
              reach: dbPost.reach,
              likes: dbPost.likes,
              comments: dbPost.comments,
              shares: dbPost.shares,
              saved: dbPost.saved,
              views: dbPost.views,
              engagementRate: dbPost.reach > 0
                ? ((dbPost.likes + dbPost.comments + dbPost.shares + dbPost.saved) / dbPost.reach) * 100
                : 0,
            },
            mediaInfo: dbPost.mediaInfo,
            timestamp: dbPost.timestamp.toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Failed to load post analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadAccountAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from API first
      const response = await instagramService.getPageAnalytics();

      if (response.success && response.data) {
        const data = response.data;
        setAccountAnalytics({
          followerCount: data.account_info.followers_count,
          reach: data.account_analytics.reach.value,
          profileViews: data.account_analytics.profile_views.value,
          websiteClicks: data.account_analytics.website_clicks.value,
          accountsEngaged: data.account_analytics.accounts_engaged.value,
          totalInteractions: data.account_analytics.total_interactions.value,
          engagementRate: data.influencer_metrics.engagement_rate_percentage,
          averageEngagementPerPost: data.influencer_metrics.average_engagement_per_post,
          totalEngagementLast12Posts: data.influencer_metrics.total_engagement_last_12_posts,
          totalPostsAnalyzed: data.influencer_metrics.total_posts_analyzed,
        });

        // Save to database
        await instagramDbService.syncInstagramAccountFromApiResponse(response, clerkId);
      } else {
        // Try to get from database
        const dbAccount = await instagramDbService.getInstagramAccount(clerkId);
        if (dbAccount) {
          setAccountAnalytics({
            followerCount: dbAccount.followersCount,
            reach: dbAccount.profileViews, // Using profileViews as reach fallback
            profileViews: dbAccount.profileViews,
            websiteClicks: dbAccount.websiteClicks,
            accountsEngaged: dbAccount.accountsEngaged,
            totalInteractions: dbAccount.totalInteractions,
            engagementRate: dbAccount.engagementRatePercentage || 0,
            averageEngagementPerPost: dbAccount.averageEngagementPerPost || 0,
            totalEngagementLast12Posts: dbAccount.totalEngagementLast12Posts,
            totalPostsAnalyzed: dbAccount.totalPostsAnalyzed,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load account analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load account analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="text-sm font-medium">{error}</span>
            <Button onClick={() => {
              if (mediaId) loadPostAnalytics();
              loadAccountAnalytics();
            }} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Account Overview</TabsTrigger>
          <TabsTrigger value="post" disabled={!mediaId}>
            {mediaId ? 'Post Analytics' : 'Select Post'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {accountAnalytics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(accountAnalytics.followerCount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                        <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reach</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(accountAnalytics.reach)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                        <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold">
                          {accountAnalytics.engagementRate.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                        <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(accountAnalytics.averageEngagementPerPost)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(accountAnalytics.totalInteractions)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Interactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(accountAnalytics.profileViews)}
                      </div>
                      <div className="text-sm text-muted-foreground">Profile Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatNumber(accountAnalytics.websiteClicks)}
                      </div>
                      <div className="text-sm text-muted-foreground">Website Clicks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="post" className="space-y-6">
          {postAnalytics && (
            <>
              {/* Post Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{postAnalytics.mediaType}</Badge>
                    Post Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Posted on</p>
                      <p className="font-medium">{formatDate(postAnalytics.timestamp)}</p>
                    </div>
                    {postAnalytics.mediaInfo?.permalink && (
                      <div>
                        <p className="text-sm text-muted-foreground">View on Instagram</p>
                        <a
                          href={postAnalytics.mediaInfo.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {postAnalytics.mediaInfo.permalink}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Post Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{formatNumber(postAnalytics.analytics.reach)}</div>
                    <div className="text-sm text-muted-foreground">Reach</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-5 w-5 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold">{formatNumber(postAnalytics.analytics.likes)}</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{formatNumber(postAnalytics.analytics.comments)}</div>
                    <div className="text-sm text-muted-foreground">Comments</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Share className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{formatNumber(postAnalytics.analytics.shares)}</div>
                    <div className="text-sm text-muted-foreground">Shares</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Bookmark className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold">{formatNumber(postAnalytics.analytics.saved)}</div>
                    <div className="text-sm text-muted-foreground">Saves</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{postAnalytics.analytics.engagementRate.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
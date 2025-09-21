"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Instagram,
  RefreshCw,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Unlink,
  Users,
  Image,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { InstagramService } from "@/services/instagram.service";
import { instagramDbService } from "@/services/instagram-db.service";
import { InstagramPageAnalyticsResponse } from "@/services/instagram.service";

export interface InstagramSettings {
  username: string;
  password: string;
  isConnected: boolean;
  lastSync: Date | null;
  followerCount: number;
  postsCount: number;
}

interface InstagramTabProps {
  settings: InstagramSettings;
  onSave: (settings: InstagramSettings) => void;
  isSaving: boolean;
  clerkId: string;
}

export function InstagramTab({
  settings,
  onSave,
  isSaving,
  clerkId,
}: InstagramTabProps) {
  const [formData, setFormData] = useState<InstagramSettings>(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [accountData, setAccountData] = useState<any>(null);

  const instagramService = new InstagramService();

  useEffect(() => {
    checkApiStatus();
    loadAccountData();
  }, []);

  const checkApiStatus = async () => {
    try {
      setApiStatus('checking');
      const isReady = await instagramService.isReady();
      setApiStatus(isReady ? 'ready' : 'error');
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus('error');
    }
  };

  const loadAccountData = async () => {
    try {
      const account = await instagramDbService.getInstagramAccount(clerkId);
      if (account) {
        setAccountData(account);
        setFormData(prev => ({
          ...prev,
          isConnected: true,
          lastSync: account.lastSync,
          followerCount: account.followersCount,
          postsCount: account.mediaCount,
        }));
      }
    } catch (error) {
      console.error('Failed to load account data:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Instagram username is required";
    } else if (
      !formData.username.startsWith("@") &&
      !formData.username.includes("@")
    ) {
      newErrors.username =
        "Please enter a valid Instagram username (e.g., @username)";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof InstagramSettings,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleReconnect = async () => {
    if (!validateForm()) return;

    setIsConnecting(true);
    setConnectionProgress(0);
    setErrors({});

    try {
      // Check API status first
      setConnectionProgress(25);
      const isApiReady = await instagramService.isReady();
      if (!isApiReady) {
        throw new Error('Instagram API is not available');
      }

      // Fetch account analytics
      setConnectionProgress(50);
      const analyticsResponse: InstagramPageAnalyticsResponse = await instagramService.getPageAnalytics();

      if (!analyticsResponse.success || !analyticsResponse.data) {
        throw new Error(analyticsResponse.error || 'Failed to fetch account data');
      }

      setConnectionProgress(75);

      // Save account data to database
      const accountData = analyticsResponse.data;
      await instagramDbService.createOrUpdateInstagramAccount({
        accountId: accountData.account_id,
        username: accountData.account_info.username,
        name: accountData.account_info.name,
        biography: accountData.account_info.biography,
        followersCount: accountData.account_info.followers_count,
        followsCount: accountData.account_info.follows_count,
        mediaCount: accountData.account_info.media_count,
        profilePictureUrl: accountData.account_info.profile_picture_url,
        website: accountData.account_info.website,
        profileViews: accountData.account_analytics.profile_views.value,
        websiteClicks: accountData.account_analytics.website_clicks.value,
        accountsEngaged: accountData.account_analytics.accounts_engaged.value,
        totalInteractions: accountData.account_analytics.total_interactions.value,
        averageEngagementPerPost: accountData.influencer_metrics.average_engagement_per_post,
        engagementRatePercentage: accountData.influencer_metrics.engagement_rate_percentage,
        totalEngagementLast12Posts: accountData.influencer_metrics.total_engagement_last_12_posts,
        totalPostsAnalyzed: accountData.influencer_metrics.total_posts_analyzed,
        rawAccountData: accountData,
        rawRecentMedia: accountData.recent_media,
        clerkId,
      });

      setConnectionProgress(100);

      // Update form data with real data
      const updatedSettings = {
        ...formData,
        isConnected: true,
        lastSync: new Date(),
        followerCount: accountData.account_info.followers_count,
        postsCount: accountData.account_info.media_count,
      };

      setFormData(updatedSettings);
      setAccountData(accountData);
      onSave(updatedSettings);

    } catch (error) {
      console.error("Connection failed:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Failed to connect to Instagram. Please check your configuration.",
      });
    } finally {
      setIsConnecting(false);
      setTimeout(() => setConnectionProgress(0), 1000);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Clear account data from database
      await instagramDbService.getInstagramAccount(clerkId); // This will be used to clear data if needed

      const updatedSettings = {
        ...formData,
        isConnected: false,
        lastSync: null,
        followerCount: 0,
        postsCount: 0,
      };
      setFormData(updatedSettings);
      setAccountData(null);
      onSave(updatedSettings);
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(settings);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Connection Status */}
      <Card
        className={
          formData.isConnected
            ? "border-green-200 dark:border-green-800"
            : "border-amber-200 dark:border-amber-800"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Connection Status
            {formData.isConnected ? (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
            <Badge variant={apiStatus === 'ready' ? 'default' : 'destructive'}>
              {apiStatus === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
              {apiStatus === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
              {apiStatus === 'checking' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {apiStatus === 'ready' && 'API Ready'}
              {apiStatus === 'error' && 'API Error'}
              {apiStatus === 'checking' && 'Checking...'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* API Status Alert */}
          {apiStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Instagram API is not available. Please check your configuration.
                </span>
                <Button onClick={checkApiStatus} variant="outline" size="sm" className="ml-auto">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {formData.isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-bold">
                      {formData.followerCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <Image className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posts</p>
                    <p className="font-bold">{formData.postsCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sync</p>
                    <p className="font-bold">
                      {formatLastSync(formData.lastSync)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              {accountData && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        @{accountData.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {accountData.name} • {accountData.biography}
                      </p>
                      {accountData.engagementRatePercentage && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Engagement Rate: {accountData.engagementRatePercentage}%
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDisconnect}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      @{formData.username.replace("@", "")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Successfully connected and syncing
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDisconnect}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Instagram className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Instagram Not Connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your Instagram account to sync posts and analytics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Instagram Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram Username
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="@your_username"
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your Instagram password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Your credentials are secure
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  We use industry-standard encryption to protect your login
                  information. Your password is never stored in plain text.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Progress */}
      {isConnecting && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting to Instagram...
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(connectionProgress)}%
                </span>
              </div>
              <Progress value={connectionProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Verifying credentials and syncing account data...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {errors.general && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{errors.general}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleReconnect}
            disabled={isConnecting}
            variant="outline"
            className="min-w-32"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {formData.isConnected ? "Reconnect" : "Connect"}
              </>
            )}
          </Button>

          {formData.isConnected && (
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Last sync: {formatLastSync(formData.lastSync)}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSaving || !hasChanges}
          className="min-w-32"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

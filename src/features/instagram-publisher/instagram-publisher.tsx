"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Instagram,
  Upload,
  Image,
  Video,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react";
import { InstagramService } from "@/services/instagram.service";
import { instagramDbService } from "@/services/instagram-db.service";

interface InstagramPublisherProps {
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  initialCaption?: string;
  onPublishSuccess?: (result: any) => void;
  onPublishError?: (error: string) => void;
  clerkId?: string;
}

export function InstagramPublisher({
  mediaUrl,
  mediaType,
  initialCaption = '',
  onPublishSuccess,
  onPublishError,
  clerkId = 'user123', // TODO: Get from auth context
}: InstagramPublisherProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const instagramService = new InstagramService();

  useEffect(() => {
    checkApiStatus();
    if (mediaUrl) {
      setPreviewUrl(mediaUrl);
    }
  }, [mediaUrl]);

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

  const handlePublish = async () => {
    if (!previewUrl) {
      setError('No media selected for publishing');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption for your post');
      return;
    }

    if (apiStatus !== 'ready') {
      setError('Instagram API is not available');
      return;
    }

    setIsPublishing(true);
    setError(null);
    setSuccess(null);
    setPublishProgress(0);

    try {
      // Start publishing process
      setPublishProgress(25);

      let result;
      if (mediaType === 'video') {
        result = await instagramService.postVideo(previewUrl, caption, true);
      } else {
        result = await instagramService.postPhoto(previewUrl, caption);
      }

      setPublishProgress(75);

      if (result.success) {
        setPublishProgress(100);

        try {
          // Save post to database
          if (result.media_id) {
            await instagramDbService.createInstagramPost({
              mediaId: result.media_id,
              containerId: result.container_id,
              mediaType: mediaType === 'video' ? 'VIDEO' : 'IMAGE',
              mediaUrl: previewUrl,
              caption: caption,
              clerkId: clerkId,
            });

            console.log('Instagram post saved to database:', result.media_id);
          }
        } catch (dbError) {
          console.error('Failed to save post to database:', dbError);
          // Don't fail the entire operation if database save fails
          // This is expected if Prisma client is not properly generated
        }

        setSuccess(`Successfully published to Instagram! Media ID: ${result.media_id}`);

        if (onPublishSuccess) {
          onPublishSuccess(result);
        }
      } else {
        throw new Error(result.error || 'Publishing failed');
      }

    } catch (error) {
      console.error('Publishing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish to Instagram';
      setError(errorMessage);

      if (onPublishError) {
        onPublishError(errorMessage);
      }
    } finally {
      setIsPublishing(false);
      setTimeout(() => setPublishProgress(0), 1000);
    }
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);

        // Upload file to get public URL
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/instagram-upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success && result.url) {
          // Use the public URL for Instagram API
          setPreviewUrl(result.url);
          console.log('Image uploaded successfully:', result.url);
        } else {
          setError(`Upload failed: ${result.error || 'Unknown error'}`);
          // Keep the preview URL for display but show error
          console.error('Upload error details:', result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const isReady = apiStatus === 'ready' && previewUrl && caption.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Instagram className="h-8 w-8 text-pink-600" />
            Instagram Publisher
          </h1>
          <p className="text-muted-foreground">
            Publish photos and videos directly to Instagram
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={apiStatus === 'ready' ? 'default' : 'destructive'}>
            {apiStatus === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
            {apiStatus === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
            {apiStatus === 'checking' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            {apiStatus === 'ready' && 'API Ready'}
            {apiStatus === 'error' && 'API Error'}
            {apiStatus === 'checking' && 'Checking...'}
          </Badge>
        </div>
      </div>

      {/* API Status Alert */}
      {apiStatus === 'error' && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <div className="flex-1">
                <p className="text-sm font-medium">Instagram API Service Unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The Instagram API service is currently down. This could be due to:
                </p>
                <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc">
                  <li>Server maintenance or high traffic</li>
                  <li>API service temporarily unavailable</li>
                  <li>Network connectivity issues</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-1">
                  The service usually recovers automatically within a few minutes.
                </p>
              </div>
              <Button onClick={checkApiStatus} variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Media Upload & Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Media Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Upload Media</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a photo or video to publish to Instagram
                </p>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {mediaType === 'video' ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: '300px' }}
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full rounded-lg"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setPreviewUrl(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {mediaType === 'video' ? <Video className="h-3 w-3 mr-1" /> : <Image className="h-3 w-3 mr-1" />}
                    {mediaType === 'video' ? 'Video' : 'Image'}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput?.click();
                  }}>
                    Change Media
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Caption & Publishing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your Instagram caption here..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {caption.length}/2200 characters
              </p>
            </div>

            {/* Character Count Warning */}
            {caption.length > 2000 && (
              <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Caption is getting long. Consider shortening it.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Publishing Progress */}
      {isPublishing && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing to Instagram...
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(publishProgress)}%
                </span>
              </div>
              <Progress value={publishProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Uploading media and publishing to Instagram...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Publishing Failed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {error.includes('API') || error.includes('server') || error.includes('503') || error.includes('502') || error.includes('500')
                      ? 'The Instagram API service is currently unavailable. Please try again in a few minutes.'
                      : error.includes('Network') || error.includes('fetch')
                      ? 'Network connection failed. Please check your internet connection.'
                      : error
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handlePublish} variant="outline" size="sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button onClick={clearError} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Display */}
      {success && (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{success}</span>
              </div>
              <Button onClick={clearSuccess} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePublish}
          disabled={!isReady || isPublishing}
          size="lg"
          className="min-w-48"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Instagram className="h-5 w-5 mr-2" />
              Publish to Instagram
            </>
          )}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleMediaUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Trash2,
  Eye,
  Calendar,
  FileImage,
  Video,
  HardDrive,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface GeneratedMedia {
  id: string;
  fileName: string;
  originalName?: string;
  mediaType: "IMAGE" | "VIDEO";
  fileSize?: number;
  cloudinaryUrl: string;
  prompt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface MediaStats {
  totalImages: number;
  totalVideos: number;
  totalSize: number;
  recentCount: number;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [media, setMedia] = useState<GeneratedMedia[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mediaResponse, statsResponse] = await Promise.all([
        fetch("/api/media"),
        fetch("/api/media/stats"),
      ]);

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        setMedia(mediaData.media || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats || null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    setDeleting(mediaId);
    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMedia((prev) => prev.filter((item) => item.id !== mediaId));
        toast.success("Media deleted successfully");
        // Refresh stats
        const statsResponse = await fetch("/api/media/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats || null);
        }
      } else {
        toast.error("Failed to delete media");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete media");
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const images = media.filter((item) => item.mediaType === "IMAGE");
  const videos = media.filter((item) => item.mediaType === "VIDEO");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="text-2xl">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Images
              </CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Videos
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVideos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Used
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(stats.totalSize)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent (7 days)
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Media Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({media.length})</TabsTrigger>
              <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
              <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <MediaGrid
                media={media}
                onDownload={handleDownload}
                onDelete={handleDelete}
                deleting={deleting}
                formatDate={formatDate}
                formatFileSize={formatFileSize}
              />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <MediaGrid
                media={images}
                onDownload={handleDownload}
                onDelete={handleDelete}
                deleting={deleting}
                formatDate={formatDate}
                formatFileSize={formatFileSize}
              />
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <MediaGrid
                media={videos}
                onDownload={handleDownload}
                onDelete={handleDelete}
                deleting={deleting}
                formatDate={formatDate}
                formatFileSize={formatFileSize}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface MediaGridProps {
  media: GeneratedMedia[];
  onDownload: (url: string, fileName: string) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
  formatDate: (date: string) => string;
  formatFileSize: (size: number) => string;
}

function MediaGrid({
  media,
  onDownload,
  onDelete,
  deleting,
  formatDate,
  formatFileSize,
}: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No media found</p>
        <p className="text-sm text-muted-foreground">
          Start generating some images or videos to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
            {item.mediaType === "IMAGE" ? (
              <Image
                src={item.cloudinaryUrl}
                alt={item.fileName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <Badge
              className="absolute top-2 left-2"
              variant={item.mediaType === "IMAGE" ? "default" : "secondary"}
            >
              {item.mediaType}
            </Badge>
          </div>

          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold truncate" title={item.fileName}>
                {item.originalName || item.fileName}
              </h3>
              {item.prompt && (
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  title={item.prompt}
                >
                  {item.prompt}
                </p>
              )}
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.createdAt)}
              </div>
              {item.fileSize && (
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {formatFileSize(item.fileSize)}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onDownload(item.cloudinaryUrl, item.fileName)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(item.id)}
                disabled={deleting === item.id}
              >
                {deleting === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

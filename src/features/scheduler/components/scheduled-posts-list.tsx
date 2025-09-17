"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

// Mock data for scheduled posts
const scheduledPostsData = [
  {
    id: 1,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Tips for better social media engagement and building authentic connections with your audience...",
    scheduledDate: new Date(2025, 8, 18, 9, 0), // Sep 18, 2025 at 9:00 AM
    status: "scheduled" as const,
    platform: "Instagram",
    hashtags: ["#socialmedia", "#tips", "#engagement"],
  },
  {
    id: 2,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Behind the scenes of our content creation process and how we stay consistent...",
    scheduledDate: new Date(2025, 8, 18, 15, 30), // Sep 18, 2025 at 3:30 PM
    status: "scheduled" as const,
    platform: "LinkedIn",
    hashtags: ["#contentcreation", "#productivity", "#business"],
  },
  {
    id: 3,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Weekend inspiration: How to find balance between work and personal life...",
    scheduledDate: new Date(2025, 8, 20, 12, 0), // Sep 20, 2025 at 12:00 PM
    status: "draft" as const,
    platform: "Instagram",
    hashtags: ["#weekend", "#inspiration", "#worklife"],
  },
  {
    id: 4,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Monday motivation: Start your week with these productivity hacks...",
    scheduledDate: new Date(2025, 8, 22, 10, 0), // Sep 22, 2025 at 10:00 AM
    status: "scheduled" as const,
    platform: "Twitter",
    hashtags: ["#monday", "#motivation", "#productivity"],
  },
  {
    id: 5,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Successfully published! Check out our latest carousel post about design trends...",
    scheduledDate: new Date(2025, 8, 15, 14, 0), // Sep 15, 2025 at 2:00 PM
    status: "published" as const,
    platform: "Instagram",
    hashtags: ["#design", "#trends", "#creative"],
  },
  {
    id: 6,
    thumbnail: "/api/placeholder/60/60",
    caption:
      "Quick tutorial on creating engaging video content for social media...",
    scheduledDate: new Date(2025, 8, 25, 16, 0), // Sep 25, 2025 at 4:00 PM
    status: "draft" as const,
    platform: "TikTok",
    hashtags: ["#tutorial", "#video", "#content"],
  },
];

type StatusFilter = "all" | "scheduled" | "draft" | "published";

export function ScheduledPostsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "draft":
        return "secondary";
      case "published":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-3 w-3" />;
      case "published":
        return <Eye className="h-3 w-3" />;
      default:
        return <Edit className="h-3 w-3" />;
    }
  };

  const filteredPosts = scheduledPostsData.filter((post) => {
    const matchesSearch =
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, postId: number) => {
    console.log(`${action} post ${postId}`);
    // Handle actions here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Posts
          </CardTitle>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  Drafts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                  Published
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No posts found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={post.thumbnail}
                          alt="Post thumbnail"
                        />
                        <AvatarFallback>P{post.id}</AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="max-w-[300px]">
                      <div className="space-y-1">
                        <p className="text-sm line-clamp-2">{post.caption}</p>
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs text-blue-600 bg-blue-50 px-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.hashtags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{post.hashtags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {format(post.scheduledDate, "MMM d, yyyy")}
                        </div>
                        <div className="text-muted-foreground">
                          {format(post.scheduledDate, "h:mm a")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-medium">
                        {post.platform}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusColor(post.status)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction("edit", post.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("view", post.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAction("delete", post.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredPosts.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>
              Showing {filteredPosts.length} of {scheduledPostsData.length}{" "}
              posts
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                {
                  scheduledPostsData.filter((p) => p.status === "scheduled")
                    .length
                }{" "}
                Scheduled
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                {
                  scheduledPostsData.filter((p) => p.status === "draft").length
                }{" "}
                Drafts
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                {
                  scheduledPostsData.filter((p) => p.status === "published")
                    .length
                }{" "}
                Published
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

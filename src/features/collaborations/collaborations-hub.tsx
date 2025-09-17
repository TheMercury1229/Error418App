"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { InfluencerCard } from "./components/influencer-card";
import { FiltersPanel } from "@/features/collaborations/components/filters-panel";
import { ConnectionModal } from "@/features/collaborations/components/connection-modal";

// Mock data for influencers
const mockInfluencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    avatar: "/api/placeholder/80/80",
    followerCount: 125000,
    engagementRate: 4.2,
    location: "New York, USA",
    niches: ["Fashion", "Lifestyle", "Travel"],
    verified: true,
    bio: "Fashion blogger & lifestyle content creator. Spreading positivity one post at a time ✨",
    avgLikes: 5200,
    avgComments: 320,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$1,200 per post",
    responseRate: 85,
    tags: ["Micro-influencer", "High Engagement"],
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "@mikechentech",
    avatar: "/api/placeholder/80/80",
    followerCount: 89000,
    engagementRate: 5.8,
    location: "San Francisco, USA",
    niches: ["Technology", "Gadgets", "Reviews"],
    verified: true,
    bio: "Tech reviewer & gadget enthusiast. Honest reviews and tech tips for everyone.",
    avgLikes: 4100,
    avgComments: 280,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$800 per post",
    responseRate: 92,
    tags: ["Tech Expert", "Video Content"],
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    username: "@emmafit",
    avatar: "/api/placeholder/80/80",
    followerCount: 203000,
    engagementRate: 3.9,
    location: "Los Angeles, USA",
    niches: ["Fitness", "Health", "Wellness"],
    verified: true,
    bio: "Certified personal trainer helping you achieve your fitness goals 💪",
    avgLikes: 7800,
    avgComments: 450,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$1,500 per post",
    responseRate: 78,
    tags: ["Fitness Influencer", "Authentic Content"],
  },
  {
    id: 4,
    name: "David Park",
    username: "@davidcooks",
    avatar: "/api/placeholder/80/80",
    followerCount: 156000,
    engagementRate: 6.1,
    location: "Chicago, USA",
    niches: ["Food", "Cooking", "Recipes"],
    verified: false,
    bio: "Home chef sharing delicious recipes and cooking tips. Food is love! 🍳",
    avgLikes: 9200,
    avgComments: 620,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$1,100 per post",
    responseRate: 88,
    tags: ["Food Creator", "High Engagement"],
  },
  {
    id: 5,
    name: "Luna Martinez",
    username: "@lunabeauty",
    avatar: "/api/placeholder/80/80",
    followerCount: 94000,
    engagementRate: 7.2,
    location: "Miami, USA",
    niches: ["Beauty", "Skincare", "Makeup"],
    verified: true,
    bio: "Beauty enthusiast & skincare lover. Natural beauty tips and honest product reviews ✨",
    avgLikes: 6700,
    avgComments: 380,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$900 per post",
    responseRate: 95,
    tags: ["Beauty Expert", "Skincare Specialist"],
  },
  {
    id: 6,
    name: "Alex Thompson",
    username: "@alexadventures",
    avatar: "/api/placeholder/80/80",
    followerCount: 178000,
    engagementRate: 4.7,
    location: "Denver, USA",
    niches: ["Travel", "Adventure", "Photography"],
    verified: true,
    bio: "Adventure photographer capturing the world's beauty. Let's explore together! 🏔️",
    avgLikes: 8300,
    avgComments: 420,
    recentPosts: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
    collaborationRate: "$1,300 per post",
    responseRate: 82,
    tags: ["Travel Creator", "Photography"],
  },
];

interface FilterState {
  location: string;
  niches: string[];
  followerRange: [number, number];
  engagementRange: [number, number];
  verified: boolean;
  collaborationBudget: string;
  tags: string[];
}

export function CollaborationsHub() {
  const [influencers, setInfluencers] = useState(mockInfluencers);
  const [filteredInfluencers, setFilteredInfluencers] =
    useState(mockInfluencers);
  const [selectedInfluencer, setSelectedInfluencer] = useState<
    (typeof mockInfluencers)[0] | null
  >(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    niches: [],
    followerRange: [1000, 10000000],
    engagementRange: [0, 20],
    verified: false,
    collaborationBudget: "",
    tags: [],
  });

  // Filter influencers based on search and filters
  useEffect(() => {
    let filtered = influencers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (influencer) =>
          influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          influencer.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          influencer.niches.some((niche) =>
            niche.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((influencer) =>
        influencer.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    // Niche filter
    if (filters.niches.length > 0) {
      filtered = filtered.filter((influencer) =>
        filters.niches.some((niche) => influencer.niches.includes(niche))
      );
    }

    // Follower range filter
    filtered = filtered.filter(
      (influencer) =>
        influencer.followerCount >= filters.followerRange[0] &&
        influencer.followerCount <= filters.followerRange[1]
    );

    // Engagement filter
    filtered = filtered.filter(
      (influencer) =>
        influencer.engagementRate >= filters.engagementRange[0] &&
        influencer.engagementRate <= filters.engagementRange[1]
    );

    setFilteredInfluencers(filtered);
  }, [influencers, searchQuery, filters]);

  const handleConnect = (influencer: (typeof mockInfluencers)[0]) => {
    setSelectedInfluencer(influencer);
    setIsConnectionModalOpen(true);
  };

  const handleRequestMoreSuggestions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would call: await fetch('/api/collaborations')
      console.log("Requesting more suggestions from /api/collaborations");

      // Mock adding new influencers
      const newInfluencers = [
        {
          id: Date.now(),
          name: "Jordan Smith",
          username: "@jordanlifestyle",
          avatar: "/api/placeholder/80/80",
          followerCount: 112000,
          engagementRate: 5.4,
          location: "Austin, USA",
          niches: ["Lifestyle", "Fashion"],
          verified: true,
          bio: "Lifestyle blogger sharing daily inspiration and style tips ✨",
          avgLikes: 6000,
          avgComments: 340,
          recentPosts: [
            "/api/placeholder/150/150",
            "/api/placeholder/150/150",
            "/api/placeholder/150/150",
          ],
          collaborationRate: "$1,000 per post",
          responseRate: 87,
          tags: ["Rising Star", "Authentic Voice"],
        },
      ];

      setInfluencers((prev) => [...prev, ...newInfluencers]);
    } catch (error) {
      console.error("Failed to fetch more suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collaborations</h1>
          <p className="text-muted-foreground">
            Discover and connect with influencers for your brand
          </p>
        </div>

        <Button
          onClick={handleRequestMoreSuggestions}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Request More Suggestions"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Available Influencers
                </p>
                <p className="text-2xl font-bold">
                  {filteredInfluencers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">
                  {(
                    filteredInfluencers.reduce(
                      (acc, inf) => acc + inf.engagementRate,
                      0
                    ) / filteredInfluencers.length
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Verified Creators
                </p>
                <p className="text-2xl font-bold">
                  {filteredInfluencers.filter((inf) => inf.verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search influencers by name, username, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filters.location ||
            filters.niches.length > 0 ||
            filters.engagementRange[0] > 0 ||
            filters.engagementRange[1] < 20 ||
            filters.verified ||
            filters.collaborationBudget ||
            filters.tags.length > 0) && (
            <Badge variant="secondary" className="ml-1">
              {[
                filters.location ? 1 : 0,
                filters.niches.length,
                filters.engagementRange[0] > 0 ||
                filters.engagementRange[1] < 20
                  ? 1
                  : 0,
                filters.verified ? 1 : 0,
                filters.collaborationBudget ? 1 : 0,
                filters.tags.length,
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <FiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() =>
                setFilters({
                  location: "",
                  niches: [],
                  followerRange: [1000, 10000000],
                  engagementRange: [0, 20],
                  verified: false,
                  collaborationBudget: "",
                  tags: [],
                })
              }
            />
          </div>
        )}

        {/* Influencers Grid */}
        <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
          {filteredInfluencers.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No influencers found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      location: "",
                      niches: [],
                      followerRange: [1000, 10000000],
                      engagementRange: [0, 20],
                      verified: false,
                      collaborationBudget: "",
                      tags: [],
                    });
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInfluencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onConnect={() => handleConnect(influencer)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        influencer={selectedInfluencer}
        onSendMessage={(message: string, budget: string, timeline: string) => {
          console.log("Sending collaboration proposal:", {
            influencer: selectedInfluencer?.name,
            message,
            budget,
            timeline,
          });
          // In a real app, this would send the proposal via API
        }}
      />
    </div>
  );
}

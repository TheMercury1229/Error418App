"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  X,
  Users,
  TrendingUp,
  MapPin,
  Tag,
  DollarSign,
} from "lucide-react";

interface FilterState {
  location: string;
  niches: string[];
  followerRange: [number, number];
  engagementRange: [number, number];
  verified: boolean;
  collaborationBudget: string;
  tags: string[];
}

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Miami, FL",
  "London, UK",
  "Toronto, CA",
  "Sydney, AU",
  "Dubai, UAE",
  "Global",
];

const NICHES = [
  "Lifestyle",
  "Fashion",
  "Beauty",
  "Fitness",
  "Travel",
  "Food",
  "Tech",
  "Gaming",
  "Business",
  "Education",
  "Health",
  "Art",
  "Music",
  "Sports",
  "Finance",
  "Photography",
];

const TAGS = [
  "Trending",
  "High Engagement",
  "Fast Response",
  "Budget Friendly",
  "Premium",
  "Micro Influencer",
  "Macro Influencer",
  "Celebrity",
  "Rising Star",
  "Consistent",
  "Creative",
  "Professional",
];

const BUDGET_RANGES = [
  { value: "under-1k", label: "Under $1K" },
  { value: "1k-5k", label: "$1K - $5K" },
  { value: "5k-10k", label: "$5K - $10K" },
  { value: "10k-25k", label: "$10K - $25K" },
  { value: "25k-50k", label: "$25K - $50K" },
  { value: "50k-plus", label: "$50K+" },
];

export function FiltersPanel({
  filters,
  onFiltersChange,
  onClearFilters,
}: FiltersPanelProps) {
  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleNiche = (niche: string) => {
    const currentNiches = filters.niches;
    const updatedNiches = currentNiches.includes(niche)
      ? currentNiches.filter((n) => n !== niche)
      : [...currentNiches, niche];
    updateFilters("niches", updatedNiches);
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags;
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateFilters("tags", updatedTags);
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const hasActiveFilters =
    filters.location !== "" ||
    filters.niches.length > 0 ||
    filters.followerRange[0] > 1000 ||
    filters.followerRange[1] < 10000000 ||
    filters.engagementRange[0] > 0 ||
    filters.engagementRange[1] < 20 ||
    filters.verified ||
    filters.collaborationBudget !== "" ||
    filters.tags.length > 0;

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Location</label>
          </div>
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilters("location", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Follower Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Followers</label>
          </div>
          <div className="px-2">
            <Slider
              value={filters.followerRange}
              onValueChange={(value) =>
                updateFilters("followerRange", value as [number, number])
              }
              min={1000}
              max={10000000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatFollowerCount(filters.followerRange[0])}</span>
              <span>{formatFollowerCount(filters.followerRange[1])}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Engagement Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Engagement Rate</label>
          </div>
          <div className="px-2">
            <Slider
              value={filters.engagementRange}
              onValueChange={(value) =>
                updateFilters("engagementRange", value as [number, number])
              }
              min={0}
              max={20}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{filters.engagementRange[0]}%</span>
              <span>{filters.engagementRange[1]}%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Budget Range</label>
          </div>
          <Select
            value={filters.collaborationBudget}
            onValueChange={(value) =>
              updateFilters("collaborationBudget", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Budget</SelectItem>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Verified Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Account Status</label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filters.verified}
              onCheckedChange={(checked) => updateFilters("verified", checked)}
            />
            <label
              htmlFor="verified"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Verified accounts only
            </label>
          </div>
        </div>

        <Separator />

        {/* Niches Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Niches</label>
          </div>
          <div className="flex flex-wrap gap-1">
            {NICHES.map((niche) => (
              <Badge
                key={niche}
                variant={filters.niches.includes(niche) ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleNiche(niche)}
              >
                {niche}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tags Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-1">
            {TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

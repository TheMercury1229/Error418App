import React from "react";
import { AnalyticsCards } from "@/features/dashboard/components/analytics-cards";
import { PostPerformanceTable } from "@/features/dashboard/components/post-performance-table";
import { DashboardActions } from "@/features/dashboard/components/dashboard-actions";
import { AIInsights } from "@/features/dashboard/components/ai-insights";
import { YouTubeAnalytics } from "@/features/dashboard/components/youtube-analytics";
import { InstagramAnalytics } from "@/features/dashboard/components/instagram-analytics";
import { SectionHeading } from "@/components/shared/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeading
          title="Dashboard"
          description="Overview of your social media performance"
        />
        <DashboardActions />
      </div>

      {/* Platform Tabs */}
      <Tabs defaultValue="social" className="w-full">
        <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-8 mt-6">
          {/* Analytics Cards */}
          <AnalyticsCards />

          {/* Post Performance Table */}
          <PostPerformanceTable />

          {/* AI Insights */}
          <AIInsights />
        </TabsContent>

        <TabsContent value="youtube" className="mt-6">
          {/* YouTube Analytics */}
          <YouTubeAnalytics />
        </TabsContent>

        <TabsContent value="instagram" className="mt-6">
          {/* Instagram Analytics */}
          <InstagramAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

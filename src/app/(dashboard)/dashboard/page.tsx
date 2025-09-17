import React from "react";
import { AnalyticsCards } from "@/features/dashboard/components/analytics-cards";
import { PostPerformanceTable } from "@/features/dashboard/components/post-performance-table";
import { DashboardActions } from "@/features/dashboard/components/dashboard-actions";
import { AIInsights } from "@/features/dashboard/components/ai-insights";
import { SectionHeading } from "@/components/shared/section-heading";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeading
          title="Dashboard"
          description=" Overview of your social media performance"
        />
        <DashboardActions />
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

      {/* Post Performance Table */}
      <PostPerformanceTable />

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
}

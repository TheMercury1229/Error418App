"use client";

import React, { useState } from "react";
import {
  Domain,
  Region,
  TrendAnalysisResponse,
  TrendApiError,
  fetchTrendAnalysis,
} from "@/services/trend-analysis.service";
import { DomainSelector } from "@/features/trend-analysis/components/domain-selector";
import { TrendResults } from "@/features/trend-analysis/components/trend-results";
import { TrendLoadingSkeleton } from "@/features/trend-analysis/components/trend-loading-skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function TrendsPage() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>("IN");
  const [trendData, setTrendData] = useState<TrendAnalysisResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedDomain) return;

    setIsLoading(true);
    setError(null);
    setTrendData(null);

    try {
      const result = await fetchTrendAnalysis({
        domain: selectedDomain,
        region: selectedRegion,
      });

      if ("error" in result) {
        setError(result.error);
        toast.error("Failed to fetch trend analysis", {
          description: result.error,
        });
      } else {
        setTrendData(result);
        toast.success("Trend analysis completed successfully!");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error("Failed to fetch trend analysis", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <SectionHeading
          title="Trend Analysis"
          description="Discover trending topics and viral content opportunities across various creative domains"
        />
      </div>

      {/* Info Alert */}
      {/* <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Trend Insights</AlertTitle>
        <AlertDescription>
          Get real-time insights into trending topics for different creative
          domains. Analyze what&apos;s popular in your field and discover
          content opportunities based on trending YouTube videos and engagement
          metrics.
        </AlertDescription>
      </Alert> */}

      <div className="flex flex-col ">
        {/* Left Column - Domain Selection */}
        <div className="">
          <DomainSelector
            selectedDomain={selectedDomain}
            selectedRegion={selectedRegion}
            onDomainChange={setSelectedDomain}
            onRegionChange={setSelectedRegion}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Results */}
        <div className="">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && <TrendLoadingSkeleton />}

          {trendData && !isLoading && <TrendResults data={trendData} />}

          {!trendData && !isLoading && !error && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Ready to Analyze Trends?
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Select a domain and region from the sidebar, then click
                  &quot;Analyze Trends&quot; to discover what&apos;s trending in
                  your chosen field.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

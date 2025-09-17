"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export function DashboardActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button asChild className="flex-1 sm:flex-none">
        <Link href="/studio" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Link>
      </Button>
      <Button asChild variant="outline" className="flex-1 sm:flex-none">
        <Link href="/scheduler" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Post
        </Link>
      </Button>
    </div>
  );
}

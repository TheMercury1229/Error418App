import React from "react";
import { InstagramPublisher } from "@/features/instagram-publisher/instagram-publisher";
import { SectionHeading } from "@/components/shared/section-heading";

export default function InstagramPublisherPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Instagram Publisher"
        description="Publish photos and videos directly to Instagram"
      />
      <InstagramPublisher />
    </div>
  );
}
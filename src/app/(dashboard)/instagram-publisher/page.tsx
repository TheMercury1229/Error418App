import React from "react";
import { InstagramPublisher } from "@/features/instagram-publisher/instagram-publisher";
import { SectionHeading } from "@/components/shared/section-heading";
import { TutorialButton } from "@/features/tutorial/tutorial-button";

export default function InstagramPublisherPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <SectionHeading
          title="Instagram Publisher"
          description="Publish photos and videos directly to Instagram"
        />
        <TutorialButton
          page="instagram"
          label="Instagram Publishing Tutorial"
          className="mt-1 h-auto p-0"
        />
      </div>
      <InstagramPublisher />
    </div>
  );
}

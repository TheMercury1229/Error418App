"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Globe,
  Clock,
  Save,
  Loader2,
  Mail,
  Smartphone,
  MessageSquare,
  Heart,
  UserPlus,
  Shield,
  Eye,
  AlertCircle,
} from "lucide-react";

export interface UserPreferences {
  defaultLanguage: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    comments: boolean;
    likes: boolean;
    followers: boolean;
  };
  privacy: {
    profileVisibility: string;
    activityStatus: boolean;
  };
}

interface PreferencesTabProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isSaving: boolean;
}

const LANGUAGES = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", flag: "🇮🇳" },
  { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", flag: "🇫🇷" },
  { code: "de-DE", name: "German", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", flag: "🇮🇹" },
  { code: "pt-BR", name: "Portuguese", flag: "🇧🇷" },
  { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
  {
    value: "Europe/London",
    label: "Greenwich Mean Time (GMT)",
    offset: "UTC+0",
  },
  {
    value: "Europe/Berlin",
    label: "Central European Time (CET)",
    offset: "UTC+1",
  },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", offset: "UTC+9" },
  {
    value: "Asia/Shanghai",
    label: "China Standard Time (CST)",
    offset: "UTC+8",
  },
  {
    value: "Asia/Kolkata",
    label: "India Standard Time (IST)",
    offset: "UTC+5:30",
  },
  {
    value: "Australia/Sydney",
    label: "Australian Eastern Time (AET)",
    offset: "UTC+10",
  },
  {
    value: "Pacific/Auckland",
    label: "New Zealand Time (NZST)",
    offset: "UTC+12",
  },
];

const PRIVACY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can see your profile",
  },
  {
    value: "friends",
    label: "Friends Only",
    description: "Only your friends can see your profile",
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can see your profile",
  },
];

export function PreferencesTab({
  preferences,
  onSave,
  isSaving,
}: PreferencesTabProps) {
  const [formData, setFormData] = useState<UserPreferences>(preferences);

  const handleLanguageChange = (language: string) => {
    setFormData((prev) => ({ ...prev, defaultLanguage: language }));
  };

  const handleTimezoneChange = (timezone: string) => {
    setFormData((prev) => ({ ...prev, timezone }));
  };

  const handleNotificationChange = (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePrivacyChange = (
    key: keyof UserPreferences["privacy"],
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedLanguage = LANGUAGES.find(
    (lang) => lang.code === formData.defaultLanguage
  );
  const selectedTimezone = TIMEZONES.find(
    (tz) => tz.value === formData.timezone
  );
  const selectedPrivacy = PRIVACY_OPTIONS.find(
    (opt) => opt.value === formData.privacy.profileVisibility
  );

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(preferences);
  const activeNotifications = Object.values(formData.notifications).filter(
    Boolean
  ).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language & Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Default Language
              </Label>
              <Select
                value={formData.defaultLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{selectedLanguage?.flag}</span>
                      <span>{selectedLanguage?.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timezone Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timezone
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={handleTimezoneChange}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{selectedTimezone?.label}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {selectedTimezone?.offset}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{timezone.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {timezone.offset}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Current local time: {new Date().toLocaleTimeString()}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Your timezone affects when you receive notifications and
                scheduled posts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            <Badge variant="secondary" className="ml-2">
              {activeNotifications} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Email Notifications</h4>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("email", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Tips, features, and promotional content
                    </p>
                  </div>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={formData.notifications.marketing}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("marketing", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Push Notifications</h4>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                </div>
                <Switch
                  id="push-notifications"
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("push", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="comment-notifications">Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone comments on your posts
                    </p>
                  </div>
                </div>
                <Switch
                  id="comment-notifications"
                  checked={formData.notifications.comments}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("comments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="like-notifications">Likes</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone likes your posts
                    </p>
                  </div>
                </div>
                <Switch
                  id="like-notifications"
                  checked={formData.notifications.likes}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("likes", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="follower-notifications">
                      New Followers
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When someone follows you
                    </p>
                  </div>
                </div>
                <Switch
                  id="follower-notifications"
                  checked={formData.notifications.followers}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("followers", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Visibility */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Profile Visibility
            </Label>
            <Select
              value={formData.privacy.profileVisibility}
              onValueChange={(value) =>
                handlePrivacyChange("profileVisibility", value)
              }
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{selectedPrivacy?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRIVACY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Label htmlFor="activity-status">Show Activity Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
            </div>
            <Switch
              id="activity-status"
              checked={formData.privacy.activityStatus}
              onCheckedChange={(checked) =>
                handlePrivacyChange("activityStatus", checked)
              }
            />
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  Privacy Notice
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Some features may be limited based on your privacy settings.
                  Public profiles get better engagement and discovery.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              You have unsaved changes
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSaving || !hasChanges}
          className="min-w-32"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

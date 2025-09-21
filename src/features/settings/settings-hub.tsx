"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Sliders, Shield, Bell, Globe } from "lucide-react";

import { ProfileTab } from "@/features/settings/components/profile-tab";
import { PreferencesTab } from "@/features/settings/components/preferences-tab";
import { TutorialButton } from "@/features/tutorial/tutorial-button";

export interface UserProfile {
  name: string;
  email: string;
  profilePicture: string | null;
  bio: string;
}

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

export function SettingsHub() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Mock data - in a real app, this would come from an API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: null,
    bio: "Content creator and social media manager",
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultLanguage: "en-US",
    timezone: "America/New_York",
    notifications: {
      email: true,
      push: true,
      marketing: false,
      comments: true,
      likes: true,
      followers: true,
    },
    privacy: {
      profileVisibility: "public",
      activityStatus: true,
    },
  });

  const handleSave = async (
    tabName: string,
    data: UserProfile | UserPreferences
  ) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the appropriate state
      switch (tabName) {
        case "profile":
          setUserProfile(data as UserProfile);
          break;
        case "preferences":
          setPreferences(data as UserPreferences);
          break;
      }

      setSaveSuccess(
        `${
          tabName.charAt(0).toUpperCase() + tabName.slice(1)
        } settings saved successfully!`
      );
      setTimeout(() => setSaveSuccess(null), 3000);

      console.log(`Saved ${tabName} settings:`, data);
    } catch (error) {
      console.error(`Failed to save ${tabName} settings:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, integrations, and application preferences
          </p>
          <TutorialButton
            page="settings"
            label="Settings Tutorial"
            className="mt-1 h-auto p-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Synced
          </Badge>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="h-4 w-4" />
              <span className="font-medium">{saveSuccess}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <ProfileTab
                  profile={userProfile}
                  onSave={(data) => handleSave("profile", data)}
                  isSaving={isSaving}
                />
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <PreferencesTab
                  preferences={preferences}
                  onSave={(data) => handleSave("preferences", data)}
                  isSaving={isSaving}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile</p>
                <p className="text-lg font-bold">
                  {userProfile.profilePicture ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-lg font-bold">
                  {
                    Object.values(preferences.notifications).filter(Boolean)
                      .length
                  }{" "}
                  Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

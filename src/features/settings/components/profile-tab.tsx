"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Camera,
  Upload,
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export interface UserProfile {
  name: string;
  email: string;
  profilePicture: string | null;
  bio: string;
}

interface ProfileTabProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isSaving: boolean;
}

export function ProfileTab({ profile, onSave, isSaving }: ProfileTabProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [previewImage, setPreviewImage] = useState<string | null>(
    profile.profilePicture
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, profilePicture: result }));
        setErrors((prev) => ({ ...prev, profilePicture: "" }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.bio.length > 160) {
      newErrors.bio = "Bio must be 160 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const removeProfilePicture = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(profile);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage || ""} alt="Profile picture" />
                <AvatarFallback className="text-lg">
                  {formData.name
                    ? formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {previewImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeProfilePicture}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex-1">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {isDragActive
                    ? "Drop image here"
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>

              {fileRejections.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fileRejections[0].errors[0].message}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              Bio (Optional)
              <Badge variant="secondary" className="ml-2 text-xs">
                {formData.bio.length}/160
              </Badge>
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={3}
              maxLength={160}
              className={errors.bio ? "border-red-500" : ""}
            />
            {errors.bio && (
              <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.bio}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Member since:</span>
                <br />
                <span className="font-medium">January 2024</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <br />
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
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

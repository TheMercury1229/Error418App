"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  Calendar as CalendarIcon,
  Clock,
  Hash,
  Image as ImageIcon,
  Save,
  Send,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPostModal({ open, onOpenChange }: NewPostModalProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [platform, setPlatform] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dropzone for image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    maxFiles: 10,
  });

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      const tag = hashtagInput.trim().startsWith("#")
        ? hashtagInput.trim()
        : `#${hashtagInput.trim()}`;
      setHashtags((prev) => [...prev, tag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addHashtag();
    }
  };

  const resetForm = () => {
    setSelectedImages([]);
    setCaption("");
    setHashtags([]);
    setHashtagInput("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setPlatform("");
  };

  const handleAction = async (action: "draft" | "schedule" | "publish") => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Action:", action, {
      images: selectedImages,
      caption,
      hashtags,
      date: selectedDate,
      time: selectedTime,
      platform,
    });

    setIsLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isFormValid = selectedImages.length > 0 && caption.trim();
  const isScheduleValid =
    isFormValid && selectedDate && selectedTime && platform;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Images/Videos</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25",
                  "hover:border-primary hover:bg-primary/5"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag & drop images here, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: JPEG, PNG, GIF, WebP (Max 10 files)
                </p>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{caption.length} characters</span>
                <span>Recommended: 125-150 characters</span>
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label>Hashtags</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Add hashtags"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pl-8"
                  />
                </div>
                <Button onClick={addHashtag} variant="outline" size="sm">
                  Add
                </Button>
              </div>

              {/* Hashtag Preview */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeHashtag(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Scheduling */}
          <div className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Schedule Time</Label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Preview */}
            {(selectedImages.length > 0 || caption) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  {selectedImages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedImages.length} image(s) selected
                      </span>
                    </div>
                  )}
                  {caption && (
                    <div className="text-sm">
                      <p className="line-clamp-3">{caption}</p>
                    </div>
                  )}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hashtags.map((tag, index) => (
                        <span key={index} className="text-xs text-blue-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("draft")}
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("schedule")}
            disabled={!isScheduleValid || isLoading}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </Button>
          <Button
            onClick={() => handleAction("publish")}
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Publish Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

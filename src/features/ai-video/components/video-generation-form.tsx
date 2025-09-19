"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Video,
  Clock,
  Palette,
  Settings,
  Zap,
  AlertCircle,
} from "lucide-react";

import { VideoGenerationRequest } from "../video-generation-hub";

interface VideoGenerationFormProps {
  onGenerate: (request: VideoGenerationRequest) => void;
  isGenerating: boolean;
}

const DURATION_OPTIONS = [
  { value: 3, label: "3 seconds", description: "Quick animation" },
  { value: 5, label: "5 seconds", description: "Standard length" },
  { value: 8, label: "8 seconds", description: "Extended scene" },
  { value: 10, label: "10 seconds", description: "Long sequence" },
];

const STYLE_OPTIONS = [
  {
    value: "cinematic",
    label: "Cinematic",
    description: "Movie-like quality with dramatic lighting",
  },
  {
    value: "natural",
    label: "Natural",
    description: "Realistic and lifelike movement",
  },
  {
    value: "artistic",
    label: "Artistic",
    description: "Creative and stylized interpretation",
  },
  { value: "anime", label: "Anime", description: "Japanese animation style" },
  {
    value: "vintage",
    label: "Vintage",
    description: "Retro and nostalgic aesthetic",
  },
];

const QUALITY_OPTIONS = [
  {
    value: "sd",
    label: "SD (480p)",
    description: "Standard definition - faster generation",
  },
  {
    value: "hd",
    label: "HD (720p)",
    description: "High definition - balanced quality",
  },
  {
    value: "fhd",
    label: "FHD (1080p)",
    description: "Full HD - premium quality",
  },
  {
    value: "4k",
    label: "4K (2160p)",
    description: "Ultra HD - maximum quality",
  },
];

const ASPECT_RATIO_OPTIONS = [
  {
    value: "16:9",
    label: "16:9",
    description: "Widescreen (YouTube, landscape)",
  },
  {
    value: "9:16",
    label: "9:16",
    description: "Vertical (TikTok, Instagram Stories)",
  },
  { value: "1:1", label: "1:1", description: "Square (Instagram posts)" },
  { value: "4:3", label: "4:3", description: "Classic TV format" },
];

export function VideoGenerationForm({
  onGenerate,
  isGenerating,
}: VideoGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState("cinematic");
  const [quality, setQuality] = useState("hd");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Clear image error if exists
        if (errors.image) {
          setErrors((prev) => ({ ...prev, image: "" }));
        }
      }
    },
    [errors.image]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!prompt.trim()) {
      newErrors.prompt = "Please enter a prompt describing your video";
    } else if (prompt.length < 10) {
      newErrors.prompt = "Prompt should be at least 10 characters long";
    } else if (prompt.length > 1000) {
      newErrors.prompt = "Prompt should not exceed 500 characters";
    }

    if (!selectedImage) {
      newErrors.image = "Please upload an image to generate video from";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const request: VideoGenerationRequest = {
      prompt: prompt.trim(),
      image: selectedImage,
      duration,
      style,
      quality,
      aspectRatio,
    };

    onGenerate(request);
  };
  const canSubmit = prompt.trim() && selectedImage && !isGenerating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Video Prompt
          <Badge variant="outline" className="text-xs">
            {prompt.length}/1000
          </Badge>
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe the video you want to create... e.g., 'A gentle breeze moving through the trees with birds flying in the background, cinematic slow motion'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24 resize-none"
          maxLength={1000}
        />
        {errors.prompt && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.prompt}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          💡 Be specific about motion, camera angles, and atmosphere for best
          results
        </p>
      </div>

      {/* API Info */}
      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-900 dark:text-green-100">
              Powered by Advanced AI
            </p>
            <p className="text-green-700 dark:text-green-300">
              Video generation typically takes 1-2 minutes. Please keep this
              page open during processing.
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-blue-500" />
          Source Image
        </Label>

        {!selectedImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              {isDragActive ? "Drop your image here" : "Upload an image"}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse • PNG, JPG, WebP up to 10MB
            </p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={imagePreview!}
                  alt="Selected"
                  className="w-full h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm font-medium">
                    {selectedImage.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {errors.image && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.image}
          </p>
        )}
      </div>

      {/* Generation Settings */}
      {/* <div className="space-y-4"></div> */}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Generating Video...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Video
          </>
        )}
      </Button>

      {/* Progress Bar (when generating) */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>AI is creating your video...</span>
            <span>This may take several minutes</span>
          </div>
          <Progress value={33} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Please keep this tab open while generation is in progress
          </p>
        </div>
      )}
    </form>
  );
}

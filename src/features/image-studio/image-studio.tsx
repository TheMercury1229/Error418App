"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PromptEnhancerButton } from "@/components/shared/prompt-enhancer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Wand2,
  Upload,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  FileText,
  Eye,
  Save,
  Share,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Youtube,
} from "lucide-react";
import { aiImageHelperService } from "@/services/ai-image-helper.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ImageStudioProps {
  onImageGenerated?: (imageUrl: string, caption: string) => void;
}

export function ImageStudio({ onImageGenerated }: ImageStudioProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"generate" | "edit">("generate");
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"ready" | "error">("ready");

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for image generation");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const result = await response.json();

      if (result.success && result.imageBlob) {
        setGeneratedImage(result.imageBlob);
        setPreviewUrl(result.imageBlob);

        // Generate caption automatically
        await handleGenerateCaption();

        toast.success("Image generated and saved to your gallery!");
        setSuccess("Image generated and saved successfully!");

        if (onImageGenerated) {
          onImageGenerated(result.imageBlob, caption);
        }
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      let errorMessage = "Failed to generate image";

      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          errorMessage =
            "AI service is currently unavailable. Please check your internet connection and try again.";
        } else if (
          error.message.includes("404") ||
          error.message.includes("Not Found")
        ) {
          errorMessage =
            "AI service endpoint not found. Please contact support.";
        } else if (
          error.message.includes("500") ||
          error.message.includes("502") ||
          error.message.includes("503")
        ) {
          errorMessage =
            "AI service is temporarily down. Please try again in a few minutes.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGeneratingCaption(true);

    try {
      // Generate caption based on the prompt
      const generatedCaption = await generateCaptionFromPrompt(prompt);
      setCaption(generatedCaption);
      toast.success("Caption generated successfully!");
    } catch (error) {
      console.error("Caption generation error:", error);
      toast.error("Failed to generate caption");
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const generateCaptionFromPrompt = async (
    imagePrompt: string
  ): Promise<string> => {
    // Simple caption generation based on prompt
    const captionTemplates = [
      `✨ ${imagePrompt} ✨`,
      `Beautiful ${imagePrompt.toLowerCase()} that caught my eye today 🌟`,
      `Just created this amazing ${imagePrompt.toLowerCase()}! What do you think? 🎨`,
      `Artistic take on ${imagePrompt.toLowerCase()} - created with AI magic ✨`,
      `Exploring the beauty of ${imagePrompt.toLowerCase()} through digital art 🌈`,
    ];

    // Select a random template and customize it
    const template =
      captionTemplates[Math.floor(Math.random() * captionTemplates.length)];

    // Add some hashtags based on the prompt
    const hashtags = generateHashtags(imagePrompt);
    return `${template}\n\n${hashtags}`;
  };

  const generateHashtags = (prompt: string): string => {
    const words = prompt.toLowerCase().split(" ").slice(0, 3);
    const baseHashtags = words
      .map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`)
      .filter((tag) => tag.length > 1);

    const additionalHashtags = [
      "#aiart",
      "#digitalart",
      "#creative",
      "#artwork",
    ];
    return [...baseHashtags, ...additionalHashtags.slice(0, 3)].join(" ");
  };

  const handleCopyCaption = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      toast.success("Caption copied to clipboard!");
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `ai-generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    }
  };

  const handleUploadToInstagram = () => {
    if (generatedImage && caption) {
      // This would typically open the Instagram publisher with the generated content
      toast.success("Opening Instagram publisher...");
    }
  };

  const handleUploadToYouTube = () => {
    if (generatedImage && caption) {
      // Store the data in localStorage to pass to the upload page
      const uploadData = {
        type: "image",
        imageUrl: generatedImage,
        title: `AI Generated Image - ${new Date().toLocaleDateString()}`,
        description: caption || `Generated with prompt: ${prompt}`,
        tags: "AI,Generated,Image,Art",
        prompt: prompt,
        timestamp: Date.now(),
      };

      localStorage.setItem("youtube-upload-data", JSON.stringify(uploadData));

      // Navigate to the upload tab in dashboard
      router.push("/dashboard?tab=upload");
      toast.success("Redirecting to YouTube upload...");
    } else {
      toast.error("Please generate an image first");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Image className="h-8 w-8 text-purple-600" />
            Image Studio
          </h1>
          <p className="text-muted-foreground">
            Create stunning AI-generated images with custom captions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={apiStatus === "ready" ? "default" : "destructive"}>
            {apiStatus === "ready" && <CheckCircle className="h-3 w-3 mr-1" />}
            {apiStatus === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
            {apiStatus === "ready" && "AI Ready"}
            {apiStatus === "error" && "AI Error"}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "generate" | "edit")
        }
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Image Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">
                    Describe the image you want to create:
                  </Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A serene mountain landscape at sunset with a crystal clear lake reflecting the orange and pink sky, digital art style..."
                    rows={6}
                    className="resize-none"
                    disabled={isGenerating}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {prompt.length}/500 characters
                    </p>
                    <PromptEnhancerButton
                      prompt={prompt}
                      onPromptChange={setPrompt}
                      context="image-generation"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerateImage}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleGenerateCaption}
                    disabled={!prompt.trim() || isGeneratingCaption}
                  >
                    {isGeneratingCaption ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Caption...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Caption
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Generated Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={generatedImage}
                        alt="Generated AI Image"
                        className="w-full rounded-lg"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                      <Badge className="absolute top-2 left-2 bg-purple-600">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadImage}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadToInstagram}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share to Instagram
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadToYouTube}
                      >
                        <Youtube className="h-4 w-4 mr-1" />
                        Upload to YouTube
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No Image Generated</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter a prompt and click "Generate Image" to create your
                      AI artwork
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Caption Section */}
          {caption && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Caption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={4}
                    className="resize-none pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleCopyCaption}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCaption}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Caption
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCaption("")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image to Edit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Upload an Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload an existing image to enhance it with AI
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  className="max-w-xs mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin text-purple-600" />
                  Generating your image...
                </span>
                <span className="text-sm text-muted-foreground">
                  Please wait
                </span>
              </div>
              <Progress value={undefined} className="h-2" />
              <p className="text-xs text-muted-foreground">
                AI is creating your image based on your prompt...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Generation Failed</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleGenerateImage}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button onClick={clearError} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Display */}
      {success && (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{success}</span>
              </div>
              <Button onClick={clearSuccess} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

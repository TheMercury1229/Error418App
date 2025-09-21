import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Zap,
  Shield,
  Sparkles,
  Video,
  Instagram,
  Youtube,
  Calendar,
  Mic,
  BarChart3,
  CheckCircle,
  Globe,
  Palette,
  Bot,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 animate-in slide-in-from-top duration-300">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="text-xl font-bold">ContentHub</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <ModeToggle />
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom duration-700">
            <Badge
              variant="secondary"
              className="mb-4 animate-in fade-in slide-in-from-top duration-500 delay-200"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Content Creation
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              Create Stunning
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse">
                {" "}
                Social Content{" "}
              </span>
              in Minutes
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              Transform your content creation workflow with AI-powered tools for
              YouTube, Instagram, and more. Generate videos, voiceovers, and
              social posts that engage your audience.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
              <SignedOut>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Start Creating Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </SignedIn>

              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-md group"
              >
                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom duration-700 delay-1000">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background animate-in fade-in zoom-in duration-500 delay-1200"></div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background animate-in fade-in zoom-in duration-500 delay-1300"></div>
                  <div className="h-8 w-8 rounded-full bg-primary/30 border-2 border-background animate-in fade-in zoom-in duration-500 delay-1400"></div>
                </div>
                <span>10,000+ creators</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                <span>4.9/5 rating</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Globe
                  className="h-4 w-4 animate-spin"
                  style={{ animationDuration: "8s" }}
                />
                <span>50+ countries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl opacity-20"></div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to create amazing content
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From AI video generation to social media scheduling, we've got all
              your content creation needs covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Row 1: AI Video Generation (2) + Instagram (2) + YouTube (1) */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-left delay-200 group">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg transition-transform duration-300 group-hover:scale-110">
                    <Video className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-3" />
                  </div>
                  <div>
                    <CardTitle>AI Video Generation</CardTitle>
                    <CardDescription>
                      Create stunning videos from images and prompts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Text-to-video generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multiple aspect ratios</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>HD & 4K quality options</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-1 lg:col-span-2 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-bottom delay-300 group">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/10 rounded-lg transition-transform duration-300 group-hover:scale-110">
                    <Instagram className="h-6 w-6 text-pink-500 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <div>
                    <CardTitle>Instagram Publisher</CardTitle>
                    <CardDescription>
                      Direct publishing to Instagram
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Publish photos, videos, and stories directly to your Instagram
                  account with scheduling.
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 lg:col-span-1 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-right delay-400 group">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-500/10 rounded-lg transition-transform duration-300 group-hover:scale-110">
                    <Youtube className="h-6 w-6 text-red-500 transition-transform duration-300 group-hover:rotate-3" />
                  </div>
                  <div>
                    <CardTitle>YouTube Integration</CardTitle>
                    <CardDescription>
                      Upload & analyze performance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload videos directly and track channel performance.
                </p>
              </CardContent>
            </Card>

            {/* Row 2: AI Voiceover (2) + Content Scheduler (2) + Analytics (1) */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Mic className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>AI Voiceover Studio</CardTitle>
                    <CardDescription>
                      Professional voiceovers in multiple languages
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>50+ AI voices</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multiple languages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Studio quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-1 lg:col-span-2 border-2 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-right duration-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Smart Scheduler</CardTitle>
                    <CardDescription>
                      Plan your content calendar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule posts across platforms and maintain consistent
                  content flow with advanced planning tools.
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 lg:col-span-1 border-2 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-bottom duration-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>Track performance metrics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor engagement and growth across platforms.
                </p>
              </CardContent>
            </Card>

            {/* Row 3: Reel Creator (2.5) + AI Assistant (2.5) */}
            <Card className="col-span-1 md:col-span-3 lg:col-span-3 border-2 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-left duration-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Palette className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Reel Creator</CardTitle>
                    <CardDescription>Poetry & video reels</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Transform poems and scripts into engaging social media reels
                    with AI-powered editing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Poem Mode
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Reel Mode
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Auto Edit
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 lg:col-span-2 border-2 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-right duration-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Smart content suggestions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered recommendations for optimal posting times and
                    content ideas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Content Ideas
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Timing
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Trends
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 md:py-32 bg-muted/30 animate-in fade-in slide-in-from-bottom duration-500"
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl animate-in fade-in slide-in-from-bottom">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom duration-700">
              Get started with ContentHub in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-in fade-in slide-in-from-left duration-500 hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 hover:bg-primary/20 transition-colors">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                1. Choose Your Goal
              </h3>
              <p className="text-muted-foreground">
                Select what type of content you want to create - videos, posts,
                voiceovers, or complete campaigns.
              </p>
            </div>

            <div className="text-center animate-in fade-in slide-in-from-bottom duration-700 hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 hover:bg-primary/20 transition-colors">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Let AI Create</h3>
              <p className="text-muted-foreground">
                Our AI tools generate high-quality content based on your inputs,
                preferences, and brand guidelines.
              </p>
            </div>

            <div className="text-center animate-in fade-in slide-in-from-right duration-500 hover:scale-105 transition-transform">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Publish & Grow</h3>
              <p className="text-muted-foreground">
                Schedule and publish your content across platforms, then track
                performance with detailed analytics.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <SignedOut>
              <Link href="/sign-in">
                <Button size="lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">
                Active Creators
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">
                Content Pieces Created
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">
                Countries Served
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground animate-in fade-in slide-in-from-bottom duration-700">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 animate-in fade-in slide-in-from-bottom">
              Ready to transform your content creation?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80 animate-in fade-in slide-in-from-bottom duration-500">
              Join thousands of creators who are already using ContentHub to
              grow their audience and streamline their workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link href="/sign-in">
                  <Button size="lg" variant="secondary">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </SignedIn>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 border-0"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">ContentHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered content creation platform for modern creators.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 ContentHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

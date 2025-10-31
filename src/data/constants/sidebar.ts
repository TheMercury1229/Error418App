import {
  Calendar,
  Home,
  Mic,
  Settings,
  Palette,
  Video,
  Instagram,
  Eye,
  Image,
  User,
  FolderOpen,
  BarChart3,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Image Studio",
    href: "/studio",
    icon: Image,
  },
  {
    name: "AI Video",
    href: "/ai-video",
    icon: Video,
  },
  {
    name: "AI Vision",
    href: "/ai-vision",
    icon: Eye,
  },
  {
    name: "Instagram Publisher",
    href: "/instagram-publisher",
    icon: Instagram,
  },
  {
    name: "Scheduler",
    href: "/scheduler",
    icon: Calendar,
  },
  {
    name: "Voiceovers",
    href: "/voiceovers",
    icon: Mic,
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: FolderOpen,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

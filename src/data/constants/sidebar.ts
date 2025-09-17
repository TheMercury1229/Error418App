import { Calendar, Home, Mic, Settings, Palette, Users } from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Studio",
    href: "/studio",
    icon: Palette,
  },
  {
    name: "Scheduler",
    href: "/scheduler",
    icon: Calendar,
  },
  {
    name: "Collaborations",
    href: "/collaborations",
    icon: Users,
  },
  {
    name: "Voiceovers",
    href: "/voiceovers",
    icon: Mic,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

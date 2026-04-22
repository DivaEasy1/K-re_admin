import {
  Activity,
  Gauge,
  MapPinned,
  MessageSquareMore,
  Settings2
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Gauge
  },
  {
    title: "Stations",
    href: "/stations",
    icon: MapPinned
  },
  {
    title: "Activities",
    href: "/activities",
    icon: Activity
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquareMore
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2
  }
] as const;

export function getPageTitle(pathname: string) {
  if (pathname === "/") {
    return {
      title: "Dashboard Overview",
      description: "Monitor stations, activity performance, and guest requests in one place."
    };
  }

  if (pathname.startsWith("/stations/new")) {
    return {
      title: "New Station",
      description: "Create a new water station with equipment, map position, and launch details."
    };
  }

  if (pathname.startsWith("/stations/")) {
    return {
      title: "Edit Station",
      description: "Update launch data, media, and operational status."
    };
  }

  if (pathname.startsWith("/stations")) {
    return {
      title: "Stations",
      description: "Manage all K-RE launch points, availability, and opening schedules."
    };
  }

  if (pathname.startsWith("/activities/new")) {
    return {
      title: "New Activity",
      description: "Design a new experience and connect it to an existing station."
    };
  }

  if (pathname.startsWith("/activities/")) {
    return {
      title: "Edit Activity",
      description: "Refine activity details, pricing, and presentation."
    };
  }

  if (pathname.startsWith("/activities")) {
    return {
      title: "Activities",
      description: "Curate experiences, pricing, and categories across all stations."
    };
  }

  if (pathname.startsWith("/messages/")) {
    return {
      title: "Guest Message",
      description: "Review the conversation and take action quickly."
    };
  }

  if (pathname.startsWith("/messages")) {
    return {
      title: "Messages",
      description: "Follow new requests, replies, and archived conversations."
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      title: "Settings",
      description: "Manage admin access, contact channels, and recent audit activity."
    };
  }

  return {
    title: "K-RE Admin",
    description: "High-clarity control center for your operations team."
  };
}

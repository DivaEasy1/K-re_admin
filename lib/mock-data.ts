import type {
  Activity,
  AdminProfile,
  AuditEntry,
  ChartPoint,
  ContactSettings,
  Message,
  MessageStatus,
  Station,
  StationTrafficPoint
} from "@/types";
import { cloneData, wait } from "@/lib/utils";

let stations: Station[] = [
  {
    id: "st-01",
    name: "Lagoon Bay",
    location: "Dakhla Atlantic Marina",
    latitude: 23.7162,
    longitude: -15.9361,
    status: "OPEN",
    openYear: 2022,
    description:
      "Flagship lagoon station with premium guest services, lockers, and early sunrise departures.",
    equipment: ["kayak_solo", "kayak_tandem", "paddle"],
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-02",
    name: "Cliffside Dock",
    location: "Essaouira Wind Point",
    latitude: 31.5085,
    longitude: -9.7595,
    status: "OPEN",
    openYear: 2023,
    description:
      "High-energy coastal station focused on sport packages and guided coastline circuits.",
    equipment: ["kayak_solo", "paddle"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-03",
    name: "Blue Haven",
    location: "Al Hoceima Waterfront",
    latitude: 35.2493,
    longitude: -3.9371,
    status: "COMING_SOON",
    openYear: 2026,
    description:
      "Upcoming Mediterranean location designed for families, soft adventures, and sunset tours.",
    equipment: ["kayak_tandem", "paddle"],
    image:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-04",
    name: "Palm Harbor",
    location: "Agadir Bay",
    latitude: 30.4278,
    longitude: -9.5981,
    status: "CLOSED",
    openYear: 2021,
    description:
      "Seasonal hub under maintenance while the team upgrades guest flow and storage capacity.",
    equipment: ["kayak_solo", "kayak_tandem"],
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80"
  }
];

let activities: Activity[] = [
  {
    id: "ac-01",
    title: "Sunrise Kayak Escape",
    description:
      "Early morning guided paddle for small groups with photo stops and warm drinks on return.",
    duration: "2h 30m",
    difficulty: "EASY",
    price: "420 MAD",
    icon: "🌅",
    category: "nature",
    stationId: "st-01",
    stationName: "Lagoon Bay",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "ac-02",
    title: "Atlantic Power Paddle",
    description:
      "Advanced coastal ride with guide pacing, route checkpoints, and wind briefing included.",
    duration: "1h 45m",
    difficulty: "HARD",
    price: "590 MAD",
    icon: "🌊",
    category: "sport",
    stationId: "st-02",
    stationName: "Cliffside Dock",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "ac-03",
    title: "Lagoon Brunch Cruise",
    description:
      "Relaxed tandem kayak route ending with a floating brunch setup by the shore team.",
    duration: "3h",
    difficulty: "MEDIUM",
    price: "720 MAD",
    icon: "🥐",
    category: "gastronomy",
    stationId: "st-01",
    stationName: "Lagoon Bay",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  }
];

let messages: Message[] = [
  {
    id: "msg-01",
    name: "Salma Idrissi",
    email: "salma@example.com",
    subject: "Private group booking for 12 guests",
    content:
      "Hello, we would like to reserve a sunrise kayak session for a team retreat on May 18. Could you confirm availability and group pricing?",
    date: "2026-03-31T09:30:00.000Z",
    status: "NEW"
  },
  {
    id: "msg-02",
    name: "Yassine El Fassi",
    email: "yassine@example.com",
    subject: "Question about Blue Haven opening",
    content:
      "Hi team, I saw Blue Haven on Instagram. Is the station opening this summer, and will paddle lessons be available for beginners?",
    date: "2026-03-30T15:15:00.000Z",
    status: "NEW"
  },
  {
    id: "msg-03",
    name: "Mina Dupont",
    email: "mina@example.com",
    subject: "Need invoice for last weekend",
    content:
      "Can you please send me the invoice for our Lagoon Brunch Cruise booking from last Saturday? Thank you.",
    date: "2026-03-28T11:00:00.000Z",
    status: "REPLIED"
  },
  {
    id: "msg-04",
    name: "Nora Benali",
    email: "nora@example.com",
    subject: "Accessibility at Cliffside Dock",
    content:
      "I’m planning a family visit and wanted to ask if the access path and waiting lounge are suitable for reduced mobility.",
    date: "2026-03-24T13:40:00.000Z",
    status: "ARCHIVED"
  }
];

export const dashboardTrend: ChartPoint[] = [
  { month: "Oct", reservations: 42, revenue: 18, messages: 8 },
  { month: "Nov", reservations: 48, revenue: 20, messages: 9 },
  { month: "Dec", reservations: 39, revenue: 16, messages: 7 },
  { month: "Jan", reservations: 66, revenue: 31, messages: 14 },
  { month: "Feb", reservations: 72, revenue: 34, messages: 11 },
  { month: "Mar", reservations: 84, revenue: 41, messages: 15 },
  { month: "Apr", reservations: 97, revenue: 46, messages: 17 },
  { month: "May", reservations: 101, revenue: 52, messages: 16 },
  { month: "Jun", reservations: 95, revenue: 48, messages: 13 }
];

export const stationTraffic: StationTrafficPoint[] = [
  { station: "Lagoon Bay", bookings: 84, satisfaction: 96 },
  { station: "Cliffside Dock", bookings: 68, satisfaction: 91 },
  { station: "Blue Haven", bookings: 46, satisfaction: 94 },
  { station: "Palm Harbor", bookings: 18, satisfaction: 76 }
];

export const adminProfile: AdminProfile = {
  name: "Gérard Menvusa",
  role: "Operations Lead",
  email: "gerard@k-re.ma",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  lastLogin: "2026-04-02T07:42:00.000Z"
};

export const contactSettings: ContactSettings = {
  officeEmail: "hello@k-re.ma",
  officePhone: "+212 5 24 90 20 11",
  emergencyLine: "+212 6 60 80 44 17"
};

export const auditEntries: AuditEntry[] = [
  {
    id: "audit-01",
    action: "Updated activity pricing",
    actor: "Gérard Menvusa",
    date: "2026-04-01T16:20:00.000Z",
    context: "Atlantic Power Paddle"
  },
  {
    id: "audit-02",
    action: "Archived guest message",
    actor: "Ines Harrouch",
    date: "2026-04-01T10:05:00.000Z",
    context: "Invoice request"
  },
  {
    id: "audit-03",
    action: "Added new station draft",
    actor: "Gérard Menvusa",
    date: "2026-03-29T14:48:00.000Z",
    context: "Blue Haven"
  }
];

export async function getStations() {
  await wait(450);
  return cloneData(stations);
}

export async function getStation(id: string) {
  await wait(320);
  return cloneData(stations.find((station) => station.id === id) ?? null);
}

export async function createStation(station: Omit<Station, "id">) {
  await wait(700);
  const nextStation: Station = {
    ...station,
    id: `st-${Date.now()}`
  };
  stations = [nextStation, ...stations];
  return cloneData(nextStation);
}

export async function updateStation(id: string, values: Omit<Station, "id">) {
  await wait(700);
  stations = stations.map((station) =>
    station.id === id ? { ...station, ...values, id } : station
  );
  return cloneData(stations.find((station) => station.id === id) ?? null);
}

export async function deleteStation(id: string) {
  await wait(500);
  stations = stations.filter((station) => station.id !== id);
  return true;
}

export async function uploadStationImage(id: string, image: string) {
  await wait(400);
  stations = stations.map((station) => (station.id === id ? { ...station, image } : station));
  return cloneData(stations.find((station) => station.id === id) ?? null);
}

export async function getActivities() {
  await wait(450);
  return cloneData(activities);
}

export async function getActivity(id: string) {
  await wait(320);
  return cloneData(activities.find((activity) => activity.id === id) ?? null);
}

export async function createActivity(activity: Omit<Activity, "id">) {
  await wait(700);
  const nextActivity: Activity = {
    ...activity,
    id: `ac-${Date.now()}`
  };
  activities = [nextActivity, ...activities];
  return cloneData(nextActivity);
}

export async function updateActivity(id: string, values: Omit<Activity, "id">) {
  await wait(700);
  activities = activities.map((activity) =>
    activity.id === id ? { ...activity, ...values, id } : activity
  );
  return cloneData(activities.find((activity) => activity.id === id) ?? null);
}

export async function deleteActivity(id: string) {
  await wait(500);
  activities = activities.filter((activity) => activity.id !== id);
  return true;
}

export async function uploadActivityImage(id: string, image: string) {
  await wait(400);
  activities = activities.map((activity) => (activity.id === id ? { ...activity, image } : activity));
  return cloneData(activities.find((activity) => activity.id === id) ?? null);
}

export async function getMessages(status?: MessageStatus) {
  await wait(350);
  const filtered = status ? messages.filter((message) => message.status === status) : messages;
  return cloneData(filtered);
}

export async function getMessage(id: string) {
  await wait(280);
  return cloneData(messages.find((message) => message.id === id) ?? null);
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  await wait(450);
  messages = messages.map((message) => (message.id === id ? { ...message, status } : message));
  return cloneData(messages.find((message) => message.id === id) ?? null);
}

export async function deleteMessage(id: string) {
  await wait(400);
  messages = messages.filter((message) => message.id !== id);
  return true;
}

export function getDashboardStats() {
  const openStations = stations.filter((station) => station.status === "OPEN").length;
  const comingSoonStations = stations.filter((station) => station.status === "COMING_SOON").length;
  const unreadMessages = messages.filter((message) => message.status === "NEW").length;

  return {
    totalStations: stations.length,
    openStations,
    comingSoonStations,
    totalActivities: activities.length,
    unreadMessages,
    lastLogin: adminProfile.lastLogin
  };
}

export function getUnreadMessagesCount() {
  return messages.filter((message) => message.status === "NEW").length;
}


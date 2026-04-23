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
    location: "Marina Atlantique de Dakhla",
    latitude: 23.7162,
    longitude: -15.9361,
    status: "OPEN",
    openYear: 2022,
    description: "Station lagon principale avec services premium, casiers et departs matinaux.",
    equipment: ["kayak_solo", "kayak_tandem", "paddle"],
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-02",
    name: "Cliffside Dock",
    location: "Point Vent d'Essaouira",
    latitude: 31.5085,
    longitude: -9.7595,
    status: "OPEN",
    openYear: 2023,
    description: "Station cotiere orientee sport avec parcours guides et offres dynamiques.",
    equipment: ["kayak_solo", "paddle"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-03",
    name: "Blue Haven",
    location: "Front de mer d'Al Hoceima",
    latitude: 35.2493,
    longitude: -3.9371,
    status: "COMING_SOON",
    openYear: 2026,
    description: "Nouvelle implantation mediterraneenne pensee pour les familles et les sorties douces.",
    equipment: ["kayak_tandem", "paddle"],
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "st-04",
    name: "Palm Harbor",
    location: "Baie d'Agadir",
    latitude: 30.4278,
    longitude: -9.5981,
    status: "CLOSED",
    openYear: 2021,
    description: "Base saisonniere en maintenance pendant la mise a niveau des operations.",
    equipment: ["kayak_solo", "kayak_tandem"],
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80"
  }
];

let activities: Activity[] = [
  {
    id: "ac-01",
    title: "Echappee kayak au lever du jour",
    description: "Sortie guidee au lever du soleil pour petits groupes avec pauses photo.",
    duration: "2 h 30",
    difficulty: "EASY",
    price: 420,
    priceLabel: "A partir de 420 MAD",
    icon: "🌅",
    category: "nature",
    maxParticipants: 10,
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "ac-02",
    title: "Parcours atlantique sportif",
    description: "Parcours cotier soutenu avec briefing vent, rythme guide et checkpoints.",
    duration: "1 h 45",
    difficulty: "HARD",
    price: 590,
    priceLabel: "A partir de 590 MAD",
    icon: "🌊",
    category: "sport",
    maxParticipants: 8,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "ac-03",
    title: "Croisiere brunch sur le lagon",
    description: "Balade detendue en kayak tandem avec brunch prepare au retour par l'equipe.",
    duration: "3 h",
    difficulty: "MEDIUM",
    price: 720,
    priceLabel: "A partir de 720 MAD",
    icon: "🥐",
    category: "gastronomy",
    maxParticipants: 12,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  }
];

let messages: Message[] = [
  {
    id: "msg-01",
    name: "Salma Idrissi",
    email: "salma@example.com",
    subject: "Reservation groupe prive pour 12 personnes",
    content: "Bonjour, nous souhaitons reserver une session kayak au lever du jour pour un team retreat le 18 mai. Pouvez-vous confirmer la disponibilite et le tarif groupe ?",
    date: "2026-03-31T09:30:00.000Z",
    status: "NEW"
  },
  {
    id: "msg-02",
    name: "Yassine El Fassi",
    email: "yassine@example.com",
    subject: "Question sur l'ouverture de Blue Haven",
    content: "Bonjour, j'ai vu Blue Haven sur Instagram. La station ouvrira-t-elle cet ete et y aura-t-il des cours de paddle pour debutants ?",
    date: "2026-03-30T15:15:00.000Z",
    status: "NEW"
  },
  {
    id: "msg-03",
    name: "Mina Dupont",
    email: "mina@example.com",
    subject: "Besoin d'une facture pour le week-end dernier",
    content: "Pouvez-vous m'envoyer la facture de notre reservation Lagoon Brunch Cruise du samedi dernier ? Merci.",
    date: "2026-03-28T11:00:00.000Z",
    status: "REPLIED"
  },
  {
    id: "msg-04",
    name: "Nora Benali",
    email: "nora@example.com",
    subject: "Accessibilite a Cliffside Dock",
    content: "Je prepare une visite en famille et je voulais savoir si le chemin d'acces et la zone d'attente conviennent aux personnes a mobilite reduite.",
    date: "2026-03-24T13:40:00.000Z",
    status: "ARCHIVED"
  }
];

export const dashboardTrend: ChartPoint[] = [
  { month: "oct.", reservations: 42, revenue: 18, messages: 8 },
  { month: "nov.", reservations: 48, revenue: 20, messages: 9 },
  { month: "dec.", reservations: 39, revenue: 16, messages: 7 },
  { month: "janv.", reservations: 66, revenue: 31, messages: 14 },
  { month: "fevr.", reservations: 72, revenue: 34, messages: 11 },
  { month: "mars", reservations: 84, revenue: 41, messages: 15 },
  { month: "avr.", reservations: 97, revenue: 46, messages: 17 },
  { month: "mai", reservations: 101, revenue: 52, messages: 16 },
  { month: "juin", reservations: 95, revenue: 48, messages: 13 }
];

export const stationTraffic: StationTrafficPoint[] = [
  { station: "Lagoon Bay", bookings: 84, satisfaction: 96 },
  { station: "Cliffside Dock", bookings: 68, satisfaction: 91 },
  { station: "Blue Haven", bookings: 46, satisfaction: 94 },
  { station: "Palm Harbor", bookings: 18, satisfaction: 76 }
];

export const adminProfile: AdminProfile = {
  name: "Gerard Menvusa",
  role: "Responsable operations",
  email: "gerard@k-re.ma",
  avatar: "",
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
    action: "Tarification d'activite mise a jour",
    actor: "Gerard Menvusa",
    date: "2026-04-01T16:20:00.000Z",
    context: "Parcours atlantique sportif"
  },
  {
    id: "audit-02",
    action: "Message client archive",
    actor: "Ines Harrouch",
    date: "2026-04-01T10:05:00.000Z",
    context: "Demande de facture"
  },
  {
    id: "audit-03",
    action: "Brouillon de station ajoute",
    actor: "Gerard Menvusa",
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
  stations = stations.map((station) => (station.id === id ? { ...station, ...values, id } : station));
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
  activities = activities.map((activity) => (activity.id === id ? { ...activity, ...values, id } : activity));
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

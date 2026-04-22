export type StationStatus = "OPEN" | "COMING_SOON" | "CLOSED";
export type ActivityDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ActivityCategory = "leisure" | "nature" | "gastronomy" | "sport";
export type MessageStatus = "NEW" | "REPLIED" | "ARCHIVED";
export type EquipmentType = "kayak_solo" | "kayak_tandem" | "paddle";

export interface Station {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  openYear: number;
  description: string;
  equipment: EquipmentType[];
  image: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: ActivityDifficulty;
  price: string;
  icon: string;
  category: ActivityCategory;
  stationId: string;
  stationName: string;
  image: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  status: MessageStatus;
}

export interface DashboardStat {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "danger" | "accent";
}

export interface ChartPoint {
  month: string;
  reservations: number;
  revenue: number;
  messages: number;
}

export interface StationTrafficPoint {
  station: string;
  bookings: number;
  satisfaction: number;
}

export interface AdminProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
  lastLogin: string;
}

export interface ContactSettings {
  officeEmail: string;
  officePhone: string;
  emergencyLine: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  date: string;
  context: string;
}


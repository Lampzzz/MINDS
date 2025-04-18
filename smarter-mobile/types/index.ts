import { Timestamp } from "firebase/firestore";

export interface Shelter {
  id?: string;
  name: string;
  location: string;
  type: string;
  capacity: number | string;
  status: string;
  managerId: string;
  managerName?: string | null;
  shelterDeviceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Resident = Manager | Member;

export interface Admin {
  id: string;
  authId: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Analytics {
  id: string;
  shelterTemperature: number;
  humidity: number;
  airQuality: number;
  occupancy: number;
  batteryPercentage: number;
  batteryRemainingUsageTime: string;
  createdAt: string;
  shelterDeviceId: string;
}

export interface Manager {
  id?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: any;
  age?: number | string;
  address: string;
  password?: string;
  isAssigned?: boolean;
  image?: string;
  authId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Member {
  id?: string;
  fullName: string;
  gender: string;
  dateOfBirth: any;
  age?: number;
  managerId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface TabIconProps {
  Icon: React.ComponentType<any>;
  name: string;
  focused: boolean;
}

export interface Controller {
  door: string;
  inverter: string;
  shelterDeviceId: string;
}

export interface Announcement {
  id?: string;
  title: string;
  description: string;
  senderId: string;
  recipient: string;
  createdAt?: any;
  senderName?: string;
  category: string;
  readBy?: string[];
}

export interface ShelterDevice {
  id: string;
  name: string;
  keyCardId: string;
  isRegistered?: boolean;
  shelterNo: number;
  createdAt?: Timestamp;
}

export interface BodyTemperature {
  id: string;
  residentId: string;
  bodyTemperature: number;
  timestamp: Timestamp;
}

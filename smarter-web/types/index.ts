import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
} from "react-hook-form";

import { Icons } from "@/components/icons";
import { Timestamp } from "firebase/firestore";

export type ValidFieldNames = "name" | "email" | "password";
export type Gender = "male" | "female";
export type ShelterStatus =
  | "available"
  | "occupied"
  | "under maintenance"
  | "defective";

export interface LoginParams {
  email: string;
  idToken: string;
  password?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: Timestamp;
}

export interface Shelter {
  id?: string;
  location: string;
  status: string;
  managerId?: string | null;
  images?: any[];
  shelterDeviceId: string;
  name?: string;
  createdAt?: Timestamp;
}

export interface NavItem {
  title: string;
  href?: string;
  url?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  children?: NavItem[];
  isActive?: boolean;
  items?: NavItem[];
}

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export interface FormFieldProps {
  type?: string;
  placeholder: string;
  name: ValidFieldNames;
  icon?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  register: UseFormRegister<FormData>;
}

export interface ShelterDevice {
  id: string;
  shelterNo: number;
  name: string;
  isRegistered: boolean;
  keyCardId: string;
  createdAt: any;
  cameraUrl?: string;
}

export interface Report {
  id: string;
  managerName: string;
  shelterName: string;
  location: string;
  status: string;
  category: string;
  createdAt: any;
  shelterNo?: number;
}

export interface Announcement {
  id?: string;
  title: string;
  description: string;
  senderId: string;
  recipient?: string;
  image?: string;
  createdAt?: string | any;
  senderName?: string;
  category: string;
}

export interface Manager {
  id?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  address: string;
  password?: string;
  isAssigned?: boolean;
  bodyTemp?: number;
  bodyTempDate?: any;
  createdAt: any;
  updatedAt: any;
}

export interface Resident {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: any;
  address: string;
  password?: string;
  members: Member[];
  newPassword?: string;
  shelterId?: string;
  releaseById?: string;
}

export interface Member {
  id?: string;
  fullName: string;
  gender: string;
  dateOfBirth: any;
  age?: number;
  managerId?: string | null;
  managerName?: string;
  bodyTemp?: number | string;
  bodyTempDate?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemberOpenState {
  [index: number]: boolean;
}

export interface ResidentFormValues {
  fullName: string;
  dateOfBirth: any;
  gender: string;
  address: string;
  email: string;
  password: string;
  phoneNumber: string;
  members: Member[];
}

export interface FieldErrorMessage {
  message: string;
}

export interface FirebaseErrors {
  name?: FieldErrorMessage;
  email?: FieldErrorMessage;
  password?: FieldErrorMessage;
  general?: FieldErrorMessage;
}

export interface BaseFilterTypes {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserFilterTypes {
  page?: number;
  limit?: number;
  genders?: string;
  search?: string;
}

export interface ShelterFilterTypes {
  page?: number;
  limit?: number;
  status?: string;
  location?: string;
  search?: string;
}

export interface AnnouncementFilterTypes {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface EmergencyFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface AnnouncementState {
  announcements: Announcement[] | null;
  totalData: number;
  isLoading: boolean;
  fetchAnnouncements: (filters?: AnnouncementFilterTypes) => Promise<void>;
}

export interface AuthState {
  currentUser: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeAuthListener: () => () => void;
  fetchUserData: (id: string) => Promise<void>;
}

export interface ShelterState {
  shelters: Shelter[] | null;
  shelterDevices: ShelterDevice[] | null;
  shelter: Shelter | null;
  totalData: number;
  isLoading: boolean;
  fetchShelters: (filters?: ShelterFilterTypes) => Promise<void>;
  fetchShelter: (id: string) => Promise<void>;
  fetchShelterDevices: () => Promise<void>;
}

export interface MemberState {
  members: Member[] | null;
  member: Member | null;
  totalData: number;
  isLoading: boolean;
  fetchMembers: (filters?: UserFilterTypes) => Promise<void>;
  fetchMember: (id: string) => Promise<void>;
}

export interface EmergencyState {
  emergencies: Report[] | null;
  isLoading: boolean;
  totalData: number;
  error: string | null;
  fetchEmergencies: (filters?: EmergencyFilter) => Promise<void>;
}

export interface ReleaseShelter {
  id: string;
  releaseDate: string;
  releaseById: string;
  releaseToId: string;
  shelterId: string;
  adminName: string;
  managerName: string;
  shelterName: string;
  shelterLocation?: string;
}

export interface ReturnShelter {
  id: string;
  returnDate: string;
  returnById: string;
  returnToId: string;
  shelterId: string;
  adminName: string;
  managerName: string;
  shelterName: string;
  shelterLocation?: string;
}

export interface BodyTemperature {
  id: string;
  residentId: string;
  bodyTemperature: number;
  timestamp: Timestamp;
}

export interface Analytics {
  id: string;
  shelterTemperature: string;
  humidity: string;
  airQuality: string;
  occupancy: string;
  batteryPercentage: string;
  batteryRemainingUsageTime: string;
  createdAt: string;
  shelterDeviceId: string;
  shelterName?: string;
}

export interface ThresholdAlert {
  id: string;
  sensor: string;
  state: boolean;
  createdAt: Timestamp;
}

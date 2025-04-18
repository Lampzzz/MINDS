import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    isActive: false,
    items: [],
  },
  {
    title: "Shelter",
    url: "#",
    icon: "home",
    isActive: true,
    items: [
      {
        title: "Register",
        url: "/dashboard/register",
        icon: "userPlus",
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: "arrowRight",
      },
      {
        title: "Assign",
        url: "/dashboard/release",
        icon: "userMinus",
      },
      {
        title: "Return",
        url: "/dashboard/return",
        icon: "arrowRight",
      },
    ],
  },
  {
    title: "Resident",
    url: "#",
    icon: "users",
    isActive: true,
    items: [
      {
        title: "Manager",
        url: "/dashboard/manager",
        icon: "userCheck",
      },
      {
        title: "Member",
        url: "/dashboard/member",
        icon: "user",
      },
    ],
  },
  {
    title: "Announcement",
    url: "/dashboard/announcement",
    icon: "megaphone",
    isActive: false,
    items: [],
  },
  {
    title: "Report",
    url: "/dashboard/report",
    icon: "siren",
    isActive: false,
    items: [],
  },
];

export const months: { [key: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const shelterAddresses = [
  {
    value: "paulino court",
    label: "Paulino Court",
  },
  {
    value: "gremma covered court",
    label: "Gremma Covered Court",
  },
];

export const shelterStatuses = [
  { value: "available", label: "Available" },
  { value: "under maintenance", label: "Under Maintenance" },
  { value: "occupied", label: "Occupied" },
  { value: "defective", label: "Defective" },
];

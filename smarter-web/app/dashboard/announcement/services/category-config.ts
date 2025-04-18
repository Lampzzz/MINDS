import { Megaphone, AlertTriangle, Wrench, Calendar, Bell } from "lucide-react";

export function getCategoryConfig(category: string) {
  switch (category) {
    case "community":
      return {
        icon: Megaphone,
        colors: "bg-blue-100 text-blue-800",
        iconColor: "#1e40af",
      };
    case "maintenance":
      return {
        icon: Wrench,
        colors: "bg-orange-100 text-orange-800",
        iconColor: "#9a3412",
      };
    case "emergency":
      return {
        icon: AlertTriangle,
        colors: "bg-red-100 text-red-800",
        iconColor: "#b91c1c",
      };
    case "event":
      return {
        icon: Calendar,
        colors: "bg-green-100 text-green-800",
        iconColor: "#166534",
      };
    case "notice":
      return {
        icon: Bell,
        colors: "bg-purple-100 text-purple-800",
        iconColor: "#6b21a8",
      };
    default:
      return {
        icon: Bell,
        colors: "bg-gray-100 text-gray-800",
        iconColor: "#4b5563",
      };
  }
}

import { images } from "@/constants";

export const getCategoryIcon = (category: string) => {
  let icon;
  let color;

  switch (category) {
    case "event":
      icon = images.Event;
      color = "#F97316";
      break;
    case "maintenance":
      icon = images.Maintenance;
      color = "#16A34A";
      break;
    case "emergency":
      icon = images.Emergency;
      color = "#DC2626";
      break;
    default:
      icon = images.Notice;
      color = "#DC2626";
      break;
  }
  return { icon, color };
};

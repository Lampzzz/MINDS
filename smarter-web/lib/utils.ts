import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fireBaseError(error: string) {
  const errors: Record<string, { message: string }> = {};

  switch (error) {
    case "auth/invalid-email":
      errors.email = { message: "Invalid email" };
      break;
    case "auth/invalid-credential":
      errors.both = { message: "Wrong email or password" };
      break;
    case "auth/user-disabled":
      errors.email = { message: "User disabled" };
      break;
    case "auth/user-not-found":
      errors.email = { message: "User not found" };
      break;
    case "auth/wrong-password":
      errors.password = { message: "Wrong password" };
      break;
    case "auth/email-already-in-use":
      errors.email = { message: "Email already taken" };
      break;
    default:
      errors.general = { message: error };
  }

  return errors;
}

export const formatBirthDate = (date: string): number => {
  const birthDate = new Date(date);
  const dateNow = new Date();
  let diffInMilliseconds: number = dateNow.getTime() - birthDate.getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return Math.floor(diffInMilliseconds / millisecondsInYear);
};

export function formatDate(
  date: Timestamp | string | null | undefined,
  dateFormat: string = "PPP"
): string {
  if (date instanceof Timestamp) {
    return format(date.toDate(), dateFormat);
  }

  if (typeof date === "string") {
    return date;
  }

  return "N/A";
}

export function truncateText(text: string, textLimit = 200) {
  // const words = text.split(" ");
  // if (words.length > textLimit) {
  //   return words.slice(0, textLimit).join(" ") + "...";
  // }
  // return text;

  const truncated =
    text.length > textLimit ? text.slice(0, textLimit) + "..." : text;
  return truncated;
}

export function formatImageSize(value?: number) {
  if (!value) return "0 KB";

  if (value >= 1024 * 1024) {
    return (value / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (value / 1024).toFixed(2) + "KB";
  }
}

export function formatDisplayDate(date: any) {
  const newDate = new Date(date.seconds * 1000);
  return format(newDate, "MMMM d, yyyy 'at' h:mm a");
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const displayShelterName = (shelterNo: number) => {
  return `Shelter ${String(shelterNo).padStart(2, "0")}`;
};

export const ErrorHandler = (error: any, label?: string) => {
  console.error(`${label ? label + ": " : ""}${error.message}`);

  if (error instanceof Error) {
    return `${label ? label + ": " : ""}${error.message}`;
  }

  return "An unknown error occurred";
};

export const thresholdAlertMessage = (sensor: string) => {
  if (sensor == "mq9") {
    return "Detect Gas Leakage";
  } else {
    return "Uknown Alert";
  }
};

export const displayData = (data: any) => {
  console.log("Display Data: ", JSON.stringify(data, null, 2));
};

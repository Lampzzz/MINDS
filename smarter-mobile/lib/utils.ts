import { format } from "date-fns";
import { Alert } from "react-native";

export const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export const ErrorHandler = (error: any) => {
  if (error instanceof Error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  } else {
    console.log("An unknown error occurred");
    throw new Error(String(error));
  }
};

export const formatBirthDate = (date: string): number => {
  const birthDate = new Date(date);
  const dateNow = new Date();
  let diffInMilliseconds: number = dateNow.getTime() - birthDate.getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return Math.floor(diffInMilliseconds / millisecondsInYear);
};

export const formatAnnouncementDate = (
  date: number
): { date: string; time: string } => {
  const announcementDate = new Date(date * 1000);

  return {
    date: format(announcementDate, "MMM dd, yyyy"),
    time: format(announcementDate, "hh:mm a"),
  };
};

export const displayShelterName = (shelterNo: number) => {
  return `Shelter ${String(shelterNo).padStart(2, "0")}`;
};

export const sensorAlertMessage = (sensor: string) => {
  if (sensor === "mq9") {
    return "Potential gas leak detected";
  } else {
    return "";
  }
};

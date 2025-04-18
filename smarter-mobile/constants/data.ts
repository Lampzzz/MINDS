import icons from "./icons";

interface ReportTypes {
  id: number;
  title: string;
  description: string;
  icon: any;
  options?: string[];
}

export const reportTypes: ReportTypes[] = [
  {
    id: 1,
    title: "Shelter Damage",
    description: "The shelter has been damage",
    icon: icons.ShelterDamage,
    options: ["Roof damage", "Door damage", "Other"],
  },
  {
    id: 3,
    title: "Medical",
    description: "Medical assistance needed",
    icon: icons.MedicalAssistance,
    options: ["Urgent medical attention", "Medical supplies needed", "Other"],
  },
  {
    id: 4,
    title: "Security",
    description: "Security concern",
    icon: icons.SecurityConcern,
    options: ["Suspicious activity", "Security personnel needed", "Other"],
  },
  {
    id: 5,
    title: "Other Issues",
    description: "Specific problems",
    icon: icons.OtherIssue,
    options: ["Other"],
  },
];

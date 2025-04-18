import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const GenderBadge = ({ type }: { type: string }) => {
  const getGenderColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "male":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "female":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5 capitalize",
        getGenderColor(type)
      )}
    >
      {type}
    </Badge>
  );
};

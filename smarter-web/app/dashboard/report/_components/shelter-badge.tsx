import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ViewBadge = ({ label }: { label: string }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5",
        "bg-gray-400/10 text-gray-400 border-gray-400/20"
      )}
    >
      {label}
    </Badge>
  );
};

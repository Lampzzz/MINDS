import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const TypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "temporary":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "permanent":
        return "bg-violet-500/10 text-violet-500 border-violet-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5",
        getTypeColor(type)
      )}
    >
      {type}
    </Badge>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under maintenance":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "occupied":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "available":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "defective":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5 capitalize",
        getStatusColor(status)
      )}
    >
      {status}
    </Badge>
  );
};

export const ViewBadge = ({ status }: { status: string }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5 capitalize",
        "bg-gray-500/10 text-gray-500 border-gray-500/20"
      )}
    >
      {status}
    </Badge>
  );
};

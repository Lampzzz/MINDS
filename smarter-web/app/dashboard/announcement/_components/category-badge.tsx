import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CategoryBadge = ({ category }: { category: string }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "notice":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "event":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "emergency":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "maintenance":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5 capitalize",
        getCategoryColor(category)
      )}
    >
      {category}
    </Badge>
  );
};

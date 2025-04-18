import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CategoryBadge = ({ category }: { category: string }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "shelter damage":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "medical":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "security":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border rounded-full px-2.5 py-0.5",
        getCategoryColor(category)
      )}
    >
      {category}
    </Badge>
  );
};

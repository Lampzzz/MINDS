import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Announcement } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, UserCircle, Users } from "lucide-react";
import { getCategoryConfig } from "../../services/category-config";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

export default function AnnouncementModal({
  announcement,
  showModal,
  setShowModal,
}: {
  announcement: Announcement;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const CategoryIcon = getCategoryConfig(announcement.category)?.icon;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CategoryIcon
              size={24}
              color={getCategoryConfig(announcement.category).iconColor}
            />
            <Badge
              className={cn(
                "capitalize",
                getCategoryConfig(announcement.category).colors
              )}
            >
              {announcement.category}
            </Badge>
            <span>{announcement.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ScrollArea className="h-[200px] pr-4">
            <div className="text-sm text-muted-foreground whitespace-pre-wrap ">
              {announcement.description}
            </div>
          </ScrollArea>

          <div className="flex flex-col space-y-2 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>Date Created: {announcement.createdAt}</span>
            </div>

            <div className="flex items-center space-x-2">
              <UserCircle size={16} />
              <span className="font-medium">From:</span>
              <span>{announcement.senderName}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span className="font-medium">To:</span>
              <span>
                {announcement.recipient === "all"
                  ? "All Resident"
                  : announcement.recipient}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

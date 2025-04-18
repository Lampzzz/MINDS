"use client";

import { Clock, UserCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { TextBadge } from "@/components/badge";
import { getCategoryConfig } from "../../services/category-config";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

function AnnouncementDescriptionModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) {
  const CategoryIcon = getCategoryConfig(data?.category)?.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {data?.category && (
              <CategoryIcon
                size={24}
                color={getCategoryConfig(data?.category).iconColor}
              />
            )}
            <Badge
              className={cn(
                "capitalize",
                getCategoryConfig(data?.category).colors
              )}
            >
              {data?.category}
            </Badge>
            <span>{data?.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ScrollArea className="h-[200px] pr-4">
            <div className="text-sm text-muted-foreground whitespace-pre-wrap ">
              {data?.description}
            </div>
          </ScrollArea>

          <div className="flex flex-col space-y-2 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>Date Created: {data?.createdAt}</span>
            </div>

            <div className="flex items-center space-x-2">
              <UserCircle size={16} />
              <span className="font-medium">From:</span>
              <span>{data?.sender}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span className="font-medium">To:</span>
              <span>
                {data?.recipient === "all" ? "All Resident" : data?.recipient}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AnnouncementDescriptionButton({
  title,
  category,
  description,
  createdAt,
  sender,
  recipient,
}: {
  title: string;
  category: string;
  description: string;
  createdAt: string;
  sender: string;
  recipient: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResidents = async () => {
      setIsLoading(true);

      try {
        if (isMounted) {
          setData({
            title,
            category,
            description,
            createdAt,
            sender,
            recipient,
          });
        }
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchResidents();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <TextBadge label="Read" />
      </button>
      <AnnouncementDescriptionModal
        data={data}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

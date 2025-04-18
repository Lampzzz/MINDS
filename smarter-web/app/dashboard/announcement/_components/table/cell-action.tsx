"use client";

import useAnnouncementStore from "@/store/announcement-store";
import AnnouncementModal from "../modal/announcement";
import { deleteAnnouncementById } from "@/firebase/firestore/announcement";
import { toast } from "sonner";
import { useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: Announcement;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { fetchAnnouncements } = useAnnouncementStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onConfirm = async () => {
    setLoading(true);

    try {
      const response = await deleteAnnouncementById(data.id!);

      if (!response.success) {
        return toast.error(response.message);
      }

      await fetchAnnouncements();
      toast.success(response.message);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    router.push(`/dashboard/announcement/${data.id}`);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Are you sure you want to delete this announcement?"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={updateData}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnnouncementModal
        announcement={data}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

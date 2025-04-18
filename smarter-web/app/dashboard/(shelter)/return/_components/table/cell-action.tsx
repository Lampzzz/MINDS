"use client";

import { deleteReturnShelter } from "@/firebase/firestore/return-shelter";
import { useState } from "react";
import { MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { ReturnShelter } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
  data: ReturnShelter;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    setOpen(false);

    try {
      const response = await deleteReturnShelter(data.id!);

      if (!response.success) {
        return toast.error(response.message);
      }

      toast.success(response.message);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async () => {
    setOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setLoading(false);
        }}
        onConfirm={onConfirm}
        loading={loading}
        title="Are you sure you want to delete this shelter?"
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
          <DropdownMenuItem onClick={openModal}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

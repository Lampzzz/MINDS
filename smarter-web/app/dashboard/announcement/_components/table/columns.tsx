"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Announcement } from "@/types";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "../category-badge";
import { AnnouncementDescriptionButton } from "../modal/announcement-description";

export const columns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Title
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const truncatedTitle =
        title.length > 50 ? `${title.slice(0, 40)}...` : title;
      return <p>{truncatedTitle}</p>;
    },
  },
  {
    accessorKey: "description",
    header: "Details",
    cell: ({ row }) => (
      <AnnouncementDescriptionButton
        category={row.getValue("category")}
        description={row.getValue("description")}
        title={row.getValue("title")}
        sender={row.getValue("senderName")}
        createdAt={row.getValue("createdAt")}
        recipient={row.getValue("recipient")}
      />
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryBadge category={row.getValue("category")} />,
  },
  {
    accessorKey: "senderName",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Sender
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "recipient",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Recipient
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const recipient = row.getValue("recipient") as string;

      if (recipient === "all") {
        return <p>All Resident</p>;
      }

      return <p>{recipient}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Date Created
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

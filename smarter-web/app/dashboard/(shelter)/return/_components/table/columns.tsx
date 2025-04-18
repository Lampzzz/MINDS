"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ReturnShelter } from "@/types";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<ReturnShelter>[] = [
  {
    accessorKey: "shelterName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shelter Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "shelterLocation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shelter Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.shelterLocation}</span>
    ),
  },
  {
    accessorKey: "managerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Returner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "adminName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Receiver
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "returnDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
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

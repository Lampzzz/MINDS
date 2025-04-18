"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Manager } from "@/types";
import { GenderBadge } from "../../../_components/cell-badge";

export const columns: ColumnDef<Manager>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Full Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Email
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Phone Number
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Age
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <GenderBadge type={row.getValue("gender")} />,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Address
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  // {
  //   accessorKey: "bodyTemp",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="justify-start px-0 font-medium"
  //       >
  //         Body Temp
  //         <ArrowUpDown className="ml-1 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   enableSorting: true,
  //   sortingFn: "basic",
  // },
  // {
  //   accessorKey: "bodyTempDate",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="justify-start px-0 font-medium"
  //       >
  //         Body Temp Date
  //         <ArrowUpDown className="ml-1 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   enableSorting: true,
  //   sortingFn: "basic",
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { GenderBadge } from "@/app/dashboard/(resident)/_components/cell-badge";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    accessorKey: "managerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Manager
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

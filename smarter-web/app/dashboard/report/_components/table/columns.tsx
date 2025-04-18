"use client";

import useReportStore from "@/store/report-store";
import { ReportDescriptionButton } from "../modal/report-description";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Report } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "../category-badge";
import { updateEmergencyById } from "@/firebase/firestore/emergency";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusCell = ({ id, value }: { id: string; value: string }) => {
  const { fetchReports } = useReportStore();

  const statuses = [
    {
      value: "ongoing",
      label: "Ongoing",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    {
      value: "done",
      label: "Done",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
      value: "pending",
      label: "Pending",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
  ];

  const updateStatus = async (newValue: string) => {
    try {
      const response = await updateEmergencyById(id, newValue);

      if (response.success) {
        await fetchReports();
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="mr-4">
      <Select value={value} onValueChange={updateStatus}>
        <SelectTrigger className="w-[90px] border-0 p-0">
          <SelectValue placeholder="Select status">
            {value && (
              <Badge
                variant="outline"
                className={`${
                  statuses.find((s) => s.value === value)?.className
                } border`}
              >
                {statuses.find((s) => s.value === value)?.label}
              </Badge>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="mx-auto">
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <Badge variant="outline" className={`${status.className} border`}>
                {status.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "managerName",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Manager Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shelterName",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Shelter Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "location",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Loacation
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryBadge category={row.getValue("category")} />,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <ReportDescriptionButton
        category={row.getValue("category")}
        description={row.getValue("description")}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusCell id={row.original.id} value={row.getValue("status")} />
    ),
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    sortingFn: "basic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start px-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

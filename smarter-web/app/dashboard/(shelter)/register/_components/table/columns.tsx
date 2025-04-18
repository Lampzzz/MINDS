"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Shelter } from "@/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./cell-badge";
import { OccupantsButton } from "../modal/occupants";
import { ShelterImagesButton } from "../modal/shelter-image";
import { ShelterCameraButton } from "../modal/shelter-camera";

interface ShelterColumn extends Shelter {
  cameraUrl?: string;
}

export const columns: ColumnDef<ShelterColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    header: "Images",
    cell: ({ row }) => (
      <ShelterImagesButton
        images={row.original.images || []}
        name={row.original.name || ""}
      />
    ),
  },
  {
    header: "Monitor",
    cell: ({ row }) => (
      <ShelterCameraButton
        shelterDeviceId={row.original.shelterDeviceId || ""}
        cameraUrl={row.original.cameraUrl || ""}
        shelterName={row.original.name || ""}
      />
    ),
  },
  {
    header: "Residents",
    cell: ({ row }) => <OccupantsButton managerId={row.original.managerId!} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Analytics } from "@/types";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Analytics>[] = [
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
    accessorKey: "shelterTemperature",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Temperature
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => {
      const temp = row.getValue("shelterTemperature") as number;

      return <p>{`${Math.round(temp)}°C`}</p>;
    },
  },
  {
    accessorKey: "humidity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Humidity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => {
      const humidity = row.getValue("humidity") as number;

      return <p>{`${Math.round(humidity)}%`}</p>;
    },
  },
  {
    accessorKey: "airQuality",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Air Quality
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => {
      const airQuality = row.getValue("airQuality") as number;

      return <p>{`${Math.round(airQuality)} AQI`}</p>;
    },
  },
  {
    accessorKey: "batteryPercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Battery Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => {
      const batteryPercentage = row.getValue("batteryPercentage") as number;

      return <p>{`${Math.round(batteryPercentage)}%`}</p>;
    },
  },
  {
    accessorKey: "batteryRemainingUsageTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Battery Time Left
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start px-0 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: "basic",
  },
];

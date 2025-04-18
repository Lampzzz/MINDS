"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOverviewFilter } from "@/hooks/use-overview-filter";

type MonthValue =
  | "all"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export function YearSelect() {
  const { year, setYear } = useOverviewFilter();
  const currentYear = new Date().getFullYear();
  const YEARS_RANGE = 50;

  const years = React.useMemo(() => {
    const yearList = Array.from({ length: YEARS_RANGE }, (_, i) =>
      (currentYear - i).toString()
    );
    return ["all", ...yearList];
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-semibold">Year</p>
      <div className="w-[100px]">
        <Select defaultValue={year} onValueChange={(value) => setYear(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year === "all" ? "All" : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function MonthSelect() {
  const { month, setMonth } = useOverviewFilter();
  const months: MonthValue[] = [
    "all",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const monthNames: Record<string, string> = {
    all: "All",
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-semibold">Month</p>
      <div className="w-[100px]">
        <Select defaultValue={month} onValueChange={(value) => setMonth(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {monthNames[month]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

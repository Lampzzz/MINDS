"use client";

import useReportStore from "@/store/report-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useReportStore();

  return (
    <Heading
      title={`Report (${totalData})`}
      description="View and manage emergency reports submitted by residents"
    />
  );
}

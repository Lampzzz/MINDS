"use client";

import { Heading } from "@/components/heading";
import { useAnalyticsStore } from "@/store/analytics-store";

export function Header() {
  const { totalData } = useAnalyticsStore();

  return (
    <Heading
      title={`Shelters Analytics (${totalData})`}
      description="View and analyze shelter conditions"
    />
  );
}

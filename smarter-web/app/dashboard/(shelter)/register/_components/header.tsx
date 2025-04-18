"use client";

import useShelterStore from "@/store/shelter-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useShelterStore();

  return (
    <Heading
      title={`Shelter (${totalData})`}
      description="View and manage all aspects of shelter operations efficiently"
    />
  );
}

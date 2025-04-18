"use client";

import useReturnShelterStore from "@/store/return-shelter-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useReturnShelterStore();

  return (
    <Heading
      title={`Return Shelter (${totalData})`}
      description="Manage the shelters that are being returned"
    />
  );
}

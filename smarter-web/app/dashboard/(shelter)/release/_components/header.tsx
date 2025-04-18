"use client";

import useReleaseShelterStore from "@/store/release-shelter-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useReleaseShelterStore();

  return (
    <Heading
      title={`Shelter Assign (${totalData})`}
      description="Manage the shelters that are already released for use"
    />
  );
}

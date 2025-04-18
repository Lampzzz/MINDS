"use client";

import useUserStore from "@/store/manager-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useUserStore();

  return (
    <Heading
      title={`Shelter Manager (${totalData})`}
      description="Overview and management of shelter managers"
    />
  );
}

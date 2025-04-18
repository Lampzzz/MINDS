"use client";

import useMemberStore from "@/store/member-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useMemberStore();

  return (
    <Heading
      title={`Shelter Member (${totalData})`}
      description="Overview and management of shelter members"
    />
  );
}

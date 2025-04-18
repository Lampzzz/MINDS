"use client";

import useAnnouncementStore from "@/store/announcement-store";
import { Heading } from "@/components/heading";

export function Header() {
  const { totalData } = useAnnouncementStore();

  return (
    <Heading
      title={`Announcement (${totalData})`}
      description="Important shelter updates for all residents"
    />
  );
}

"use client";

import useManagerStore from "@/store/manager-store";
import useShelterStore from "@/store/shelter-store";
import useMemberStore from "@/store/member-store";
import useAnnouncementStore from "@/store/announcement-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { House, Users, Megaphone, Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOverviewFilter } from "@/hooks/use-overview-filter";
import useReportStore from "@/store/report-store";

export default function TotalData() {
  const router = useRouter();
  const { year, month } = useOverviewFilter();
  const { fetchShelters, shelters } = useShelterStore();
  const { fetchManagers, managers } = useManagerStore();
  const { fetchMembers, members } = useMemberStore();
  const { fetchReports, reports } = useReportStore();
  const { fetchAnnouncements, announcements } = useAnnouncementStore();

  useEffect(() => {
    fetchManagers();
    fetchShelters();
    fetchMembers();
    fetchAnnouncements();
    fetchReports();
  }, [year, month]);

  const getTotalData = (data: any) => {
    let total = 0;

    if (data.length === 0) return 0;
    if (year === "all" && month === "all") return (total = data.length);

    total = data.filter((item: any) => {
      const itemDate = new Date(item.createdAt.seconds * 1000);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth() + 1;

      const yearMatch = year !== "all" ? itemYear === Number(year) : true;
      const monthMatch = month !== "all" ? itemMonth === Number(month) : true;

      return yearMatch && monthMatch;
    }).length;

    return total;
  };

  const cardData = useMemo(
    () => [
      {
        title: "Total Shelter",
        total: getTotalData(shelters),
        change: "+3 from last month",
        icon: <House className="h-4 w-4 text-muted-foreground" />,
        link: "/dashboard/shelter",
      },
      {
        title: "Total Resident",
        total: getTotalData(managers) + getTotalData(members),
        change: "+32 from last month",
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
        link: "/dashboard/manager",
      },
      {
        title: "Total Announcement",
        total: getTotalData(announcements),
        change: "+201 from last month",
        icon: <Megaphone className="h-4 w-4 text-muted-foreground" />,
        link: "/dashboard/announcement",
      },
      {
        title: "Total Report",
        total: getTotalData(reports),
        change: "+32 from last month",
        icon: <Siren className="h-4 w-4 text-muted-foreground" />,
        link: "/dashboard/report",
      },
    ],
    [shelters, managers, members, announcements, reports, year, month]
  );

  return cardData.map((card, index) => (
    <Card
      key={index}
      onClick={() => router.push(card.link)}
      className="cursor-pointer transition duration-200 hover:bg-muted"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
        {card.icon}
      </CardHeader>
      <CardContent className="mt-2">
        <div className="text-2xl font-bold">{card.total}</div>
      </CardContent>
    </Card>
  ));
}

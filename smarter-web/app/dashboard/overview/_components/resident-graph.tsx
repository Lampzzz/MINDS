"use client";

import useMemberStore from "@/store/member-store";
import useManagerStore from "@/store/manager-store";
import { useEffect, useMemo } from "react";
import { Manager, Member } from "@/types";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOverviewFilter } from "@/hooks/use-overview-filter";

type Resident = Manager | Member;

const months: Record<string, number> = {
  January: 0,
  February: 0,
  March: 0,
  April: 0,
  May: 0,
  June: 0,
  July: 0,
  August: 0,
  September: 0,
  October: 0,
  November: 0,
  December: 0,
};

const chartConfig = {
  resident: {
    label: "Resident",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AreaGraph() {
  const { year } = useOverviewFilter();
  const { managers, fetchManagers } = useManagerStore();
  const { members, fetchMembers } = useMemberStore();

  useEffect(() => {
    fetchManagers();
    fetchMembers();
  }, []);

  const residentData = useMemo(() => {
    const data: Resident[] = [...(managers || []), ...(members || [])];
    const monthOrder = Object.keys(months);
    const cumulativeCounts: Record<string, number> = { ...months };
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentMonthIndex = monthOrder.indexOf(currentMonth);

    const filteredData = data.filter((resident) => {
      const date = new Date(resident.createdAt!.seconds * 1000);
      const residentYear = date.getFullYear();
      return year === "all" || residentYear === parseInt(year);
    });

    filteredData.forEach((resident) => {
      const date = new Date(resident.createdAt!.seconds * 1000);
      const residentYear = date.getFullYear();
      const monthName = date.toLocaleString("default", { month: "long" });
      const startIndex = monthOrder.indexOf(monthName);

      if (year === "all") {
        if (residentYear <= currentYear) {
          const endIndex =
            residentYear === currentYear
              ? currentMonthIndex
              : monthOrder.length - 1;
          for (let i = startIndex; i <= endIndex; i++) {
            cumulativeCounts[monthOrder[i]] += 1;
          }
        }
      } else {
        const selectedYear = parseInt(year);
        if (residentYear === selectedYear) {
          const endIndex =
            selectedYear === currentYear
              ? currentMonthIndex
              : monthOrder.length - 1;
          for (let i = startIndex; i <= endIndex; i++) {
            cumulativeCounts[monthOrder[i]] += 1;
          }
        }
      }
    });

    return monthOrder.map((month) => ({
      month,
      count: cumulativeCounts[month],
    }));
  }, [managers, members, year]);

  const getCurrentAndPreviousMonth = () => {
    const date = new Date();
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);

    return {
      currentMonthName: currentMonth.toLocaleString("default", {
        month: "long",
      }),
      previousMonthName: previousMonth.toLocaleString("default", {
        month: "long",
      }),
    };
  };

  const calculatePercentageChange = useMemo(() => {
    const { currentMonthName, previousMonthName } =
      getCurrentAndPreviousMonth();
    const currentMonthData = residentData.find(
      (item) => item.month === currentMonthName
    );
    const previousMonthData = residentData.find(
      (item) => item.month === previousMonthName
    );

    const currentCount = currentMonthData?.count || 0;
    const previousCount = previousMonthData?.count || 0;

    let percentageChange = 0;

    if (previousCount === 0 && currentCount > 0) {
      percentageChange = 100;
    } else if (previousCount === 0 && currentCount === 0) {
      percentageChange = 0;
    } else {
      percentageChange = ((currentCount - previousCount) / previousCount) * 100;
    }

    return {
      change: Math.abs(percentageChange).toFixed(1),
      isIncrease: percentageChange >= 0,
      currentMonth: currentMonthName,
      previousMonth: previousMonthName,
    };
  }, [residentData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shelter Residents</CardTitle>
        <CardDescription>
          Displaying the cumulative number of residents across shelters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            data={residentData}
            margin={{
              right: 20,
              left: 20,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="var(--color-resident)"
              fillOpacity={0.4}
              stroke="var(--color-resident)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Resident occupancy{" "}
              {calculatePercentageChange.isIncrease ? "increased" : "decreased"}{" "}
              by {calculatePercentageChange.change}% this month{" "}
              {calculatePercentageChange.isIncrease ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Cumulative resident status
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

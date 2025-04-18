"use client";

import useShelterStore from "@/store/shelter-store";
import { useEffect, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
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
import { months } from "@/constants/data";

const chartConfig = {
  count: {
    label: "Count",
  },
  available: {
    label: "Available",
    color: "hsl(var(--chart-1))",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-2))",
  },
  occupied: {
    label: "Occupied",
    color: "hsl(var(--chart-3))",
  },
  defective: {
    label: "Defective",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ShelterPieGraph() {
  const { shelters, fetchShelters, cleanup } = useShelterStore();
  const { year, month } = useOverviewFilter();

  useEffect(() => {
    fetchShelters();
    return () => cleanup();
  }, [year, month]);

  const filteredShelter = useMemo(() => {
    if (!shelters) return [];

    if (year === "all" && month === "all") {
      return shelters;
    }

    return shelters.filter((item) => {
      const shelterDate = new Date(item.createdAt!.seconds * 1000);
      const shelterYear = shelterDate.getFullYear();
      const shelterMonth = shelterDate.getMonth() + 1;

      const yearMatch = year === "all" || shelterYear === Number(year);
      const monthMatch = month === "all" || shelterMonth === Number(month);

      return yearMatch && monthMatch;
    });
  }, [shelters, year, month]);

  const chartData = useMemo(() => {
    const statusCounts = filteredShelter!.reduce(
      (acc, shelter) => {
        const status = shelter.status.toLowerCase();
        if (status in acc) {
          acc[status as keyof typeof acc] += 1;
        }
        return acc;
      },
      { available: 0, maintenance: 0, occupied: 0, defective: 0 }
    );

    return [
      {
        status: "available",
        count: statusCounts.available,
        fill: chartConfig.available.color,
      },
      {
        status: "under maintenance",
        count: statusCounts.maintenance,
        fill: chartConfig.maintenance.color,
      },
      {
        status: "occupied",
        count: statusCounts.occupied,
        fill: chartConfig.occupied.color,
      },
      {
        status: "defective",
        count: statusCounts.defective,
        fill: chartConfig.defective.color,
      },
    ];
  }, [shelters]);

  const totalShelters = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const availableShelters = useMemo(() => {
    return chartData.find((d) => d.status === "available")?.count || 0;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Shelter Status</CardTitle>
        <CardDescription>Overview of shelter statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          {shelters!.length > 0 ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalShelters.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Shelters
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                No shelters found
              </p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {availableShelters} of {totalShelters} shelters are available
        </div>
        <p className="leading-none text-muted-foreground">
          Showing shelter status
        </p>
      </CardFooter>
    </Card>
  );
}

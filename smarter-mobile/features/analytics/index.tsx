import useResidentStore from "@/store/resident-store";
import { View } from "react-native";
import { useEffect } from "react";
import { Analytics as Metrics } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { OccupantsCard } from "./components/occupants-card";
import { TemperatureCard } from "./components/temperature-card";
import { AirQualityCard } from "./components/air-quality-card";
import { BatteryCard } from "./components/battery-card";
import { HumidityCard } from "./components/humidity-card";

interface AnalyticsProps {
  latestMetric: Metrics | null;
}

export const Analytics = ({ latestMetric }: AnalyticsProps) => {
  const { members, fetchMembers } = useResidentStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser?.id) {
      fetchMembers(currentUser.id);
    }
  }, [currentUser]);

  return (
    <View className="flex-column">
      <BatteryCard
        data={latestMetric?.batteryPercentage ?? 0}
        batteryRemainingTime={latestMetric?.batteryRemainingUsageTime ?? "0"}
      />
      <TemperatureCard data={latestMetric?.shelterTemperature ?? 0} />
      <AirQualityCard data={latestMetric?.airQuality ?? 0} />
      <HumidityCard data={latestMetric?.humidity ?? 0} />
      {/* <OccupantsCard data={members.length} /> */}
    </View>
  );
};

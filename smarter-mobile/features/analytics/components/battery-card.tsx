import { View } from "react-native";
import { AnalyticsCard } from "./analytics-card";
import { icons } from "@/constants";
import { InfoLabel } from "./info-label";
import { getBatteryLabel } from "../utils/info-label";
import { DataDisplay } from "./data-display";
import { convertToHoursAndMinutes } from "../utils/format-data";

interface BatteryCardProps {
  data: number;
  batteryRemainingTime: string;
}

export const BatteryCard = ({
  data,
  batteryRemainingTime,
}: BatteryCardProps) => {
  let formatData = data >= 100 ? 100 : Math.round(data);
  const remainingTime = convertToHoursAndMinutes(batteryRemainingTime);

  return (
    <AnalyticsCard Icon={icons.BatteryCircle}>
      <View className="flex flex-row items-center">
        <DataDisplay data={`${formatData}%`} text={"battery"} />
        <View className="ml-1">
          <DataDisplay data={remainingTime.number} text={remainingTime.text} />
        </View>
      </View>
      <InfoLabel label={getBatteryLabel(data)} />
    </AnalyticsCard>
  );
};

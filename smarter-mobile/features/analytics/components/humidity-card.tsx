import { View } from "react-native";
import { AnalyticsCard } from "./analytics-card";
import { icons } from "@/constants";
import { InfoLabel } from "./info-label";
import { DataDisplay } from "./data-display";
import { getHumidityLabel } from "../utils/info-label";

interface HumidityCardProps {
  data: number;
}

export const HumidityCard = ({ data }: HumidityCardProps) => {
  const roundedData = Math.round(data);

  return (
    <AnalyticsCard Icon={icons.HumidityCircle}>
      <View className="flex flex-row items-center">
        <DataDisplay data={roundedData} text={"humidity"} />
      </View>
      <InfoLabel label={getHumidityLabel(roundedData)} />
    </AnalyticsCard>
  );
};

import { View } from "react-native";
import { AnalyticsCard } from "./analytics-card";
import { icons } from "@/constants";
import { getAirQualityLabel } from "../utils/info-label";
import { InfoLabel } from "./info-label";
import { DataDisplay } from "./data-display";

interface AirQualityCardProps {
  data: number;
}

export const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const roundedData = Math.round(data);

  return (
    <AnalyticsCard Icon={icons.WindCircle}>
      <View className="flex flex-row items-center">
        <DataDisplay data={roundedData} text="aqi" />
      </View>
      <InfoLabel label={`${getAirQualityLabel(roundedData)} air quality`} />
    </AnalyticsCard>
  );
};

import { View } from "react-native";
import { AnalyticsCard } from "./analytics-card";
import { icons } from "@/constants";
import { DataDisplay } from "./data-display";
import { getTemperatureLabel } from "../utils/info-label";
import { InfoLabel } from "./info-label";

interface TemperatureCardProps {
  data: number;
}

export const TemperatureCard = ({ data }: TemperatureCardProps) => {
  const roundedData = Math.round(data);

  return (
    <AnalyticsCard Icon={icons.TemperatureCircle}>
      <View className="flex flex-row items-center">
        <DataDisplay data={roundedData} text={"celsius"} />
      </View>
      <InfoLabel label={`${getTemperatureLabel(roundedData)} temperature`} />
    </AnalyticsCard>
  );
};

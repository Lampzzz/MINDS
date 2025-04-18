import { View } from "react-native";
import { AnalyticsCard } from "./analytics-card";
import { icons } from "@/constants";
import { InfoLabel } from "./info-label";
import { DataDisplay } from "./data-display";

interface OccupantsCardProps {
  data: number;
}

export const OccupantsCard = ({ data }: OccupantsCardProps) => {
  return (
    <AnalyticsCard Icon={icons.UserCircle}>
      <View className="flex flex-row items-center">
        <DataDisplay data={data} text="of" />
        <View className="ml-1">
          <DataDisplay data={5} text="occupants" />
        </View>
      </View>
      <InfoLabel label="Person inside shelter" />
    </AnalyticsCard>
  );
};

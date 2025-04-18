import { Badge } from "react-native-paper";
import { getTemperatureColor } from "../utils/get-temp-color";

export const TemperatureBadge = ({ temperature }: { temperature: number }) => {
  return (
    <Badge
      size={24}
      style={{
        backgroundColor: getTemperatureColor(temperature),
        paddingHorizontal: 12,
        color: "#000",
      }}
    >
      {temperature}
    </Badge>
  );
};

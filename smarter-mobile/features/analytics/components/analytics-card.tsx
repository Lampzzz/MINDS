import { View } from "react-native";

interface AnalyticsCardProps {
  Icon: React.ComponentType<any>;
  children: React.ReactNode;
}

export const AnalyticsCard = ({ Icon, children }: AnalyticsCardProps) => (
  <View className="px-4">
    <View
      className="bg-white rounded-2xl p-4 flex-1 mb-4 flex-row space-x-4"
      style={{
        shadowColor: "#000000B3",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
      }}
    >
      <View>
        <Icon />
      </View>
      <View>{children}</View>
    </View>
  </View>
);

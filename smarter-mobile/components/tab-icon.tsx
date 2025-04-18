import clsx from "clsx";
import { View, Text } from "react-native";
import { TabIconProps } from "@/types";

export function TabIcon({ Icon, name, focused }: TabIconProps) {
  return (
    <View className="flex-1 justify-center items-center gap-1 relative">
      <Icon />
      <Text
        numberOfLines={1}
        className={clsx(
          "text-xs",
          focused ? "font-urbanist-semibold" : "font-urbanist-regular"
        )}
        style={{ color: focused ? "#EA580CE5" : "#737373", width: "100%" }}
      >
        {name}
      </Text>
    </View>
  );
}

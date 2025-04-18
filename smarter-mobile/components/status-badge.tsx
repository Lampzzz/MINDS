import { View, Text } from "react-native";
import React from "react";
import clsx from "clsx";

type StatusConfig = {
  icon: React.ElementType;
  backgroundColor: string;
  textColor: string;
  label: string;
};

interface StatusBadgeProps {
  status: string;
  configurations: Record<string, StatusConfig>;
  value?: number;
}

const StatusBadge = ({ status, configurations, value }: StatusBadgeProps) => {
  const config = configurations[status];
  const IconComponent = config.icon;

  return (
    <View
      className={clsx(
        "flex flex-row items-center justify-between px-3 py-1.5 rounded-full",
        config.backgroundColor
      )}
    >
      <IconComponent size={16} className={config.textColor} />
      <Text className={clsx("text-xs font-mregular ml-1", config.textColor)}>
        {config.label}
      </Text>
    </View>
  );
};

export default StatusBadge;

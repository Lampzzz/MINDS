import { View, Text } from "react-native";

interface InfoHeaderProps {
  title: string;
  description: string;
}

export const InfoHeader = ({ title, description }: InfoHeaderProps) => {
  return (
    <View className="items-start w-full">
      <Text className="text-2xl font-semibold">{title}</Text>
      <Text className="text-sm text-text-secondary">{description}</Text>
    </View>
  );
};

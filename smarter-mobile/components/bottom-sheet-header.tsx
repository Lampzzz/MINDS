import { View, Text } from "react-native";

interface BottomSheetHeaderProps {
  title: string;
  description: string;
}

export const BottomSheetHeader = ({
  title,
  description,
}: BottomSheetHeaderProps) => {
  return (
    <View className="items-start w-full">
      <Text className="text-2xl font-urbanist-semibold">{title}</Text>
      <Text className="text-sm text-text-secondary font-urbanist-regular">
        {description}
      </Text>
    </View>
  );
};

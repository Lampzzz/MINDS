import { View, Text } from "react-native";
import { icons } from "@/constants";

export const HelpCard = () => {
  return (
    <View className="p-5 bg-fill-secondary rounded-2xl flex-row space-x-4">
      <icons.Quote />
      <View className="flex-shrink space-y-4">
        <Text className="font-urbanist-regular text-sm">
          If you're having trouble registering your account, please reach out to
          a registration assistant for help
        </Text>
        <Text className="text-sm font-urbanist-semibold">
          Registration Assistant
        </Text>
      </View>
    </View>
  );
};

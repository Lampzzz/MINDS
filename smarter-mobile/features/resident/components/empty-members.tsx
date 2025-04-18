import { View, Text } from "react-native";

export const EmptyMembers = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <View className=" items-center justify-center">
        <Text className="text-center text-text-secondary text-sm mt-1">
          No Members yet
        </Text>
      </View>
    </View>
  );
};

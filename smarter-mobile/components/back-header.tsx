import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

export const BackHeader = ({ label }: { label: string }) => {
  return (
    <View className="flex-row items-center">
      <TouchableOpacity onPress={() => router.back()}>
        <icons.ArrowLeft />
      </TouchableOpacity>
      <Text className="text-2xl ml-4 font-urbanist-semibold">{label}</Text>
    </View>
  );
};

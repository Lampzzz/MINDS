import { View, Text, Image } from "react-native";
import { images } from "@/constants";

export function Title() {
  return (
    <View className="flex-row items-center space-x-1 mb-4">
      <Image source={images.logo} className="w-9 h-9" />
      <Text className="text-3xl font-urbanist-bold text-primary">Smarter</Text>
    </View>
  );
}

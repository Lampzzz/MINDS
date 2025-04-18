import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Loading = () => {
  return (
    <SafeAreaView className="bg-white h-full items-center justify-center">
      <ActivityIndicator size="large" color="#F58509" />
    </SafeAreaView>
  );
};

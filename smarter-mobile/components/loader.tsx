import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Loader = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#F58509" />
    </SafeAreaView>
  );
};

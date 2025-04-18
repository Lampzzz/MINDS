import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FullLoader = () => {
  return (
    <SafeAreaView className="bg-white flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#EA580C" />
    </SafeAreaView>
  );
};

export default FullLoader;

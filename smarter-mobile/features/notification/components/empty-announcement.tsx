import { View, Text } from "react-native";
import { Bell } from "lucide-react-native";

export const EmptyAnnouncement = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className=" items-center justify-center">
        {/* <Bell size={60} color="#EA580C" /> */}
        <Text className="text-base font-urbanist-semibold mt-4">
          You don't have any notifications yet
        </Text>
        {/* <Text className="text-center text-text-secondary text-sm mt-1">
          Stay tuned for important updates and announcements
        </Text> */}
      </View>
    </View>
  );
};

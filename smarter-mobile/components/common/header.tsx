import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";
import { useAuthStore } from "@/store/auth-store";
import { useAnnouncementStore } from "@/store/announcement-store";
import { useEffect } from "react";

export const Header = ({ label }: { label: string }) => {
  const { currentUser } = useAuthStore();
  const { announcements, fetchAnnouncements, cleanup } = useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
    return () => cleanup();
  }, []);

  const hasUnreadAnnouncements = announcements.some(
    (item) => !item.readBy?.includes(currentUser?.id!)
  );

  return (
    <View className="flex-row items-center justify-between mt-2 mb-6">
      <Text className="text-2xl font-urbanist-bold text-text">{label}</Text>
      <View className="flex-row gap-2 items-center">
        <Pressable
          className="relative"
          onPress={() => router.push("/notification")}
        >
          <View className="p-2 rounded-full relative">
            <icons.Bell />
            {hasUnreadAnnouncements ? (
              <View className="h-2 w-2 bg-red-500 rounded-full absolute right-1.5 top-1.5" />
            ) : null}
          </View>
        </Pressable>
        <Pressable className="relative" onPress={() => router.push("/profile")}>
          {currentUser && (
            <View className="w-[34px] h-[34px] rounded-full items-center justify-center bg-primary">
              <Text className="text-base font-urbanist-bold text-white">
                {(currentUser!.fullName || "")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")
                  .slice(0, 1) || "X"}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export const BackHeader = ({ label }: { label: string }) => {
  return (
    <View className="flex-row items-center mb-8">
      <TouchableOpacity onPress={() => router.back()}>
        <icons.ArrowLeft />
      </TouchableOpacity>
      <Text className="text-xl ml-4 font-msemibold">{label}</Text>
    </View>
  );
};

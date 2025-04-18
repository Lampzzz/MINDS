import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { icons } from "@/constants";
import { useAuthStore } from "@/store/auth-store";
import { useAnnouncementStore } from "@/store/announcement-store";
import { useFetch } from "@/hooks/use-fetch";
import { getShelter } from "@/services/firebase/firestore/shelter";
import { Announcement, Shelter } from "@/types";
import { getAnnouncements } from "@/services/firebase/firestore/announcement";

export const Header = () => {
  const { currentUser } = useAuthStore();
  const { data: shelter } = useFetch<Shelter>(() =>
    getShelter(currentUser?.id!)
  );
  const { data: announcements } = useFetch<Announcement[]>(getAnnouncements);

  const hasUnreadAnnouncements = announcements?.some(
    (item) => !item.readBy?.includes(currentUser?.id!)
  );

  return (
    <View className="flex-row items-center justify-between mt-2 mb-6">
      <Text className="text-2xl font-urbanist-bold text-text">
        {shelter?.name}
      </Text>
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

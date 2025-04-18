import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Announcement } from "@/types";
import { AnnouncementCard } from "./components/announcement-card";
import { EmptyAnnouncement } from "./components/empty-announcement";
import { useAuthStore } from "@/store/auth-store";
import { updateReadAnnouncement } from "@/services/firebase/firestore/announcement";

export const Notification = ({ data }: { data: Announcement[] }) => {
  const { currentUser } = useAuthStore();

  const checkReadStatus = (arr: string[] = []) => {
    const readAnnouncement = arr.filter((value) => value === currentUser?.id);
    return readAnnouncement.length > 0 ? true : false;
  };

  const handlePress = (announcementId: string) => {
    router.push(`/announcement/${announcementId}`);
    updateReadAnnouncement(announcementId, currentUser?.id!);
  };

  return (
    <View className="flex-1">
      {data.length === 0 ? (
        <EmptyAnnouncement />
      ) : (
        <View className="my-6">
          {data.map((announcement, index) => (
            <Pressable
              onPress={() => handlePress(announcement.id!)}
              key={index}
            >
              <AnnouncementCard
                announcement={announcement}
                isRead={checkReadStatus(announcement.readBy!)}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

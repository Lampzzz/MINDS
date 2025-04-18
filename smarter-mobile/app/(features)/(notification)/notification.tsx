import { Text, View } from "react-native";
import { Notification } from "@/features/notification";
import { Container } from "@/components/container";
import { Loading } from "@/components/ui/Loading";
import { BackHeader } from "@/components/back-header";
import { useAnnouncementStore } from "@/store/announcement-store";
import { useEffect } from "react";

const NotificationScreen = () => {
  const { announcements, fetchAnnouncements, cleanup, isLoading } =
    useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
    return () => cleanup();
  }, []);

  return (
    <Container styles="bg-white flex-1 pt-6">
      <View className="px-4">
        <BackHeader label="" />
        <Text className="font-urbanist-semibold text-3xl mt-8 text-text">
          Notifications
        </Text>
      </View>
      {isLoading ? <Loading /> : <Notification data={announcements} />}
    </Container>
  );
};

export default NotificationScreen;

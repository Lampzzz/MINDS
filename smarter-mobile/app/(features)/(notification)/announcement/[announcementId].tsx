import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Container } from "@/components/container";
import { BackHeader } from "@/components/back-header";
import { Announcement as AnnouncementType } from "@/types";
import { getAnnouncement } from "@/services/firebase/firestore/announcement";
import { Loading } from "@/components/ui/Loading";
import { formatAnnouncementDate } from "@/lib/utils";

const Announcement = () => {
  const { announcementId } = useLocalSearchParams();
  const [announcement, setAnnouncement] = useState<AnnouncementType | null>();
  const [isLoading, setLoading] = useState(false);

  const fetchAnnouncement = async () => {
    setLoading(true);

    try {
      const announcement = await getAnnouncement(announcementId as string);
      setAnnouncement(announcement);
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    return () => setAnnouncement(null);
  }, [announcementId]);

  return (
    <Container styles="px-4 py-6">
      <BackHeader label="" />
      {isLoading ? (
        <Loading />
      ) : announcement ? (
        <View className="pb-6">
          <Text className="text-2xl font-urbanist-semibold mb-2">
            {announcement.title}
          </Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-text-secondary font-urbanist-regular">
              Posted by{" "}
              <Text className="text-primary font-urbanist-semibold">
                {announcement.senderName}
              </Text>
            </Text>
            {announcement.createdAt && (
              <>
                <Text className="text-sm text-text-secondary font-urbanist-regular">
                  {formatAnnouncementDate(announcement.createdAt.seconds).time}
                </Text>
                <Text className="text-sm text-text-secondary font-urbanist-regular">
                  {formatAnnouncementDate(announcement.createdAt.seconds).date}
                </Text>
              </>
            )}
          </View>
          <Text className="text-base text-text-secondary mb-4 font-urbanist-regular">
            {announcement.description}
          </Text>
        </View>
      ) : (
        <Text className="font-urbanist-regular text-base">
          No announcement found
        </Text>
      )}
    </Container>
  );
};

export default Announcement;

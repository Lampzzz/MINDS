import { View, Text } from "react-native";
import { Announcement } from "@/types";
import { getCategoryIcon } from "../utils/get-category-icon";
import { format } from "date-fns";
import clsx from "clsx";

export const AnnouncementCard = ({
  announcement,
  isRead,
}: {
  announcement: Announcement;
  isRead: boolean;
}) => {
  const { icon: Icon } = getCategoryIcon(announcement.category);
  const date = new Date(announcement.createdAt.seconds! * 1000);

  return (
    <View
      className={clsx(
        "flex-row items-center justify-between py-4 space-x-2 px-4",
        isRead ? "" : "bg-primary-100"
      )}
    >
      <Icon />
      <View className="flex-1 justify-start mb-1" style={{ flexShrink: 1 }}>
        <Text
          className="font-urbanist-semibold text-base "
          ellipsizeMode="tail"
          style={{ flexWrap: "wrap" }}
        >
          {announcement.title}
        </Text>
        <View className="flex-row items-center gap-x-4">
          <Text
            className="font-urbanist-regular text-xs text-text-secondary"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexWrap: "wrap" }}
          >
            {format(date, "MMM dd, yyyy")}
          </Text>
          <Text
            className="font-urbanist-regular text-xs text-text-secondary"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexWrap: "wrap" }}
          >
            {format(date, "hh:mma").toLowerCase()}
          </Text>
        </View>
      </View>
      {!isRead && <View className="w-2 h-2 rounded-full bg-primary" />}
    </View>
  );
};

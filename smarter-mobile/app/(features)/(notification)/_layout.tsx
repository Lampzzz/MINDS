import { Stack } from "expo-router";

const NotificationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="notification" />
      <Stack.Screen name="announcement/[announcementId]" />
    </Stack>
  );
};

export default NotificationLayout;

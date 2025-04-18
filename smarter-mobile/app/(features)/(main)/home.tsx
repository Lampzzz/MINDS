import PushNotification from "@/features/push-notification";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Controllers } from "@/features/controllers";
import { Analytics } from "@/features/analytics";
import { Header } from "@/components/common/header";
import { Container } from "@/components/layout/container";
import { useAuthStore } from "@/store/auth-store";
import { useAnalyticsStore } from "@/store/analytics-store";
import { useShelterStore } from "@/store/shelter-store";
import { Loading } from "@/components/ui/Loading";

const HomeScreen = () => {
  const { currentUser } = useAuthStore();
  const {
    shelter,
    isLoading: shelterLoading,
    fetchShelter,
    resetShelter,
  } = useShelterStore();
  const {
    latestAnalytics,
    fetchAnalytics,
    cleanup,
    isLoading: analyticsLoading,
  } = useAnalyticsStore();

  useEffect(() => {
    if (currentUser) {
      fetchShelter(currentUser.id!);
    }

    return () => resetShelter();
  }, [currentUser]);

  useEffect(() => {
    if (shelter?.shelterDeviceId) {
      fetchAnalytics(shelter.shelterDeviceId);
    }

    return () => cleanup();
  }, [shelter?.shelterDeviceId]);

  const isLoading = shelterLoading || analyticsLoading;

  if (isLoading && !latestAnalytics) {
    return (
      <Container className="flex-1 justify-center items-center">
        <Loading />
      </Container>
    );
  }

  console.log(shelter);

  return (
    <Container className="pt-4">
      <View className="px-4">
        <Header label={shelter?.name ?? ""} />
        <View className="pb-8">
          <Text className="text-xl mb-4 font-urbanist-bold">Controls</Text>
          <Controllers />
        </View>
      </View>
      <View>
        <Text className="text-xl mb-4 font-urbanist-bold px-4">Analytics</Text>
        <Analytics latestMetric={latestAnalytics} />
      </View>
      <PushNotification />
    </Container>
  );
};

export default HomeScreen;

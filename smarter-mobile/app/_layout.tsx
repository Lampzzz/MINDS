import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { useAuthStore } from "@/store/auth-store";
import { fonts } from "@/constants";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const {
    initializeAuthListener,
    reset,
    isLoading: authLoading,
    currentUser,
  } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const unsubscribe = initializeAuthListener();

    return () => {
      unsubscribe();
      reset();
    };
  }, []);

  const [fontsLoaded, error] = useFonts({
    "Urbanist-ExtraLight": fonts.extraLight,
    "Urbanist-Light": fonts.light,
    "Urbanist-Regular": fonts.regular,
    "Urbanist-Medium": fonts.medium,
    "Urbanist-SemiBold": fonts.semiBold,
    "Urbanist-Bold": fonts.bold,
    "Urbanist-ExtraBold": fonts.extraBold,
  });

  useEffect(() => {
    if ((fontsLoaded || error) && !authLoading) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, authLoading]);

  if (!appReady) return null;

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(features)" />
      </Stack>
      <StatusBar style="dark" />
    </PaperProvider>
  );
};

export default RootLayout;

import clsx from "clsx";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Tabs } from "expo-router";
import { TabIconProps } from "@/types";
import { icons } from "@/constants";
import { useBottomSheet } from "@/hooks/use-bottom-sheet";
import { AlertModal } from "@/features/alert";
import { useEffect, useState } from "react";
import { getAlerts } from "@/services/firebase/firestore/alert/get-alerts";
import { sensorAlertMessage } from "@/lib/utils";

const TabIcon = ({ Icon, name, focused }: TabIconProps) => {
  return (
    <View className="flex-1 justify-center items-center gap-1 relative">
      <Icon />
      <Text
        numberOfLines={1}
        className={clsx(
          "text-xs",
          focused ? "font-urbanist-semibold" : "font-urbanist-regular"
        )}
        style={{ color: focused ? "#EA580CE5" : "#737373", width: "100%" }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { isVisible } = useBottomSheet();
  const [alerts, setAlerts] = useState<any>([]);

  useEffect(() => {
    const unsubscribe = getAlerts((alertData) => {
      setAlerts(alertData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      Alert.alert("Shelter Alert", sensorAlertMessage(alerts[0].sensor));
    }
  }, [alerts]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#F58509",
          tabBarInactiveTintColor: "#696969",
          tabBarStyle: {
            display: isVisible ? "none" : "flex",
            height: 60,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderTopColor: "#F5F5F5",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#fff",
          },
          tabBarButton: (props: any) => (
            <TouchableOpacity {...props} activeOpacity={1} />
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                Icon={focused ? icons.HomeFocused : icons.Home}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="residents"
          options={{
            title: "Resident",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                Icon={focused ? icons.UsersFocused : icons.Users}
                name="Resident"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Report",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                Icon={focused ? icons.ReportFocused : icons.Report}
                name="Report"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="(notification)"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

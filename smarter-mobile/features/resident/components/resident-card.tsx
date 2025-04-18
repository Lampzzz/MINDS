import { View, Text, Pressable } from "react-native";
import { Manager, Member } from "@/types";
import { format } from "date-fns";
import { icons, images } from "@/constants";
import { Menu } from "react-native-paper";
import { useEffect, useState } from "react";
import { useBottomSheet } from "@/hooks/use-bottom-sheet";
import { useBodyTemperatureStore } from "@/store/body-temperature-store";

interface ManagerCardProps {
  data: Manager | Member | null;
  type: "Manager" | "Member";
}

export const ResidentCard = ({ data, type }: ManagerCardProps) => {
  const { open, setData } = useBottomSheet();
  const { fetchBodyTemperature, bodyTemperatures } = useBodyTemperatureStore();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    if (data?.id) {
      const unsubscribe = fetchBodyTemperature(data?.id);
      return () => unsubscribe();
    }
  }, [data?.id]);

  const openBottomSheet = () => {
    open("bodyTemperature");
    setData({
      residentId: data?.id,
      bodyTemperature: data?.id
        ? (bodyTemperatures[data?.id]?.bodyTemperature ?? "")
        : "",
    });
    closeMenu();
  };

  const bodyTemperature = data?.id ? bodyTemperatures[data?.id] : null;
  const birthDate = new Date(data?.dateOfBirth);

  return (
    <>
      <View className="flex-row items-start space-x-3 py-2.5">
        <View className="relative">
          {type === "Manager" && (
            <images.SmallVioletCrown className="absolute -top-1 -right-1 z-10" />
          )}
          <View className="w-10 h-10 rounded-full items-center justify-center bg-primary-100">
            <Text className="text-base font-urbanist-bold text-primary">
              {(data!.fullName || "")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2) || ""}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold">{data?.fullName}</Text>
          <View className="flex-row items-center space-x-1">
            <icons.Cake />
            <Text className="text-base text-text-secondary font-urbanist-regular">
              {format(birthDate, "MMMM dd, yyyy")}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {data?.gender === "male" ? <icons.Male /> : <icons.Female />}
            <Text className="text-base capitalize text-text-secondary font-urbanist-regular">
              {data?.gender}
            </Text>
          </View>
          {/* <View className="flex-row items-center space-x-1">
            <icons.Thermometer />
            <Text className="text-base capitalize text-text-secondary font-urbanist-regular">
              {bodyTemperature?.bodyTemperature != null
                ? `${bodyTemperature?.bodyTemperature}°C`
                : "N/A"}
            </Text>
          </View> */}
        </View>
        {/* <View>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Pressable onPress={openMenu}>
                <icons.Menu />
              </Pressable>
            }
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              paddingVertical: 0,
            }}
          >
            <Menu.Item
              onPress={openBottomSheet}
              leadingIcon={() => <icons.Thermometer />}
              title="Edit Body Temperature"
              titleStyle={{
                fontSize: 14,
                fontFamily: "Urbanist-Regular",
                color: "#1C1917",
              }}
            />
          </Menu>
        </View> */}
      </View>
    </>
  );
};

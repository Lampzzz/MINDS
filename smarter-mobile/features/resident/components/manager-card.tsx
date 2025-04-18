import { View, Text, Pressable } from "react-native";
import { Manager } from "@/types";
import { format } from "date-fns";
import { icons } from "@/constants";

const ManagerCard = ({ manager }: { manager: Manager | null }) => {
  const birthDate = new Date(manager?.dateOfBirth);

  return (
    <View className="mb-10">
      <Text className="text-xl font-bold mb-3">Manager</Text>
      <View className="flex-row items-start space-x-3 py-2.5">
        <View className="relative">
          {/* <images.SmallVioletCrown className="absolute -top-1 -right-1 z-10" /> */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center bg-primary-100"
            // className={clsx(
            //   "w-10 h-10 rounded-full items-center justify-center",
            //   manager?.gender === "male" ? "bg-blue-200" : "bg-pink-200"
            // )}
          >
            <Text className="text-base font-bold text-primary">
              {(manager!.fullName || "")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
                .slice(0, 1) || ""}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold">{manager?.fullName}</Text>
          <View className="flex-row items-center space-x-1">
            <icons.Cake />
            <Text className="text-base text-text-secondary">
              {format(birthDate, "MMMM dd, yyyy")}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {manager?.gender === "male" ? <icons.Male /> : <icons.Female />}
            <Text className="text-base capitalize text-text-secondary">
              {manager?.gender}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <icons.Thermometer />
            <Text className="text-base capitalize text-text-secondary">
              0°C
            </Text>
          </View>
        </View>
        <Pressable>
          <icons.Menu />
        </Pressable>
      </View>
    </View>
  );
};

export default ManagerCard;

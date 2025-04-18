import clsx from "clsx";
import { View, Text, Pressable } from "react-native";
import { icons } from "@/constants";

const InformationBar = ({
  label,
  value,
  styles,
  onPress,
}: {
  label: string;
  value: string;
  styles?: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable
    // onPress={onPress}
    // style={({ pressed }) => [
    //   {
    //     backgroundColor: pressed ? "#F5F5F5" : "transparent",
    //   },
    // ]}
    >
      <View
        className={clsx(
          "flex flex-row justify-between border-b border-border pb-4",
          styles
        )}
      >
        <View>
          <Text className="text-sm text-text-secondary font-urbanist-regular">
            {label}
          </Text>
          <Text className="text-base font-urbanist-medium text-text">
            {value}
          </Text>
        </View>
        {/* <View className="flex flex-row items-center space-x-2">
          <Text className="underline text-sm font-urbanist-medium text-text-secondary">
            Edit
          </Text>
          <icons.ArrowRight />
        </View> */}
      </View>
    </Pressable>
  );
};

export default InformationBar;

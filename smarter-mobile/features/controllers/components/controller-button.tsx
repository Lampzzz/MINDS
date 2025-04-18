import clsx from "clsx";
import { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface ControllerButtonProps {
  isOn?: boolean;
  icon: LucideIcon;
  label: string;
  currentValue?: string;
  onToggle: () => void;
}

export const ControllerButton = ({
  onToggle,
  icon: Icon,
  label,
  currentValue,
}: ControllerButtonProps) => {
  const [press, setPress] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPress(true)}
      onPressOut={() => setTimeout(() => setPress(false), 50)}
      onPress={onToggle}
      className={clsx(
        "px-4 py-7 rounded-xl flex-1 justify-center items-start",
        press && label === "Door" ? "bg-primary-100" : "bg-secondary",
        currentValue === "on" && "bg-primary-100"
      )}
    >
      <View className="flex-row items-center justify-center space-x-4">
        <Icon
          size={24}
          color={
            (press && label === "Door") || currentValue === "on"
              ? "#EA580C"
              : "#6b7280"
          }
        />
        <View>
          <Text
            className={clsx(
              "text-base text-black font-urbanist-semibold",
              currentValue === "on" && "text-primary",
              press && label == "Door" && "text-primary"
            )}
          >
            {label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

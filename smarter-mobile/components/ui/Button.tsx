import clsx from "clsx";
import { Pressable, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  label: string;
  handlePress?: () => void;
  styles?: string;
  isLoading?: boolean;
}

export const Button = ({
  label,
  handlePress,
  styles,
  isLoading,
}: ButtonProps) => {
  return (
    <Pressable
      className={clsx(
        "border-primary border py-2.5 rounded-md w-full",
        isLoading ? "bg-primary/80" : "bg-primary",
        styles
      )}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text className="text-center font-urbanist-regular text-base text-white">
        {label}
      </Text>
    </Pressable>
  );
};

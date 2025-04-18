import clsx from "clsx";
import { Text, TouchableOpacity } from "react-native";

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
    <TouchableOpacity
      className={clsx(
        "border-primary border py-2.5 rounded-md w-full",
        isLoading ? "bg-primary/90" : "bg-primary",
        styles
      )}
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text className="text-center font-mnormal text-base text-white">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

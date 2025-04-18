import { Text } from "react-native";

export const InfoLabel = ({ label }: { label: string }) => {
  return (
    <Text className="text-sm text-text-secondary font-urbanist-regular">
      {label}
    </Text>
  );
};

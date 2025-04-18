import { View, Text } from "react-native";

export const TermsCondition = () => {
  return (
    <View className="mt-5">
      <Text className="text-text-secondary text-xs font-urbanist-regular">
        By proceeding you acknowledge that you have read, understood and agree
        to our{" "}
        <Text className="text-primary underline font-urbanist-regular">
          Terms and Condition
        </Text>
      </Text>
    </View>
  );
};

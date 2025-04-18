import { View, Text } from "react-native";
import React from "react";

export function AuthHeader() {
  return (
    <View className="mb-8">
      <Text className="font-urbanist-bold text-2xl">Sign in your account</Text>
      <Text className="font-urbanist-regular text-base text-text-secondary">
        Sign in with the account you created with the registration assistant
      </Text>
    </View>
  );
}

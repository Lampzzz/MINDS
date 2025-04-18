import { icons } from "@/constants";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

interface TextFieldProps {
  label: string;
  value: string;
  error?: string;
  style?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}

export const TextField = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  style,
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={style}>
      <View>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          error={error ? true : false}
          mode="outlined"
          activeOutlineColor="#F97316"
          outlineColor="#D4D4D4"
          textColor="#1C1917"
          style={{
            backgroundColor: "#ffffff",
            color: "#1C1917",
            fontFamily: "Urbanist",
          }}
          theme={{
            colors: {
              onSurfaceVariant: "#525252",
            },
          }}
        />
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};

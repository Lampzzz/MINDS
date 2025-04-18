import clsx from "clsx";
import { useState } from "react";
import { Text, View } from "react-native";
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
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      className={clsx(
        "border-x-2 border-t-2 border-b border-border rounded-lg",
        isFocused ? "border-primary" : "border-border",
        style
      )}
    >
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        error={error ? true : false}
        mode="flat"
        // activeUnderlineColor="transparent"
        underlineColor="transparent"
        textColor="#1C1917"
        style={{
          backgroundColor: "#ffffff",
          color: "#1C1917",
          fontFamily: "Urbanist",
          // borderRadius: 8,
        }}
        theme={{
          colors: {
            // onSurfaceVariant: "#525252",
            primary: "#F97316",
          },
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};

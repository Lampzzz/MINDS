import clsx from "clsx";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";

interface FormFieldProps {
  otherStyles?: string;
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  onPressIcon?: () => void;
  isEditable?: boolean;
}

export const FormField = ({
  otherStyles,
  label,
  placeholder,
  value,
  onChangeText,
  error,
  onPressIcon,
  isEditable = true,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={clsx("gap-y-1", otherStyles)}>
      <Text className="font-mmedium text-sm">{label}</Text>
      <View>
        <View
          className={clsx(
            "w-full rounded-lg flex-row items-center border px-4 h-12",
            error ? "border-red-500" : "border-border"
          )}
        >
          <TextInput
            placeholder={placeholder}
            secureTextEntry={label.includes("Password") && !showPassword}
            className="flex-1"
            value={value}
            onChangeText={onChangeText}
            editable={isEditable}
          />
          {label.includes("Password") && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeSlash}
                className="w-5 h-5 opacity-60"
                tintColor="#696969"
              />
            </TouchableOpacity>
          )}
          {label === "Birthdate" && (
            <TouchableOpacity onPress={onPressIcon}>
              <Image
                source={icons.calendar}
                className="w-5 h-5 opacity-60"
                tintColor="#696969"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text className="text-red-500 text-xs ms-5">{error}</Text>}
      </View>
    </View>
  );
};

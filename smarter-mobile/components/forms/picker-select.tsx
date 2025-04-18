import { Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface PickerOptionType {
  label: string;
  value: string;
}

interface PickerSelectProps {
  label: string;
  onChange: (value: string) => void;
  values: PickerOptionType[];
}

export const PickerSelect = ({
  label,
  onChange,
  values,
}: PickerSelectProps) => {
  const pickerSelectStyles = {
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      color: "black",
    },
  };

  return (
    <View className="gap-y-1">
      {/* <Text className="text-sm text-text-secondary">{label}</Text> */}
      <View className="rounded-lg bg-fill-secondary">
        <RNPickerSelect
          onValueChange={(value) => onChange(value)}
          placeholder={{
            label: "Select description",
            value: "",
          }}
          items={values}
          style={pickerSelectStyles}
        />
      </View>
    </View>
  );
};

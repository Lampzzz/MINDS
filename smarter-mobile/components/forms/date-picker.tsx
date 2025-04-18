import clsx from "clsx";
import DatePicker from "react-native-date-picker";
import { View, Text, Pressable } from "react-native";
import { format } from "date-fns";

interface DatePickerFieldProps {
  label: string;
  value: Date;
  error?: string;
  isModalOpen: boolean;
  setDate: (date: Date) => void;
  setModal: (value: boolean) => void;
}

export const DatePickerField = ({
  label,
  value,
  error,
  isModalOpen,
  setDate,
  setModal,
}: DatePickerFieldProps) => {
  const handleConfim = (date: Date) => {
    setModal(false);
    setDate(date);
  };

  return (
    <View className="mb-4">
      {/* <Text className="text-base font-semibold">{label}</Text> */}
      <Pressable
        className={clsx(
          "w-full border rounded-lg flex-row items-center px-4 h-14 border-[#D4D4D4]"
        )}
        onPress={() => setModal(true)}
      >
        <Text>{format(new Date(value), "MMMM dd, yyyy")}</Text>
      </Pressable>
      <DatePicker
        modal
        date={value}
        open={isModalOpen}
        onConfirm={handleConfim}
        mode="date"
        locale="en"
        style={{ flex: 1 }}
        buttonColor="black"
        theme="light"
      />
      {error && <Text className="text-red-500 text-xs ms-5">{error}</Text>}
    </View>
  );
};

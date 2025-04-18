import { Text, View } from "react-native";

interface DataDisplayProps {
  data: string | number;
  text: string;
}

export const DataDisplay = ({ data, text }: DataDisplayProps) => {
  return (
    <View className="flex flex-row items-center">
      <Text className="text-2xl font-urbanist-bold mb-2">{data}</Text>
      <Text className="text-base font-urbanist-meduim ml-1">{text}</Text>
    </View>
  );
};

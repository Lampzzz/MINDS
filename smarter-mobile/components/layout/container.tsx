import clsx from "clsx";
import { useBottomSheet } from "@/hooks/use-bottom-sheet";
import { ScrollView, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ContainerProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const Container = ({ children, ...props }: ContainerProps) => {
  const { isVisible } = useBottomSheet();

  return (
    <SafeAreaView
      className={clsx(
        "flex-1",
        isVisible ? "bg-[rgba(0,0,0,0.3)]" : "bg-white"
      )}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className={clsx("bg-white mt-4", props.className)}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

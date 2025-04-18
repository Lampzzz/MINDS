import clsx from "clsx";
import { ScrollView, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  styles?: string;
}

export const Container = ({ children, styles }: ContainerProps) => {
  return (
    <SafeAreaView className={clsx("flex-1 bg-white")}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className={clsx("bg-white", styles)}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

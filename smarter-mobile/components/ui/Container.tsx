import clsx from "clsx";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
  otherStyles?: string;
  children: React.ReactNode;
  horizontal?: boolean;
}

const Container = ({
  otherStyles,
  children,
  horizontal = true,
}: ContainerProps) => {
  return (
    <SafeAreaView
      className={clsx(
        "bg-white flex-1 pt-4",
        horizontal && "px-4",
        otherStyles
      )}
    >
      {children}
    </SafeAreaView>
  );
};

export default Container;

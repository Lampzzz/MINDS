import GorhomBottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef } from "react";
import { Pressable } from "react-native";
import { icons } from "@/constants";

interface InfoBottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
}

export const BottomSheet = ({
  onClose,
  children,
  snapPoints,
}: InfoBottomSheetProps) => {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 100,
      }}
    >
      <GorhomBottomSheet
        handleComponent={null}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 24,
            alignItems: "center",
          }}
        >
          <Pressable className="w-full items-start pb-10" onPress={onClose}>
            <icons.Close />
          </Pressable>
          {children}
        </BottomSheetView>
      </GorhomBottomSheet>
    </GestureHandlerRootView>
  );
};

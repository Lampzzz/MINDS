import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMemo, useRef } from "react";
import { Pressable } from "react-native";
import { InfoHeader } from "./info-header";
import { getHeaderInfo, getHeaderSnapPoints } from "../utils/header-info";
import { InformationTextField } from "./info-text-field";
import { icons } from "@/constants";

interface InfoBottomSheetProps {
  type: string;
  onClose: () => void;
}

const InfoBottomSheet = ({ type, onClose }: InfoBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const snapPoints = useMemo(() => getHeaderSnapPoints(type), [type]);
  const headerInfo = getHeaderInfo(type);

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
      <BottomSheet
        handleComponent={null}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={0}
        // snapPoints={snapPoints}
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
          <InfoHeader
            title={headerInfo.title}
            description={headerInfo.description}
          />
          <InformationTextField type={type} onClose={onClose} />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default InfoBottomSheet;

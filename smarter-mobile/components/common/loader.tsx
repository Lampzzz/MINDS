import useModal from "@/hooks/use-modal";
import { View, Modal, ActivityIndicator } from "react-native";

export const Loader = () => {
  const { modalType, visible } = useModal();

  return (
    <Modal visible={visible && modalType == "loading"}>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#F7DC6F" />
      </View>
    </Modal>
  );
};

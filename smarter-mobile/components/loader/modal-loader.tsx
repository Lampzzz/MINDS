import { View } from "react-native";
import React from "react";
import Modal from "../common/modal";
import { ActivityIndicator } from "react-native-paper";

const ModalLoader = () => {
  return (
    <Modal backgroundColor={false}>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#EA580C" />
      </View>
    </Modal>
  );
};

export default ModalLoader;

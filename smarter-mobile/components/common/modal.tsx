import React from "react";
import useModal from "@/hooks/use-modal";
import { Modal as PaperModal, Portal } from "react-native-paper";
import ModalLoader from "../loader/modal-loader";

interface Modal {
  children: React.ReactNode;
  backgroundColor?: boolean;
}

const Modal = ({ children, backgroundColor = true }: Modal) => {
  const { visible, setVisible } = useModal();

  const containerStyle = {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 20,
  };

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={backgroundColor ? containerStyle : null}
      >
        {children}
      </PaperModal>
    </Portal>
  );
};

export default Modal;

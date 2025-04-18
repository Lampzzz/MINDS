import { create } from "zustand";

type ModalType = "default" | "loading" | "success" | "logout" | null;

interface ModalStore {
  visible: boolean;
  modalType: ModalType;
  isLoading?: boolean;
  setVisible: (value: boolean) => void;
  setModalType: (type: ModalType) => void;
  setModalLoading: (value: boolean) => void;
  closeModal: () => void;
}

const useModal = create<ModalStore>((set) => ({
  visible: false,
  modalType: "default",
  isLoading: false,
  setVisible: (value) => set({ visible: value }),
  setModalType: (type) => set({ modalType: type }),
  setModalLoading: (value) => set({ isLoading: value }),
  closeModal: () => set({ visible: false, modalType: null }),
}));

export default useModal;

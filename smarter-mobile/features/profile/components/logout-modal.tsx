import Modal from "@/components/common/modal";
import useModal from "@/hooks/use-modal";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

interface LogoutModalProps {
  handleLogout: () => void;
}

export const LogoutModal = ({ handleLogout }: LogoutModalProps) => {
  const { closeModal, isLoading } = useModal();

  return (
    <Modal>
      <Text className="text-2xl font-urbanist-regular">Logout</Text>
      <Text className="mt-2 text-text-secondary font-urbanist-regular">
        Are you sure you want to logout?
      </Text>
      <View className="flex-row justify-end mt-4">
        <Button
          mode="contained"
          style={{
            marginTop: 10,
            marginRight: 10,
            backgroundColor: "#F5F5F4",
          }}
          textColor="#000"
          onPress={closeModal}
          disabled={isLoading}
        >
          No
        </Button>
        <Button
          mode="contained"
          style={{ marginTop: 10, backgroundColor: "#EA580C" }}
          textColor="#fff"
          onPress={handleLogout}
          disabled={isLoading}
        >
          Yes
        </Button>
      </View>
    </Modal>
  );
};

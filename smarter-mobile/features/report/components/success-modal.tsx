import Modal from "@/components/common/modal";
import useModal from "@/hooks/use-modal";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

interface SuccessModalProps {
  label: string;
  description: string;
}

const SuccessModal = ({ label, description }: SuccessModalProps) => {
  const { setVisible } = useModal();

  return (
    <Modal>
      <Text className="text-xl">{label}</Text>
      <Text className="mt-2 text-text-secondary">{description}</Text>
      <View className="flex-row justify-end mt-4">
        <Button
          mode="contained"
          style={{
            marginTop: 10,
            backgroundColor: "#EA580C",
          }}
          onPress={() => setVisible(false)}
        >
          Okay
        </Button>
      </View>
    </Modal>
  );
};

export default SuccessModal;

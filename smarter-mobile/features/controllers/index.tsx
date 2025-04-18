import useControllerStore from "@/store/controller-store";
import { useEffect } from "react";
import { ToastAndroid, View } from "react-native";
import { ControllerButton } from "./components/controller-button";
import { KeyRound, Zap } from "lucide-react-native";
import { useShelterStore } from "@/store/shelter-store";
import {
  updateInverter,
  updateDoor,
} from "@/services/firebase/firestore/controller";

export const Controllers = () => {
  const { shelter } = useShelterStore();
  const { fetchControllerStatus, controllerStatus, cleanup } =
    useControllerStore();

  useEffect(() => {
    fetchControllerStatus(shelter?.shelterDeviceId!);

    return () => cleanup();
  }, [shelter]);

  const toggleInverter = async (value: string, shelterDeviceId: string) => {
    await updateInverter(value, shelterDeviceId);

    ToastAndroid.show(
      value === "on" ? "Inverter Off" : "Inverter On",
      ToastAndroid.SHORT
    );
  };

  const toggleDoor = async (shelterDeviceId: string) => {
    await updateDoor(shelterDeviceId);
    ToastAndroid.show("Door Open", ToastAndroid.SHORT);
  };

  return (
    <View className="justify-between flex-row flex-1">
      <ControllerButton
        onToggle={() => toggleDoor(shelter?.shelterDeviceId!)}
        icon={KeyRound}
        label="Door"
      />
      <View className="mx-2" />
      <ControllerButton
        onToggle={() =>
          toggleInverter(controllerStatus?.inverter!, shelter?.shelterDeviceId!)
        }
        currentValue={controllerStatus?.inverter!}
        icon={Zap}
        label="Inverter"
      />
    </View>
  );
};

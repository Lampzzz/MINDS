import Modal from "@/components/common/modal";
import useModal from "@/hooks/use-modal";
import { getAlerts } from "@/services/firebase/firestore/alert/get-alerts";
import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";

export const AlertModal = () => {
  const { closeModal, isLoading } = useModal();
  const [alerts, setAlerts] = useState<any>([]);

  useEffect(() => {
    const unsubscribe = getAlerts((alertData) => {
      setAlerts(alertData);
    });

    return () => unsubscribe();
  }, []);

  return Alert.alert("Alert");
};

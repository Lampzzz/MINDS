import clsx from "clsx";
import useModal from "@/hooks/use-modal";
import Modal from "@/components/common/modal";
import ModalLoader from "@/components/loader/modal-loader";
import SuccessModal from "./components/success-modal";
import { reportTypes } from "@/constants/data";
import { Text, View, Pressable, TextInput, ToastAndroid } from "react-native";
import { useEffect, useState } from "react";
import { createReport } from "@/services/firebase/firestore/report/create-report";
import { useAuthStore } from "@/store/auth-store";
import { usePathname } from "expo-router";
import { Button } from "react-native-paper";
import { Container } from "@/components/layout/container";
import { useShelterStore } from "@/store/shelter-store";
import { Header } from "@/components/common/header";
import { icons } from "@/constants";
import { PickerSelect } from "@/components/forms/picker-select";

const Report = () => {
  const pathName = usePathname();
  const { setVisible, setModalType, modalType } = useModal();
  const { currentUser } = useAuthStore();
  const { shelter } = useShelterStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [reportOption, setReportOption] = useState("");

  useEffect(() => {
    setSelectedType("");
    setDescription("");
  }, [pathName]);

  const handlePress = (title: string) => {
    setSelectedType(title);
    setModalType("default");
    setVisible(true);
    setDescription("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setModalType("loading");

    try {
      await createReport({
        managerId: currentUser?.id!,
        category: selectedType,
        shelterId: shelter?.id!,
        description: reportOption != "other" ? reportOption : description,
      });

      setModalType("success");
      setDescription("");
      setSelectedType("");
      setReportOption("");
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      setModalType("default");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setModalType("default");
    setSelectedType("");
    setDescription("");
    setReportOption("");
  };

  const handleReportOption = (value: string) => {
    setReportOption(value);
  };

  const reportsOption = reportTypes.filter(
    (report) => report.title === selectedType
  );

  return (
    <>
      <Container className="pt-4">
        <View className="mb-4 px-4">
          <Header label="Create Report" />
        </View>
        {reportTypes.map((type) => (
          <Pressable
            key={type.title}
            onPress={() => handlePress(type.title)}
            disabled={isSubmitting}
          >
            <View
              className={clsx(
                "p-4 flex-row items-center justify-between",
                {
                  "border-b":
                    type.title !== reportTypes[reportTypes.length - 1].title,
                },
                selectedType === type.title
                  ? "bg-fill-secondary border-border"
                  : "border-border bg-white"
              )}
            >
              <View className="flex-row space-x-3">
                <type.icon
                  size={32}
                  color={selectedType === type.title ? "#EA580C" : "#000"}
                />
                <View>
                  <Text className={clsx("font-bold text-base text-black")}>
                    {type.title}
                  </Text>
                  <Text
                    className={clsx(
                      "font-mregular text-xs text-text-secondary"
                    )}
                  >
                    {type.description}
                  </Text>
                </View>
              </View>
              <icons.ArrowRight />
            </View>
          </Pressable>
        ))}
      </Container>
      {modalType === "loading" && <ModalLoader />}
      {modalType === "success" && (
        <SuccessModal
          label="Report Sent"
          description="Your report has been submitted successfully"
        />
      )}
      {modalType === "default" && selectedType !== "" && (
        <Modal>
          <Text className="text-xl font-bold">{selectedType}</Text>
          {selectedType !== "Other Issues" && (
            <View className="mt-3">
              <PickerSelect
                label="Select description"
                values={reportsOption[0].options!}
                onChange={handleReportOption}
              />
            </View>
          )}
          {(selectedType === "Other Issues" || reportOption === "other") && (
            <TextInput
              style={{
                height: 100,
                borderColor: "transparent",
                backgroundColor: "#F5F5F4",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                marginTop: 12,
                textAlignVertical: "top",
              }}
              placeholderTextColor="#A8A8A8"
              placeholder="Describe your specific issue..."
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          )}
          <View className="flex-row justify-end mt-4">
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginRight: 10,
                backgroundColor: "#F5F5F4",
              }}
              textColor="#525252"
              onPress={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={{ marginTop: 10, backgroundColor: "#EA580C" }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </View>
        </Modal>
      )}
    </>
  );
};

export default Report;

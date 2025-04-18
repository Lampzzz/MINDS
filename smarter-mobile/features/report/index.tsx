import clsx from "clsx";
import { reportTypes } from "@/constants/data";
import { useEffect, useState } from "react";
import { createReport } from "@/services/firebase/firestore/report/create-report";
import { useAuthStore } from "@/store/auth-store";
import { usePathname } from "expo-router";
import { Container } from "@/components/container";
import { useShelterStore } from "@/store/shelter-store";
import { Header } from "@/components/common/header";
import { icons } from "@/constants";
import { BottomSheetHeader } from "@/components/bottom-sheet-header";
import { BottomSheet } from "@/components/bottom-sheet";
import { useBottomSheet } from "@/hooks/use-bottom-sheet";
import { Button } from "@/components/ui/Button";
import { RadioButton } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";

const Report = () => {
  const pathName = usePathname();
  const { isVisible, close, type, open } = useBottomSheet();
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
    setDescription("");
    open("report");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (reportOption === "" && description === "") {
      setIsSubmitting(false);
      return ToastAndroid.show(
        "Please select or type a report",
        ToastAndroid.SHORT
      );
    }

    if (
      (reportOption === "Other" || selectedType === "Other Issues") &&
      description === ""
    ) {
      setIsSubmitting(false);
      return ToastAndroid.show("Please type a report", ToastAndroid.SHORT);
    }

    const finalDescription =
      selectedType === "Other Issues"
        ? description
        : reportOption === "Other"
          ? description
          : reportOption;

    try {
      await createReport({
        managerId: currentUser?.id!,
        category: selectedType,
        shelterId: shelter?.id!,
        description: finalDescription,
      });

      ToastAndroid.show("Report Sent Successfully", ToastAndroid.SHORT);
      onClose();
      close();
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportOption = (value: string) => {
    setReportOption(value);
  };

  const reportsOption = reportTypes.filter(
    (report) => report.title === selectedType
  );

  const closeBottomSheet = () => {
    onClose();
    close();
  };

  const onClose = () => {
    setDescription("");
    setSelectedType("");
    setReportOption("");
  };

  return (
    <>
      <Container styles="pt-4">
        <View className="px-4">
          <Header label="Create Report" />
        </View>
        {reportTypes.map((type) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={type.title}
            onPress={() => handlePress(type.title)}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.5 : 1 }}
          >
            <View
              className={clsx(
                "px-4 py-5 flex-row items-center justify-between border-border",
                {
                  "border-b":
                    type.title !== reportTypes[reportTypes.length - 1].title,
                }
              )}
            >
              <View className="flex-row space-x-3 items-center">
                <type.icon
                  size={32}
                  color={selectedType === type.title ? "#EA580C" : "#000"}
                />
                <View>
                  <Text
                    className={clsx("font-urbanist-bold text-base text-black")}
                  >
                    {type.title}
                  </Text>
                  <Text
                    className={clsx(
                      "font-urbanist-regular text-sm text-text-secondary"
                    )}
                  >
                    {type.description}
                  </Text>
                </View>
              </View>
              <icons.ArrowRight />
            </View>
          </TouchableOpacity>
        ))}
      </Container>
      {isVisible && type === "report" && (
        <BottomSheet onClose={closeBottomSheet}>
          <ScrollView
            className="w-full"
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
          >
            <BottomSheetHeader
              title={`Create a ${selectedType} report`}
              description=""
            />
            <View className="w-full">
              {selectedType !== "Other Issues" &&
                reportsOption[0]?.options!.map((option) => (
                  <View key={option} className="flex-row items-center mb-2">
                    <RadioButton
                      value={option}
                      status={reportOption === option ? "checked" : "unchecked"}
                      onPress={() => handleReportOption(option)}
                      color="#EA580C"
                    />
                    <Text className="ml-2 text-base font-urbanist-medium">
                      {option}
                    </Text>
                  </View>
                ))}
              {(reportOption === "Other" ||
                selectedType === "Other Issues") && (
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter report here"
                  className="border border-border rounded-md p-4 mt-2"
                />
              )}
            </View>
            <View className="w-full mt-4">
              <Button
                label="Send report"
                handlePress={handleSubmit}
                isLoading={isSubmitting}
                styles="mt-4"
              />
            </View>
          </ScrollView>
        </BottomSheet>
      )}
    </>
  );
};

export default Report;

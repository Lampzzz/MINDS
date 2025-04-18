import { useEffect } from "react";
import { Text, ToastAndroid, View } from "react-native";
import useResidentStore from "@/store/resident-store";
import { useAuthStore } from "@/store/auth-store";
import { Loading } from "@/components/ui/Loading";
import { ResidentCard } from "./components/resident-card";
import { MemberList } from "./components/member-list";
import { useBottomSheet } from "@/hooks/use-bottom-sheet";
import { BottomSheet } from "@/components/bottom-sheet";
import { BottomSheetHeader } from "@/components/bottom-sheet-header";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/Button";
import { updateBodyTemperature } from "@/services/firebase/firestore/manager/update-body-temperature";
import { Container } from "@/components/container";
import { Header } from "@/components/common/header";

const Resident = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      bodyTemperature: "",
    },
  });

  const { isVisible, close, type, data } = useBottomSheet();
  const { members, isLoading, fetchMembers } = useResidentStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser?.id) {
      fetchMembers(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    reset({ bodyTemperature: data?.bodyTemperature || "" });
  }, [isVisible]);

  if (isLoading) return <Loading />;

  const onSubmit = async (value: { bodyTemperature: string }) => {
    try {
      await updateBodyTemperature({
        residentId: data?.residentId!,
        bodyTemperature: parseFloat(value.bodyTemperature),
      });
      ToastAndroid.show(
        "Update Body Temperature Successfully",
        ToastAndroid.SHORT
      );

      close();
      reset();
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Error updating body temperature", ToastAndroid.SHORT);
    }
  };

  return (
    <>
      <Container styles="pt-4">
        <View className="px-4">
          <Header label="Residents" />
        </View>
        <View className="flex-1 px-4">
          <View className="mb-10">
            <Text className="text-xl font-bold mb-3">Manager</Text>
            <ResidentCard data={currentUser} type="Manager" />
          </View>
          <View className="mb-10">
            <Text className="text-xl font-bold mb-3">Members</Text>
            <MemberList members={members} />
          </View>
        </View>
      </Container>
      {isVisible && type === "bodyTemperature" && (
        <BottomSheet onClose={close}>
          <BottomSheetHeader
            title="Enter new body temperature"
            description="Update your temperature so we can check if you're feeling unwell."
          />
          <View className="w-full mt-4">
            <Controller
              control={control}
              name="bodyTemperature"
              rules={{
                required: "Required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Only numbers are allowed",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Body Temperature"
                  value={value}
                  onChangeText={onChange}
                  error={errors.bodyTemperature?.message}
                  style="mb-4"
                />
              )}
            />
            <Button
              label="Save"
              handlePress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              styles="mt-6"
            />
          </View>
        </BottomSheet>
      )}
    </>
  );
};

export default Resident;

import { useForm, Controller } from "react-hook-form";
import { ToastAndroid, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/text-field";
import { Manager } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import { updateManager } from "@/services/firebase/firestore/manager/update-manager";
import { DatePickerField } from "@/components/forms/date-picker";
import { format } from "date-fns";

export const InformationTextField = ({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) => {
  const [openDateModal, setDateModal] = useState(false);
  const [dateBirth, setDateBirth] = useState(new Date());
  const { currentUser, fetchUser } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    reset({
      fullName: currentUser?.fullName ?? "",
      email: currentUser?.email ?? "",
      phoneNumber: currentUser?.phoneNumber ?? "",
      address: currentUser?.address ?? "",
    });

    setDateBirth(new Date(currentUser?.dateOfBirth));
  }, [currentUser]);

  const onSubmit = async (data: Partial<Manager>) => {
    try {
      await updateManager(
        { ...data, dateOfBirth: format(dateBirth, "yyyy-MM-dd") },
        currentUser?.id!
      );
      await fetchUser(currentUser?.authId!);

      ToastAndroid.show("Updated Successfully!", ToastAndroid.SHORT);
      onClose();
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Failed to update manager", ToastAndroid.SHORT);
    }
  };

  return (
    <View className="w-full mt-4">
      {type === "name" && (
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "Required",
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Full Name"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
              style="mb-4"
            />
          )}
        />
      )}
      {type === "dateOfBirth" && (
        <DatePickerField
          label="Date of birth"
          value={dateBirth}
          setDate={setDateBirth}
          isModalOpen={openDateModal}
          setModal={setDateModal}
        />
      )}
      {type === "email" && (
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              style="mb-4"
            />
          )}
        />
      )}
      {type === "phoneNumber" && (
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Must be a number only",
            },
            minLength: {
              value: 11,
              message: "Must be an 11-digit number",
            },
            maxLength: {
              value: 11,
              message: "Must be an 11-digit number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              error={errors.phoneNumber?.message}
              style="mb-4"
            />
          )}
        />
      )}
      {type === "address" && (
        <Controller
          control={control}
          name="address"
          rules={{
            required: "Required",
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Address"
              value={value}
              onChangeText={onChange}
              error={errors.address?.message}
              style="mb-4"
            />
          )}
        />
      )}
      <Button
        label="Save"
        handlePress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        styles="mt-6"
      />
    </View>
  );
};

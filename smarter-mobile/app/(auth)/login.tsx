import { useForm, Controller } from "react-hook-form";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/firebase/auth/login";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextField } from "@/components/forms/text-field";
import { router } from "expo-router";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await login(data.email, data.password);

      if (!response?.success) {
        Alert.alert("Error", response?.message);
        return;
      }

      router.replace("/home");
    } catch (error: any) {
      console.error(error);
      return Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 20,
          paddingTop: 80,
        }}
      >
        <View className="flex-1">
          <View className="flex-row items-center space-x-1 mb-4">
            <Image source={images.logo} className="w-9 h-9" />
            <Text className="text-3xl font-urbanist-bold text-primary">
              Smarter
            </Text>
          </View>
          <View className="mb-8">
            <Text className="font-urbanist-bold text-2xl">
              Sign in your account
            </Text>
            <Text className="font-urbanist-regular text-base text-text-secondary">
              Sign in with the account you created with the registration
              assistant
            </Text>
          </View>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Required",
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
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry={true}
                style="mb-4"
              />
            )}
          />
          <Button
            label="Sign in"
            handlePress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          />
        </View>
        <View className="mt-8">
          <View className="p-5 bg-fill-secondary rounded-2xl flex-row space-x-4">
            <icons.Quote />
            <View className="flex-shrink space-y-4">
              <Text className="font-urbanist-regular text-sm">
                If you're having trouble registering your account, please reach
                out to a registration assistant for help
              </Text>
              <Text className="text-sm font-urbanist-semibold">
                Registration Assistant
              </Text>
            </View>
          </View>
          {/* <View className="mt-5">
            <Text className="text-text-secondary text-xs font-urbanist-regular">
              By proceeding you acknowledge that you have read, understood and
              agree to our{" "}
              <Text className="text-primary underline font-urbanist-regular">
                Terms and Condition
              </Text>
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

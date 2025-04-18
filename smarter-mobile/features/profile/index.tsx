import useModal from "@/hooks/use-modal";
import { Container } from "@/components/container";
import { logout } from "@/services/firebase/auth/logout";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { format } from "date-fns";
import { icons } from "@/constants";
import InfoBottomSheet from "./components/info-bottom-sheet";
import InformationBar from "./components/info-bar";
import { LogoutModal } from "./components/logout-modal";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import ModalLoader from "@/components/loader/modal-loader";
import { BackHeader } from "@/components/back-header";

const Profile = () => {
  const { currentUser } = useAuthStore();
  const [selectedInfoType, setSelectedInfoType] = useState<string | null>(null);

  const handleInfobarPress = (type: string) => {
    setSelectedInfoType(type);
  };

  const { setVisible, modalType, setModalType, closeModal, setModalLoading } =
    useModal();

  const openLogoutModal = () => {
    setVisible(true);
    setModalType("logout");
  };

  const handleLogout = async () => {
    setModalLoading(true);

    try {
      logout();
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setModalLoading(false);
      closeModal();
    }
  };

  const residentSince = new Date(currentUser!.createdAt?.seconds * 1000);

  return (
    <>
      <Container styles="pt-4 py-6">
        <View className="px-4">
          <BackHeader label="" />
        </View>
        <View className="px-6">
          <Text className="font-urbanist-semibold text-3xl mt-8 text-text">
            Profile
          </Text>
        </View>
        <View className="px-6">
          <View
            className="flex justify-center py-6 my-8 bg-white rounded-3xl"
            style={{
              shadowColor: "#000000B3",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <View className="flex-column items-center">
              <View className="w-[96px] h-[96px] rounded-full items-center justify-center bg-primary">
                <Text className="text-3xl font-bold text-white">
                  {(currentUser!.fullName || "")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                    .slice(0, 1) || "X"}
                </Text>
              </View>

              <Text className="text-2xl font-urbanist-semibold mt-2">
                {currentUser?.fullName ?? "Resident"}
              </Text>
              <Text className="text-text-secondary font-urbanist-regular text-sm">
                Resident since {format(residentSince, "MMMM d, yyyy")}
              </Text>
            </View>
          </View>
          <Text className="text-xl font-urbanist-semibold mb-6 text-text">
            Edit Information
          </Text>
          <InformationBar
            label="Name"
            value={currentUser?.fullName ?? ""}
            onPress={() => handleInfobarPress("name")}
          />
          <InformationBar
            label="Date of Birth"
            value={format(currentUser?.dateOfBirth, "MMMM d, yyyy")}
            styles="pt-4"
            onPress={() => handleInfobarPress("dateOfBirth")}
          />
          <InformationBar
            label="Email"
            value={currentUser?.email ?? ""}
            styles="pt-4"
            onPress={() => handleInfobarPress("email")}
          />
          <InformationBar
            label="Phone Number"
            value={currentUser?.phoneNumber ?? ""}
            styles="pt-4"
            onPress={() => handleInfobarPress("phoneNumber")}
          />
          <InformationBar
            label="Address"
            value={currentUser?.address ?? ""}
            onPress={() => handleInfobarPress("address")}
            styles="pt-4"
          />
          <Pressable onPress={openLogoutModal} className="my-8">
            <View className="flex-row justify-between items-center pb-4">
              <View className="flex-row items-center gap-x-2">
                <icons.Logout />
                <Text className="text-base font-urbanist-meduim text-icon-critical">
                  Logout
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </Container>
      {selectedInfoType && (
        <InfoBottomSheet
          type={selectedInfoType}
          onClose={() => setSelectedInfoType(null)}
        />
      )}
      {modalType === "logout" && <LogoutModal handleLogout={handleLogout} />}
      {modalType === "loading" && <ModalLoader />}
    </>
  );
};

export default Profile;

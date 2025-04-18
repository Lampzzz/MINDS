import { View, Text } from "react-native";
import { Member } from "@/types";
import { format } from "date-fns";
import { EmptyMembers } from "./empty-members";

const MemberCard = ({ members }: { members: Member[] }) => {
  return (
    <View className="flex-1">
      <Text className="text-xl font-bold mb-3">Members</Text>
      <View className="flex-1">
        {members.length > 0 ? (
          members.map((member) => {
            const birthDate = new Date(member?.dateOfBirth);

            return (
              <View
                className="flex-row items-start space-x-3 py-2.5"
                key={member.id}
              >
                <View className="w-10 h-10 rounded-full items-center justify-center bg-primary-100">
                  <Text className="text-base font-bold text-text-secondary">
                    {(member.fullName || "")
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase())
                      .join("")
                      .slice(0, 2) || "X"}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-bold">
                    {member?.fullName}
                  </Text>
                  <Text className="text-base text-text-secondary">
                    {format(birthDate, "MMMM dd, yyyy")}
                  </Text>
                  <Text className="text-base capitalize text-text-secondary">
                    {member?.gender}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyMembers />
        )}
      </View>
    </View>
  );
};

export default MemberCard;

import { View } from "react-native";
import { ResidentCard } from "./resident-card";
import { Member } from "@/types";
import { EmptyMembers } from "./empty-members";

export const MemberList = ({ members }: { members: Member[] }) => {
  return (
    <View>
      {members.length > 0 ? (
        members.map((member) => {
          return <ResidentCard key={member.id} data={member} type="Member" />;
        })
      ) : (
        <EmptyMembers />
      )}
    </View>
  );
};

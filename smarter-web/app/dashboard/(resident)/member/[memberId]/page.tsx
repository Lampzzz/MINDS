import PageContainer from "@/components/layout/page-container";
import MemberUpdateForm from "../_components/form/update-form";

export const metadata = {
  title: "Update Member",
};

export default function MemberViewPage({
  params,
}: {
  params: { memberId: string };
}) {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <MemberUpdateForm id={params.memberId} />
      </div>
    </PageContainer>
  );
}

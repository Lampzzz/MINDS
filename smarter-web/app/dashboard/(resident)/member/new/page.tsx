import PageContainer from "@/components/layout/page-container";
import { MemberNewForm } from "../_components/form/new-form";

export const metadata = {
  title: "New Member",
};

export default function MemberNewPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <MemberNewForm />
      </div>
    </PageContainer>
  );
}

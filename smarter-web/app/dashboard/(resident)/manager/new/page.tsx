import PageContainer from "@/components/layout/page-container";
import ManagerNewForm from "../_components/form/new-form";

export const metadata = {
  title: "New Resident",
};

export default function ManagerViewPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4">
        <ManagerNewForm />
      </div>
    </PageContainer>
  );
}

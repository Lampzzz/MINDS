import PageContainer from "@/components/layout/page-container";
import ManagerUpdateForm from "../_components/form/update-form";

export const metadata = {
  title: "Update Manager",
};

export default function ManagerViewPage({
  params,
}: {
  params: { managerId: string };
}) {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <ManagerUpdateForm id={params.managerId} />
      </div>
    </PageContainer>
  );
}

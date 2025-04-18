import PageContainer from "@/components/layout/page-container";
import { ShelterUpdateForm } from "../_components/form/update-form";

export const metadata = {
  title: "Update Shelter",
};

export default function UpdateShelterPage({
  params,
}: {
  params: { shelterId: string };
}) {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <ShelterUpdateForm shelterId={params.shelterId} />
      </div>
    </PageContainer>
  );
}

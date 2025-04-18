import PageContainer from "@/components/layout/page-container";
import { ShelterNewForm } from "../_components/form/new-form";

export const metadata = {
  title: "New Shelter",
};

export default function NewShelterPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <ShelterNewForm />
      </div>
    </PageContainer>
  );
}

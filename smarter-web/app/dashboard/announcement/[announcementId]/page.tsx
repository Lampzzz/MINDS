import PageContainer from "@/components/layout/page-container";
import { AnnouncementUpdateForm } from "../_components/form/update-form";

export const metadata = {
  title: "Update Announcement",
};

export default function UpdateAnnouncementPage({
  params,
}: {
  params: { announcementId: string };
}) {
  return (
    <PageContainer scrollable={true}>
      <div className="flex-1 space-y-4 py-8">
        <AnnouncementUpdateForm announcementId={params.announcementId} />
      </div>
    </PageContainer>
  );
}

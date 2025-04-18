import AnnouncementForm from "../_components/form/new-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata = {
  title: "Dashboard: New Message",
};

export default function NewShelterPage() {
  return (
    <ScrollArea className="h-[calc(100dvh-52px)]">
      <div className="flex-1 space-y-4 p-8">
        <AnnouncementForm />
      </div>
    </ScrollArea>
  );
}

import { Separator } from "@/components/ui/separator";
import AccountForm from "./form";

export default function Account() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-zinc-500">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <AccountForm />
      </div>
    </div>
  );
}

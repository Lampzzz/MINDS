import { Separator } from "@/components/ui/separator";
import { ChangePasswordForm } from "./change-password-form";

export default function ChangePassword() {
  return (
    <div className="space-y-6 mb-8">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-zinc-500">
          Update your password to maintain the highest level of security.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <ChangePasswordForm />
      </div>
    </div>
  );
}

"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { deleteAdminById, updateAdmin } from "@/firebase/firestore/admin";
import { toast } from "sonner";
import { AlertModal } from "@/components/modal/alert-modal";
import { useRouter } from "next/navigation";
import { emailVerification } from "@/firebase/firestore/admin";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Fullname must be at least 3 characters.",
    })
    .max(30, {
      message: "Fullname must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AccountForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { currentUser, fetchUserData } = useAuthStore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: currentUser ?? {},
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(currentUser!);
  }, [currentUser]);

  const onSubmit = async (data: any) => {
    try {
      const response = await updateAdmin(data, currentUser!.id!);
      await fetchUserData(currentUser!.id);

      if (!response.success) {
        return toast.error(response.message);
      }

      toast.success(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  const onConfirm = async () => {
    setLoading(true);

    try {
      const response = await deleteAdminById(currentUser!.id!);

      if (!response.success) {
        return toast.error(response.message);
      }

      toast.success(response.message);
      router.push("/login");
      setOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-3/5 space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a nickname.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" disabled {...field} />
                </FormControl>
                <FormDescription>
                  You can manage verified email addresses in your email settings
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-x-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Update account
            </Button>
            <Button
              type="button"
              variant="outline-destructive"
              onClick={() => setOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </form>
      </Form>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Are you sure you want to delete your account?"
      />
    </>
  );
}

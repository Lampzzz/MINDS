"use client";

import useAuthStore from "@/store/auth-store";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { updateAccountPassword } from "@/firebase/firestore/admin";

const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Required" }),
    newPassword: z
      .string()
      .min(1, {
        message: "Required",
      })
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            value
          ),
        {
          message: "Invalid Password Format",
        }
      ),
    repeatPassword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.repeatPassword === data.newPassword, {
    message: "Repeat password must match new password",
    path: ["repeatPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

export function ChangePasswordForm() {
  const { currentUser } = useAuthStore();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await updateAccountPassword(
        currentUser!.email!,
        data.currentPassword,
        data.newPassword
      );

      if (!response.success) {
        return toast.error(response.message);
      }

      form.reset();
      toast.success(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/5 space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter new password" {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters, contain at least one
                lowercase letter, uppercase letter, number and special
                character.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat New Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter repeat new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Update password
        </Button>
      </form>
    </Form>
  );
}

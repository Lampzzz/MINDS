"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { resetPassword } from "@/firebase/auth/reset-password";
import { AuthContainer } from "@/components/auth-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password cannot exceed 20 characters" })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
      })
      .refine((val) => /[@$!%*?&#]/.test(val), {
        message: "Password must include at least one special character",
      }),
    repeatPassword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });

type ResetPasswordFormValue = z.infer<typeof formSchema>;

export const dynamic = "force-dynamic";

export default function Login() {
  const router = useRouter();
  const [code, setCode] = useQueryState("oobCode");

  const form = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", repeatPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValue) => {
    try {
      if (code) {
        await resetPassword({ code, password: data.password });
        toast.success("Reset Password Successfully!");
        router.replace("/login");
        form.reset();
      } else {
        console.error("Code not found");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <AuthContainer>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below to reset it
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="ml-auto w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Reset
            </Button>
          </form>
        </Form>
      </div>
    </AuthContainer>
  );
}

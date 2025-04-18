"use client";

import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/firebase/auth/forgot-password";
import { AuthContainer } from "@/components/auth-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email({
    message: "Please enter a valid email.",
  }),
});

type ForgotPasswordFormValue = z.infer<typeof formSchema>;

export const dynamic = "force-dynamic";

export default function Page() {
  const [message, setMessage] = useState("");

  const form = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValue) => {
    setMessage("");

    try {
      const response = await forgotPassword(data.email);

      if (response.success) {
        setMessage(response.message);
        form.reset();
      } else {
        setMessage(response.message);
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
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {message && (
          <Alert className="flex items-center justify-between bg-success py-1">
            <AlertDescription>{message}</AlertDescription>
            <Button
              variant="link"
              onClick={() => {
                setMessage("");
              }}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </Alert>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
              Submit
            </Button>
          </form>
        </Form>

        <div className="mx-auto flex gap-1 text-sm">
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}

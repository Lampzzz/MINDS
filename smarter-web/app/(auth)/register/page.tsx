"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FirebaseErrors, FieldErrorMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { register } from "@/firebase/auth/register";
import { AuthContainer } from "@/components/auth-container";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Required" }).min(3, {
      message: "Please enter your full name",
    }),

    email: z.string().min(1, { message: "Required" }).email({
      message: "Please enter a valid email",
    }),

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

type RegisterFormValue = z.infer<typeof formSchema>;

export const dynamic = "force-dynamic";

export default function Register() {
  const router = useRouter();

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const handleFetchErrors = async (errors: FirebaseErrors) => {
    if (errors) {
      Object.entries(errors).forEach(([field, error]) => {
        const { message } = error as FieldErrorMessage;
        form.setError(field as "name" | "email" | "password", {
          type: "manual",
          message,
        });
      });
    } else {
      console.error("Unknown error");
    }
  };

  const onSubmit = async (data: RegisterFormValue) => {
    try {
      const response = await register(data);

      if (!response.success) return handleFetchErrors(response?.message);

      router.push("/dashboard/overview");
      toast.success("Account Created Successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AuthContainer>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
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
                      type="repeatPassword"
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
              Create an account
            </Button>
          </form>
        </Form>

        <div className="flex gap-1 justify-center text-sm mt-2">
          <p className="text-muted-foreground">Already have an account?</p>
          <Link href="/login" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}

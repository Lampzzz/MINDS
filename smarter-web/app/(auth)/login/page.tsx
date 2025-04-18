"use client";

import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/firebase/auth/login";
import { AuthContainer } from "@/components/auth-container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
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
  password: z.string().min(1, { message: "Required" }),
});

type LoginFormValue = z.infer<typeof formSchema>;

export const dynamic = "force-dynamic";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValue) => {
    const { email, password } = data;
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error("Sign in Failed. Please try again.");
        return;
      }
      const response = await login({ email, idToken });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push("/dashboard/overview");
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        return toast.error("Wrong email or password");
      }

      toast.error(`There was an error: ${error}`);
    }
  };

  return (
    <AuthContainer>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to login
          </p>
        </div>
        {error && (
          <Alert className="flex items-center justify-between bg-destructive">
            <AlertDescription className="text-white">{error}</AlertDescription>
            <Button
              variant="link"
              onClick={() => {
                setError(null);
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
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-xs text-muted-foreground underline"
                    >
                      forgot password?
                    </Link>
                  </div>
                </FormItem>
              )}
            />

            <Button
              className="ml-auto w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mx-auto flex gap-1 text-sm">
          <p className="text-muted-foreground">Don't have an account yet?</p>
          <Link href="/register" className="underline">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}

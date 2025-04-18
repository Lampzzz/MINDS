"use server";

import { Admin } from "@/types";
import { forgotPassword } from "./forgot-password";
import { login } from "./login";
import { register } from "./register";
import { resetPassword } from "./reset-password";
import { adminAuth, db } from "../config/admin";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<Admin | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    const userRecord = await db
      .collection("admins")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as Admin;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export { forgotPassword, login, register, resetPassword };

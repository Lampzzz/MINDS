"use server";

import { LoginParams } from "@/types";
import { cookies } from "next/headers";
import { adminAuth } from "../config/admin";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies();

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export const login = async (params: LoginParams) => {
  const { email, idToken } = params;

  try {
    const userRecord = await adminAuth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    await setSessionCookie(idToken);

    return { success: true, message: "Sign In Successfully!" };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
};

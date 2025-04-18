import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../config";

interface ResetPassword {
  code: string;
  password: string;
}

export const resetPassword = async ({ code, password }: ResetPassword) => {
  try {
    await confirmPasswordReset(auth, code, password);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};

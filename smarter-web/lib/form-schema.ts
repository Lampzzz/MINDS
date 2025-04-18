import * as z from "zod";

export const userSchema = z.object({
  fullName: z.string().min(1, {
    message: "Required",
  }),
  address: z.string().min(1, {
    message: "Required",
  }),
  email: z.string().min(1, {
    message: "Required",
  }),
  phoneNumber: z.string().min(1, {
    message: "Required",
  }),
  dateOfBirth: z.date({
    required_error: "Required",
  }),
  gender: z.string().min(1, {
    message: "Required",
  }),
  password: z
    .string()
    .min(1, { message: "Required" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password cannot exceed 20 characters." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number.",
    })
    .refine((val) => /[@$!%*?&#]/.test(val), {
      message: "Password must include at least one special character.",
    }),
  members: z.array(
    z.object({
      fullName: z.string().min(1, {
        message: "Required",
      }),
      dateOfBirth: z.date({
        required_error: "Required",
      }),
      gender: z.string().min(1, {
        message: "Required",
      }),
    })
  ),
  shelterId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

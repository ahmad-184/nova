import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/app-config";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters long`,
    }),
  rememberMe: z.boolean().default(false),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    firstName: z.string().min(3, { message: "First name is required" }),
    lastName: z.string().min(3, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters long`,
      }),
    confirmPassword: z.string(),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type SignUpSchema = z.infer<typeof signUpSchema>;

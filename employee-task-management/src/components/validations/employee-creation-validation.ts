import { z } from "zod";

export const employeeCreationValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  department: z.string().min(1, { message: "Department is required" }),
});

export const employeeConfirmationValidation = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

export const employeeOTPValidation = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
});

export type EmployeeCreationData = z.infer<typeof employeeCreationValidation>;
export type EmployeeConfirmationData = z.infer<
  typeof employeeConfirmationValidation
>;
export type EmployeeOTPData = z.infer<typeof employeeOTPValidation>;

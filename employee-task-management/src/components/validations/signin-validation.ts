import { z } from "zod";

export const ownerSigninValidation = z.object({
  phone: z.string().min(1, { message: "Phone is required" }).refine(
    (phone) => {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(phone);
    },
    { message: "Invalid phone number" }
  ),
});

export const employeeSigninValidation = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
});

export const ownerVerificationValidation = z.object({
  phone: z.string().min(1, { message: "Phone is required" }),
  code: z.string().min(1, { message: "Code is required" }),
});

export const employeeVerificationValidation = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  code: z.string().min(1, { message: "Code is required" }),
});

export type OwnerSigninData = z.infer<typeof ownerSigninValidation>;
export type EmployeeSigninData = z.infer<typeof employeeSigninValidation>;
export type OwnerVerificationData = z.infer<typeof ownerVerificationValidation>;
export type EmployeeVerificationData = z.infer<typeof employeeVerificationValidation>;
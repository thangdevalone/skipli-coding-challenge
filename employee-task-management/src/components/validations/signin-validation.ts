import { z } from "zod";

export const signinValidation = z.object({
  phone: z.string().min(1, { message: "Phone is required" }).refine(
    (phone) => {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(phone);
    },
    { message: "Invalid phone number" }
  ),
});
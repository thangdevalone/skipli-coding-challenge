"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  EmployeeVerificationData,
  employeeVerificationValidation,
} from "@/components/validations/signin-validation";
import { authService } from "@/lib/auth";
import useAuthStore from "@/stores/useAuthStore";
import { Role } from "@/types/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EmployeeVerificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const employeeForm = useForm<EmployeeVerificationData>({
    resolver: zodResolver(employeeVerificationValidation),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });
  const { setUser, setToken } = useAuthStore();

  const handleVerifyCode = async (data: EmployeeVerificationData) => {
    try {
      setIsLoading(true);
      const response = await authService.login({
        email: data.email,
        accessCode: data.code,
        role: Role.EMPLOYEE,
      });
      setUser(response.data.user);
      setToken(response.data.token);

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid access code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await authService.sendVerificationCode(
        { email: email || "" },
        Role.EMPLOYEE
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...employeeForm}>
      <form onSubmit={employeeForm.handleSubmit(handleVerifyCode)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={employeeForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    type="email"
                    placeholder="Your email address"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={employeeForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your code" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="text-sm text-center text-muted-foreground mt-3">
          Code not received?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleResendCode}
          >
            Send again
          </span>
        </div>
        <Button type="submit" className="w-full cursor-pointer mt-5">
          {isLoading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

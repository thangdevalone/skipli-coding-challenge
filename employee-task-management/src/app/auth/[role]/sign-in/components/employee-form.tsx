"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  EmployeeSigninData,
  employeeSigninValidation,
} from "@/components/validations/signin-validation";
import { authService } from "@/lib/auth";
import { Role } from "@/types/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EmployeeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const employeeForm = useForm<EmployeeSigninData>({
    resolver: zodResolver(employeeSigninValidation),
    defaultValues: { email: "" },
  });
  const handleSendCode = async (data: EmployeeSigninData) => {
    try {
      setIsLoading(true);
      await authService.sendVerificationCode(
        { email: data.email },
        Role.EMPLOYEE
      );
      router.push(
        `/auth/employee/verification?email=${encodeURIComponent(data.email)}`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to send access code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...employeeForm}>
      <form onSubmit={employeeForm.handleSubmit(handleSendCode)}>
        <FormField
          control={employeeForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email address"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                *Please enter a valid email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full cursor-pointer mt-4"
        >
          {isLoading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            "Next"
          )}
        </Button>
      </form>
    </Form>
  );
}

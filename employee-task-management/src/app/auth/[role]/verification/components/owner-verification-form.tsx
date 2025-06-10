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
  OwnerVerificationData,
  ownerVerificationValidation,
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

export default function OwnerVerificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const { setUser, setToken } = useAuthStore();

  const ownerForm = useForm<OwnerVerificationData>({
    resolver: zodResolver(ownerVerificationValidation),
    defaultValues: {
      phone: "+84" + (phone || ""),
      code: "",
    },
  });
  const onOwnerSubmit = async (data: OwnerVerificationData) => {
    try {
      setIsLoading(true);
      const response = await authService.login({
        phoneNumber: data.phone,
        accessCode: data.code,
        role: Role.OWNER,
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
        { phone: "+84" + (phone || "") },
        Role.OWNER
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...ownerForm}>
      <form onSubmit={ownerForm.handleSubmit(onOwnerSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={ownerForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    type="text"
                    placeholder="Your phone number"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={ownerForm.control}
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
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full cursor-pointer mt-5"
        >
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

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
  OwnerSigninData,
  ownerSigninValidation,
} from "@/components/validations/signin-validation";
import { authService } from "@/lib/auth";
import { Role } from "@/types/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function OwnerForm() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;
  const [isLoading, setIsLoading] = useState(false);
  const ownerForm = useForm<OwnerSigninData>({
    resolver: zodResolver(ownerSigninValidation),
    defaultValues: { phone: "" },
  });

  const handleSendCode = async (data: OwnerSigninData) => {
    try {
      setIsLoading(true);
      await authService.sendVerificationCode(
        { phone: "+84" + data.phone },
        Role.OWNER
      );
      toast.success("Access code sent to your phone number");
      router.push(
        `/auth/${role}/verification?phone=${encodeURIComponent(data.phone)}`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to send access code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...ownerForm}>
      <form onSubmit={ownerForm.handleSubmit(handleSendCode)}>
        <FormField
          control={ownerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">+84</div>
                  <Input
                    type="text"
                    placeholder="Your phone number"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground pl-9">
                *Please enter Vietnam phone number
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

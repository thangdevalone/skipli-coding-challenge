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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export default function OwnerVerificationForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const ownerForm = useForm<OwnerVerificationData>({
    resolver: zodResolver(ownerVerificationValidation),
    defaultValues: {
      phone: "+84" + (phone || ""),
      code: "",
    },
  });

  const onOwnerSubmit = (data: OwnerVerificationData) => {
    console.log("Owner verification:", data);
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
                  <Input
                    type="text"
                    placeholder="Enter your code"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="text-sm text-center text-muted-foreground mt-3">
          Code not received?{" "}
          <span className="text-blue-500 cursor-pointer">Send again</span>
        </div>
        <Button type="submit" className="w-full cursor-pointer mt-5">
          Submit
        </Button>
      </form>
    </Form>
  );
} 
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verificationValidation } from "@/components/validations/signin-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z3 from "zod";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const router = useRouter();
  const form = useForm<z3.infer<typeof verificationValidation>>({
    resolver: zodResolver(verificationValidation),
    defaultValues: {
      phone: "+84" + (phone || ""),
      code: "",
    },
  });

  const onSubmit = (data: z3.infer<typeof verificationValidation>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="py-6 px-4 w-full md:w-[500px] max-w-[500px] gap-0">
        <Button
          variant="ghost"
          className="w-fit cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <div className="text-3xl font-semibold text-center">Verification</div>
        <div className="text-sm text-center text-muted-foreground mt-2">
          Please enter the code sent to your phone
        </div>
        <div className="flex flex-col gap-2 mt-6 px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
        </div>
      </Card>
    </div>
  );
}

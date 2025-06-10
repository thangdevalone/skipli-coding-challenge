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
import { signinValidation } from "@/components/validations/signin-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z3 from "zod";

export default function SignInPage() {
  const form = useForm<z3.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      phone: "",
    },
  });
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="py-6 px-3 w-full md:w-[500px] max-w-[500px] gap-0">
        <div className="text-3xl font-semibold text-center">Verification</div>
        <div className="text-sm text-center text-muted-foreground mt-2">
          Please enter the code sent to your phone
        </div>
        <div className="flex flex-col gap-2 mt-6 px-4">
          <Form {...form}>
            <FormField
              control={form.control}
              name="phone"
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
            <div className="text-sm text-center text-muted-foreground mt-2">
              Code not received?{" "}
              <span className="text-blue-500 cursor-pointer">Send again</span>
            </div>
            <Button type="submit" className="w-full cursor-pointer mt-2">
              Submit
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}

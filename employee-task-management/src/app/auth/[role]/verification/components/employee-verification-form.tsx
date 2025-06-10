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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EmployeeVerificationForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const employeeForm = useForm<EmployeeVerificationData>({
    resolver: zodResolver(employeeVerificationValidation),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const onEmployeeSubmit = (data: EmployeeVerificationData) => {
    console.log("Employee verification:", data);
  };

  return (
    <Form {...employeeForm}>
      <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)}>
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
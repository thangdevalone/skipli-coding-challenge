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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EmployeeForm() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const employeeForm = useForm<EmployeeSigninData>({
    resolver: zodResolver(employeeSigninValidation),
    defaultValues: { email: "" },
  });

  const onEmployeeSubmit = (data: EmployeeSigninData) => {
    router.push(`/auth/${role}/verification?email=${data.email}`);
  };
  return (
    <Form {...employeeForm}>
      <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)}>
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
        <Button type="submit" className="w-full cursor-pointer mt-4">
          Next
        </Button>
      </form>
    </Form>
  );
}

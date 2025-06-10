"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { signinValidation } from "@/components/validations/signin-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z3 from "zod";

export default function page() {
  const router = useRouter();
  const form = useForm<z3.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (data: z3.infer<typeof signinValidation>) => {
    console.log(data);
    router.push(`/auth/verification?phone=${data.phone}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="py-6 px-3 w-full md:w-[500px] max-w-[500px] gap-0">
        <div className="text-3xl font-semibold text-center">Sign in</div>
        <div className="text-sm text-center text-muted-foreground mt-2">
          Please enter your phone to sign in
        </div>
        <div className="flex flex-col gap-2 mt-6 px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
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
              <Button type="submit" className="w-full cursor-pointer mt-4">
                Next
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}

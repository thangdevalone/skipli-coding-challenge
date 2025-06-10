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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function OwnerForm() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const ownerForm = useForm<OwnerSigninData>({
    resolver: zodResolver(ownerSigninValidation),
    defaultValues: { phone: "" },
  });

  const onOwnerSubmit = (data: OwnerSigninData) => {
    router.push(`/auth/${role}/verification?phone=${data.phone}`);
  };
  return (
    <Form {...ownerForm}>
      <form onSubmit={ownerForm.handleSubmit(onOwnerSubmit)}>
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
        <Button type="submit" className="w-full cursor-pointer mt-4">
          Next
        </Button>
      </form>
    </Form>
  );
}

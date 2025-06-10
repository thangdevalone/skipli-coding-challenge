"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Role } from "@/types/app";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import EmployeeVerificationForm from "./components/employee-verification-form";
import OwnerVerificationForm from "./components/owner-verification-form";

export default function VerificationPage() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;

  const isOwner = role === Role.OWNER;

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
          Please enter the code sent to your email
        </div>
        <div className="flex flex-col gap-2 mt-6 px-3">
          {isOwner ? <OwnerVerificationForm /> : <EmployeeVerificationForm />}
        </div>
      </Card>
    </div>
  );
}

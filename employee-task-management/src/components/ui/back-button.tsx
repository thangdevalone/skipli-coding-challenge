"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="w-fit cursor-pointer"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      Back
    </Button>
  );
}

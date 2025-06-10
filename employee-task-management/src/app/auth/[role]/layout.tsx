import { Role } from "@/types/app";
import { notFound } from "next/navigation";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (role !== Role.OWNER && role !== Role.EMPLOYEE) {
    return notFound();
  }

  return <>{children}</>;
}

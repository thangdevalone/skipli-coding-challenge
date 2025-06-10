import { Role } from "@/types/app";
import EmployeeForm from "./components/employee-form";
import OwnerForm from "./components/owner-form";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const isOwner = role === Role.OWNER;
  return <>{isOwner ? <OwnerForm /> : <EmployeeForm />}</>;
}

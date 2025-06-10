import BackButton from "@/components/ui/back-button";
import { Card } from "@/components/ui/card";
import { Role } from "@/types/app";

export default async function SignInLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  const isOwner = role === Role.OWNER;

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="py-6 px-4 w-full md:w-[500px] max-w-[500px] gap-0">
        <BackButton />
        <div className="text-3xl font-semibold text-center">Sign in</div>
        <div className="text-sm text-center text-muted-foreground mt-2">
          {isOwner
            ? "Please enter your phone to sign in"
            : "Please enter your email to sign in"}
        </div>
        <div className="flex flex-col gap-2 mt-6 px-3">{children}</div>
      </Card>
    </div>
  );
}

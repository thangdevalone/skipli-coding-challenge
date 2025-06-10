import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/types/app";
import Link from "next/link";

function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
        <Link
          href={`/auth/${Role.OWNER}/sign-in`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "cursor-pointer"
          )}
        >
          Login with Owner
        </Link>
        <Link
          href={`/auth/${Role.EMPLOYEE}/sign-in`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "cursor-pointer"
          )}
        >
          Login with Employee
        </Link>
      </div>
    </div>
  );
}

export default Home;

"use client";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ControllerOptions {
  requireAuth?: boolean;
}

const withController = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: ControllerOptions = { requireAuth: true }
) => {
  const ComponentWithAuth = (props: P) => {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (options.requireAuth && !user) {
        router.push("/auth/sign-in");
      } else if (!options.requireAuth && user) {
        router.push("/");
      }
    }, [user, router]);

    if (options.requireAuth && !user) {
      return null;
    }

    if (!options.requireAuth && user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withController;

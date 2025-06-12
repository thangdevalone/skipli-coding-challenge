"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { employeeService } from "@/lib/employeeService";
import { ArrowRight, CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ConfirmationState =
  | "loading"
  | "success"
  | "error"
  | "expired"
  | "invalid";

export default function ConfirmEmployeePage() {
  const [state, setState] = useState<ConfirmationState>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmAccount = async () => {
      const emailParam = searchParams.get("email");

      if (!emailParam) {
        setState("invalid");
        setMessage(
          "Invalid confirmation link. Please check your email for the correct link."
        );
        return;
      }

      setEmail(emailParam);

      try {
        await employeeService.confirmEmployee(emailParam);

        setState("success");
        setMessage("Employee confirmed successfully");
      } catch (error: any) {
        console.error("Confirmation error:", error);

        setMessage(error.response?.data?.error || "Confirmation failed");
      }
    };

    confirmAccount();
  }, [searchParams]);

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-xl font-bold">
                Confirming Your Account
              </CardTitle>
              <CardDescription>
                Please wait while we confirm your employee account...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case "success":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-green-800">
                Account Confirmed Successfully!
              </CardTitle>
              <CardDescription>
                Welcome! Your employee account has been activated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800 text-center">{message}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You can now login with your email address</li>
                  <li>• An OTP will be sent to your email for secure access</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <Link href="/auth/employee/sign-in">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Login Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        );

      case "expired":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-bold text-yellow-800">
                Confirmation Link Expired
              </CardTitle>
              <CardDescription>
                Your confirmation link has expired for security reasons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">{message}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Please contact your administrator to resend the confirmation
                  email.
                </p>
                {email && (
                  <p className="text-xs text-gray-500">Account: {email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "invalid":
      case "error":
      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-red-800">
                Confirmation Failed
              </CardTitle>
              <CardDescription>
                There was an issue confirming your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 text-center">{message}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Please check your email for the correct confirmation link, or
                  contact your administrator for assistance.
                </p>
                {email && (
                  <p className="text-xs text-gray-500">Account: {email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}

"use client";

import { useState } from "react";
import { EmployeeCreationForm } from "@/components/employee/employee-creation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function CreateEmployeePage() {
  const [createdEmployee, setCreatedEmployee] = useState<{
    employeeId: string;
    email: string;
  } | null>(null);

  const handleSuccess = (data: { employeeId: string; email: string }) => {
    setCreatedEmployee(data);
  };

  const handleCreateAnother = () => {
    setCreatedEmployee(null);
  };

  if (createdEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Employee Created Successfully!
            </CardTitle>
            <CardDescription>
              The employee account has been created and a confirmation email has been sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Employee Details:</h3>
              <div className="space-y-1 text-sm text-green-800">
                <p><strong>Employee ID:</strong> {createdEmployee.employeeId}</p>
                <p><strong>Email:</strong> {createdEmployee.email}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Employee will receive a confirmation email</li>
                <li>2. They need to click the confirmation link to activate their account</li>
                <li>3. After confirmation, they can login using their email address</li>
                <li>4. An OTP will be sent to their email for secure authentication</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCreateAnother}
                className="flex-1"
                variant="default"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Another Employee
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link href="/admin/employees">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Employees
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/employees">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employees
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Employee
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Add a new employee to your organization. They will receive an email 
              confirmation to activate their account and can then login securely 
              using OTP authentication.
            </p>
          </div>
        </div>

        <EmployeeCreationForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
} 

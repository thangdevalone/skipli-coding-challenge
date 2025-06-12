"use client";

import { EmployeesDataTable } from "@/components/data-table/employees-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmployeeCreationData } from "@/components/validations/employee-creation-validation";
import { Employee, employeeService } from "@/lib/employeeService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const employeeForm = useForm<EmployeeCreationData>({
    defaultValues: {
      name: "",
      email: "",
      department: "",
    },
  });
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employeesList = await employeeService.getEmployees();
      setEmployees(employeesList);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (data: EmployeeCreationData) => {
    setIsCreating(true);
    try {
      await employeeService.createEmployee(data);
      toast.success("Employee created successfully");
      setIsCreateDialogOpen(false);
      employeeForm.reset();
      await fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || "Failed to create employee");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    employeeForm.reset({
      name: employee.name,
      email: employee.email,
      department: employee.department || "",
    });

    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (
      !editingEmployee ||
      !employeeForm.getValues("name") ||
      !employeeForm.getValues("email")
    ) {
      toast.error("Name and email are required");
      return;
    }

    setIsCreating(true);
    try {
      // Note: Implement updateEmployee method in service if not exists
      // await employeeService.updateEmployee(editingEmployee.employeeId, newEmployee);
      toast.info("Update functionality not implemented yet");
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      employeeForm.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to update employee");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      toast.success("Employee deleted successfully");
      await fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  const handleCreateDialog = () => {
    employeeForm.reset();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their access
          </p>
        </div>
      </div>

      <EmployeesDataTable
        data={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        onCreate={handleCreateDialog}
        isLoading={isLoading}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <Form {...employeeForm}>
            <form
              onSubmit={employeeForm.handleSubmit(handleCreateEmployee)}
              className="space-y-4"
            >
              <FormField
                control={employeeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter employee name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="example@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter employee department"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <Form {...employeeForm}>
            <form
              onSubmit={employeeForm.handleSubmit(handleUpdateEmployee)}
              className="space-y-4"
            >
              <FormField
                control={employeeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter employee department"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Updating..." : "Update Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

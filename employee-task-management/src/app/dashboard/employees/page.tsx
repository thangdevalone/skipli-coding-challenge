'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { employeeService, Employee, CreateEmployeeData } from '@/lib/employeeService';
import { useToast } from '@/hooks/use-toast';
import { EmployeesDataTable } from '@/components/data-table/employees-data-table';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employeesList = await employeeService.getEmployees();
      setEmployees(employeesList);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employees',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast({
        title: 'Error',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      await employeeService.createEmployee(newEmployee);
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      });
      setIsCreateDialogOpen(false);
      setNewEmployee({ name: '', email: '', phoneNumber: '' });
      await fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create employee',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee || !newEmployee.name || !newEmployee.email) {
      toast({
        title: 'Error',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      // Note: Implement updateEmployee method in service if not exists
      // await employeeService.updateEmployee(editingEmployee.employeeId, newEmployee);
      toast({
        title: 'Info',
        description: 'Update functionality not implemented yet',
      });
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      setNewEmployee({ name: '', email: '', phoneNumber: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update employee',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      await fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDialog = () => {
    setNewEmployee({ name: '', email: '', phoneNumber: '' });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their access
          </p>
        </div>
      </div>

      {/* Data Table */}
      <EmployeesDataTable 
        data={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        onCreate={handleCreateDialog}
        isLoading={isLoading}
      />

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Enter employee name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                placeholder="Enter employee email"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                value={newEmployee.phoneNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateEmployee} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Enter employee name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                placeholder="Enter employee email"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="edit-phoneNumber"
                value={newEmployee.phoneNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateEmployee} disabled={isCreating}>
                {isCreating ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
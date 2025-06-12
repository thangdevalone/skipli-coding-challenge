import api from './api';

export interface Employee {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  department?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  phoneNumber?: string;
}

class EmployeeService {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get('/owner/get-all-employees');
      return response.data.employees || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employees');
    }
  }

  async getEmployee(employeeId: string): Promise<Employee> {
    try {
      const response = await api.get(`/owner/get-employee/${employeeId}`);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employee');
    }
  }

  async createEmployee(data: CreateEmployeeData): Promise<string> {
    try {
      const response = await api.post('/owner/create-employee', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create employee');
    }
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update employee');
    }
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    try {
      await api.delete(`/owner/delete-employee/${employeeId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete employee');
    }
  }

  async confirmEmployee(email: string): Promise<void> {
    try {
      await api.post('/employee/confirm-employee', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to confirm employee');
    }
  }
}

export const employeeService = new EmployeeService(); 
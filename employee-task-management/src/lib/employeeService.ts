import api from './api';

export interface Employee {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  role: 'employee';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeData {
  email: string;
  name?: string;
  phoneNumber?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  phoneNumber?: string;
}

class EmployeeService {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get('/employees');
      return response.data.employees || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employees');
    }
  }

  async getEmployee(id: string): Promise<Employee> {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employee');
    }
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    try {
      const response = await api.post('/employees', data);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create employee');
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

  async deleteEmployee(id: string): Promise<void> {
    try {
      await api.delete(`/employees/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete employee');
    }
  }

}

export const employeeService = new EmployeeService(); 
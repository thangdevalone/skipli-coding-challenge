import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTaskStatusData {
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

class TaskService {
  async getMyTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/tasks/my-tasks');
      return response.data.tasks;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getTasksByEmployee(employeeId: string): Promise<Task[]> {
    try {
      const response = await api.get(`/tasks/employee/${employeeId}`);
      return response.data.tasks;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/tasks/all');
      return response.data.tasks;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch all tasks');
    }
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post('/tasks/create', data);
      return response.data.task;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data.task;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch task');
    }
  }

  async updateTaskStatus(taskId: string, data: UpdateTaskStatusData): Promise<void> {
    try {
      await api.patch(`/tasks/${taskId}/status`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task status');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete task');
    }
  }
}

const taskService = new TaskService();
export default taskService; 
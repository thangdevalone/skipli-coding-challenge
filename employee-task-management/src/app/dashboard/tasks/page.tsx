"use client";

import { TasksDataTable } from "@/components/data-table/tasks-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Employee, employeeService } from "@/lib/employeeService";
import taskService, { CreateTaskData, Task } from "@/lib/taskService";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
    if (user?.role === "owner") {
      fetchEmployees();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      let tasksList: Task[];

      if (user?.role === "owner") {
        tasksList = await taskService.getAllTasks();
      } else {
        tasksList = await taskService.getTasksByEmployee(
          user?.employeeId || ""
        );
      }

      setTasks(tasksList);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const employeesList = await employeeService.getEmployees();
      setEmployees(employeesList);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast({
        title: "Error",
        description: "Title and assigned employee are required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await taskService.createTask(newTask);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      setIsCreateDialogOpen(false);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title || !newTask.assignedTo) {
      toast({
        title: "Error",
        description: "Title and assigned employee are required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Note: You might need to implement updateTask method in service
      // await taskService.updateTask(editingTask.id, newTask);
      toast({
        title: "Info",
        description: "Update functionality not implemented yet",
      });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await taskService.updateTaskStatus(taskId, { status: status as any });
      toast({
        title: "Success",
        description: `Task marked as ${status}`,
      });
      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      await fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleCreateDialog = () => {
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
    setIsCreateDialogOpen(true);
  };

  const employeesForTable = employees.map((emp) => ({
    employeeId: emp.employeeId,
    name: emp.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "owner"
              ? "Create and manage tasks for your team"
              : "View and update your assigned tasks"}
          </p>
        </div>
      </div>

      <TasksDataTable
        data={tasks}
        employees={employeesForTable}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onCreate={handleCreateDialog}
        onUpdateStatus={handleUpdateTaskStatus}
        isLoading={isLoading}
        userRole={user?.role}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, assignedTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({
                    ...newTask,
                    priority: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
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
              <Button onClick={handleCreateTask} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-assignedTo">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, assignedTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({
                    ...newTask,
                    priority: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-dueDate">Due Date (Optional)</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
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
              <Button onClick={handleUpdateTask} disabled={isCreating}>
                {isCreating ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

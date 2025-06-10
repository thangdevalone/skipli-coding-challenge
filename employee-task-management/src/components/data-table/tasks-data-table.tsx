"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Task } from "@/lib/taskService";
import { DataTablePagination } from "./data-table-pagination";

interface TasksDataTableProps {
  data: Task[];
  employees?: { employeeId: string; name: string }[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onCreate?: () => void;
  onUpdateStatus?: (taskId: string, status: string) => void;
  isLoading?: boolean;
  userRole?: string;
}

export function TasksDataTable({
  data,
  employees = [],
  onEdit,
  onDelete,
  onCreate,
  onUpdateStatus,
  isLoading = false,
  userRole = "employee",
}: TasksDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    return employee?.name || "Unknown";
  };

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">{task.title}</div>
            {task.description && (
              <div className="text-sm text-gray-500 truncate mt-1">
                {task.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {status === "in-progress" ? "In Progress" : status}
          </Badge>
        );
      },
    },

    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = row.getValue("assignedTo") as string;
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{getEmployeeName(assignedTo)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string;
        if (!dueDate) return <span className="text-gray-400">-</span>;

        const date = new Date(dueDate);
        const today = new Date();
        const isOverdue = date < today && row.original.status !== "completed";

        return (
          <div className="flex items-center space-x-2">
            {isOverdue ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Calendar className="h-4 w-4 text-gray-400" />
            )}
            <span
              className={`text-sm ${
                isOverdue ? "text-red-600 font-medium" : ""
              }`}
            >
              {date.toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <span className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(task.id)}
              >
                Copy task ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Status Updates */}
              {task.status !== "completed" && onUpdateStatus && (
                <>
                  {task.status !== "in-progress" && (
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(task.id, "in-progress")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(task.id, "completed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Edit/Delete (Owner only) */}
              {userRole === "owner" && (
                <>
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit task
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => {
                        setTaskToDelete(task);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete task
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteConfirm = () => {
    if (taskToDelete && onDelete) {
      onDelete(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {userRole === "owner" && onCreate && (
            <Button onClick={onCreate} size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading tasks...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-16"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <span>No tasks found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>"{taskToDelete?.title}"</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

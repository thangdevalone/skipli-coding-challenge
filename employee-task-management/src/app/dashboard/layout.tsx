"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import socketService from "@/lib/socket";
import useAuthStore from "@/stores/useAuthStore";
import { CheckSquare, LogOutIcon, MessageSquare, Users, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  employeeId: string;
  name: string;
  role: string;
  email?: string;
  phoneNumber?: string;
}

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  roles: string[];
}

const navigation: NavigationItem[] = [
  {
    href: "/dashboard/employees",
    icon: Users,
    label: "Employee Management",
    roles: ["owner"],
  },
  {
    href: "/dashboard/tasks",
    icon: CheckSquare,
    label: "Tasks",
    roles: ["owner", "employee"],
  },
  {
    href: "/dashboard/messages",
    icon: MessageSquare,
    label: "Messages",
    roles: ["owner", "employee"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      socketService.connect(user.employeeId);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white h-screen gap-8 flex flex-col p-4 border-r
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          {/* Mobile close button */}
          <div className="flex justify-between items-center lg:hidden">
            <div className="text-xl font-semibold">Employee Management</div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block text-xl font-semibold">Employee Management</div>
          
          <div className="flex flex-col">
            {filteredNavigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="flex items-center gap-2 p-2 px-4 rounded-md hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when navigating
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-gray-200">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    clearAuth();
                    router.push("/");
                  }}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Page content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import socketService from "@/lib/socket";
import useAuthStore from "@/stores/useAuthStore";
import { CheckSquare, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
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
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      socketService.connect(user.employeeId);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  console.log(user);

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white h-screen gap-8 flex flex-col p-4 border-r">
          <div className="text-xl font-semibold">Employee Management</div>
          <div className="flex flex-col">
            {filteredNavigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="flex items-center gap-2 p-2 px-4 rounded-md hover:bg-gray-100"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 lg:ml-0">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <h1 className="text-xl font-semibold">Dashboard</h1>

            <Avatar>
              <AvatarFallback className="bg-gray-200">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

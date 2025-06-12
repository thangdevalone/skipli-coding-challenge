"use client";

import useAuthStore from "@/stores/useAuthStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's what's happening.
        </p>
      </div>
    </div>
  );
}

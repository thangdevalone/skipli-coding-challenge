import { User } from "@/lib/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user?: User;
  setUser: (user: User) => void;
  token?: string;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      token: undefined,
      setToken: (token) => set({ token }),
      clearAuth: () => set({ user: undefined, token: undefined }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
import { create } from "zustand";

interface AuthStore {
  user?: any;
  setUser: (user: any) => void;
  token?: string;
  setToken: (token: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  token: undefined,
  setToken: (token) => set({ token }),
}));

export default useAuthStore;
import { create } from "zustand";

interface AuthStore {
  user?: any;
  setUser: (user: any) => void;
  phone?: string;
  setPhone: (phone: string) => void;
  code?: string;
  setCode: (code: string) => void;

}

const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  phone: undefined,
  setPhone: (phone) => set({ phone }),
  code: undefined,
  setCode: (code) => set({ code }),
}));

export default useAuthStore;
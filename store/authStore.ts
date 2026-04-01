import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  jwtToken: string | null;
  setJwtToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwtToken: null,
      setJwtToken: (token) => set({ jwtToken: token }),
      logout: () => set({ jwtToken: null }),
    }),
    { name: "shaarei-revacha-auth" },
  ),
);

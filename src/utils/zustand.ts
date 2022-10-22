import create from "zustand";
import { persist, devtools } from "zustand/middleware";

interface User {
  userId: string;
  setUserId: (userId: string) => void;
  getUserId: () => string;
}

export const useUserStore = create<User>()(
  devtools(
    persist((set, get) => ({
      userId: "",
      setUserId: (userId) =>
        set((state) => ({ userId: (state.userId = userId) })),
      getUserId: () => get().userId,
    }))
  )
);

import { create } from "zustand";
import api from "@/api/axios";
import axios from "axios";
import { UserDataResponseDTO } from "@/lib/profile-types";
import { AppointmentGetResponseDTO } from "@/lib/appointment-types";
import { getUserBookedAppointments } from "@/api/userSide/appointments";
import { logoutUser } from "@/api/userSide/user";
import { authInfo } from "@/api/userSide/auth-info";

interface UserState {
  user: UserDataResponseDTO | null; // includes avatar, name, etc.
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  updateUserAvatar: (data: string) => void;
  updateUserObject: (data: UserDataResponseDTO) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await authInfo();
      if (res.status === 200) {
        set({ user: res.data, isAuthenticated: true, loading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  updateUserAvatar: (avatarUrl: string) =>
  set((state) => ({
    user: state.user ? { ...state.user, avatarUrl } : state.user,
  })),

  updateUserObject: (updatedUser: UserDataResponseDTO) =>
    set((state) => ({
      user: updatedUser
    })),

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));

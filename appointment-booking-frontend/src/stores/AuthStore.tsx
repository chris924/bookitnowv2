import { create } from "zustand";
import api from "@/api/axios";
import axios from "axios";
import { UserDataResponseDTO } from "@/lib/profile-types";
import { AppointmentGetResponseDTO } from "@/lib/appointment-types";
import { getUserBookedAppointments } from "@/api/appointments";

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
      const res = await api.get("/auth/auth-info");
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
      await axios.post("/auth/user/logout", {}, { withCredentials: true });
    } finally {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));

interface UserBookedAppointmentsState {
  userAppointments: AppointmentGetResponseDTO[] | null
  loading: boolean;
  getUserAppointments: (userSlug: string) => void;
}

export const useUserAppointmentsStore = create<UserBookedAppointmentsState>((set) => ({
  userAppointments: null,
  loading: true,

  getUserAppointments: async (userSlug: string) => {
    try {
      const res = await getUserBookedAppointments(userSlug);
      if (res.status === 200) {
        console.log("APPS:", res.data);
        set({ userAppointments: res.data, loading: false });
      }
    } catch {
      set({ userAppointments: null, loading: false });
    }
  }
}));

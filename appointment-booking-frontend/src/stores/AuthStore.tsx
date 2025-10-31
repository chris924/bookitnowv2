import { create } from "zustand";
import { logoutUser } from "@/api_old/userSide/user";
import { authInfo } from "@/api_old/userSide/auth-info";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { EmployeeGetResponseDTO } from "@/API";
import { CompanyDataResponseDTO } from "@/lib/profile-types";

interface UserState {
  user: UserDataResponseDTO | null; // includes avatar, name, etc.
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  updateUserAvatar: (data: string) => void;
  updateUserObject: (data: UserDataResponseDTO) => void;
  logout: () => Promise<void>;
}

interface EmployeeState {
  employee: EmployeeGetResponseDTO | null; // includes avatar, name, etc.
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  updateEmployeeAvatar: (data: string) => void;
  updateEmployeeObject: (data: EmployeeGetResponseDTO) => void;
  logout: () => Promise<void>;
}

interface CompanyState {
  company: CompanyDataResponseDTO | null; // includes avatar, name, etc.
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  updateCompanyAvatar: (data: string) => void;
  updateCompanyObject: (data: CompanyDataResponseDTO) => void;
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


export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await authInfo();
      if (res.status === 200) {
        set({ employee: res.data, isAuthenticated: true, loading: false });
      }
    } catch {
      set({ employee: null, isAuthenticated: false, loading: false });
    }
  },

  updateEmployeeAvatar: (avatarUrl: string) =>
  set((state) => ({
    employee: state.employee ? { ...state.employee, avatarUrl } : state.employee,
  })),

  updateEmployeeObject: (updatedUser: EmployeeGetResponseDTO) =>
    set((state) => ({
      employee: updatedUser
    })),

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({ employee: null, isAuthenticated: false, loading: false });
    }
  },
}));


export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await authInfo();
      if (res.status === 200) {
        set({ company: res.data, isAuthenticated: true, loading: false });
      }
    } catch {
      set({ company: null, isAuthenticated: false, loading: false });
    }
  },

  updateCompanyAvatar: (avatarUrl: string) =>
  set((state) => ({
    company: state.company ? { ...state.company, avatarUrl } : state.company,
  })),

  updateCompanyObject: (updatedUser: CompanyDataResponseDTO) =>
    set((state) => ({
      company: updatedUser
    })),

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({ company: null, isAuthenticated: false, loading: false });
    }
  },
}));



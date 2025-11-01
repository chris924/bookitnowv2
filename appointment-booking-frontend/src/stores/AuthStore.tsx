import { create } from "zustand";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { AuthInfoResponseDTO, CompanyGetResponseDTO, EmployeeGetResponseDTO } from "@/API";
import { api } from "@/lib/apiClient";


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
  company: CompanyGetResponseDTO | null; // includes avatar, name, etc.
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  updateCompanyAvatar: (data: string) => void;
  updateCompanyObject: (data: CompanyGetResponseDTO) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await api.authInfo.checkAuth();
      if (res.userGetResponseDTO) {
        set({ user: res.userGetResponseDTO, isAuthenticated: true, loading: false });
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
      await api.userAuth.logoutUser();
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
        const res = await api.authInfo.checkAuth();
      if (res.employeeGetResponseDTO) {
        set({ employee: res.employeeGetResponseDTO, isAuthenticated: true, loading: false });
      }
    } catch(error) {
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
   //   await api.employeeAuth.logoutEmployee(); //TODO
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
      const res = await api.authInfo.checkAuth();
      console.log("RES: ", res);
      if (res.companyGetResponseDTO) {
        set({ company: res.companyGetResponseDTO, isAuthenticated: true, loading: false });
        console.log("FFFF");
      }
    } catch(error){
        console.error("checkAuth error:", error);
      set({ company: null, isAuthenticated: false, loading: false });
    }
  },

  updateCompanyAvatar: (avatarUrl: string) =>
  set((state) => ({
    company: state.company ? { ...state.company, avatarUrl } : state.company,
  })),

  updateCompanyObject: (updatedUser: CompanyGetResponseDTO) =>
    set((state) => ({
      company: updatedUser
    })),

  logout: async () => {
    try {
      await api.companyAuth.logoutCompany(); 
    } finally {
      set({ company: null, isAuthenticated: false, loading: false });
    }
  },
}));



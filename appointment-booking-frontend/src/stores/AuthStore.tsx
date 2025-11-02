import { create } from "zustand";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { AuthInfoResponseDTO, CompanyGetResponseDTO, EmployeeGetResponseDTO } from "@/API";
import { api } from "@/lib/apiClient";


interface UserState {
  user: UserDataResponseDTO | null; // includes avatar, name, etc.
  userLoading: boolean;
  isAuthenticated: boolean;
  checkUserAuth: () => Promise<void>;
  updateUserAvatar: (data: string) => void;
  updateUserObject: (data: UserDataResponseDTO) => void;
  logout: () => Promise<void>;
}

interface EmployeeState {
  employee: EmployeeGetResponseDTO | null; // includes avatar, name, etc.
  employeeLoading: boolean;
  isAuthenticated: boolean;
  checkEmployeeAuth: () => Promise<void>;
  updateEmployeeAvatar: (data: string) => void;
  updateEmployeeObject: (data: EmployeeGetResponseDTO) => void;
  logout: () => Promise<void>;
}

interface CompanyState {
  company: CompanyGetResponseDTO | null; // includes avatar, name, etc.
  companyLoading: boolean;
  isAuthenticated: boolean;
  checkCompanyAuth: () => Promise<void>;
  updateCompanyAvatar: (data: string) => void;
  updateCompanyObject: (data: CompanyGetResponseDTO) => void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userLoading: true,
  isAuthenticated: false,

  checkUserAuth: async () => {
    try {
      const res = await api.authInfo.checkAuth();
      if (res.userGetResponseDTO) {
        set({ user: res.userGetResponseDTO, isAuthenticated: true, userLoading: false });
      }
      else
        set({ user: null, isAuthenticated: false, userLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, userLoading: false });
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
      set({ user: null, isAuthenticated: false, userLoading: false });
    }
  },
}));


export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  employeeLoading: true,
  isAuthenticated: false,

  checkEmployeeAuth: async () => {
    try {
        const res = await api.authInfo.checkAuth();
      if (res.employeeGetResponseDTO) {
        set({ employee: res.employeeGetResponseDTO, isAuthenticated: true, employeeLoading: false });
      }
      else
        set({ employee: null, isAuthenticated: false, employeeLoading: false });
    } catch(error) {
      set({ employee: null, isAuthenticated: false, employeeLoading: false });
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
      set({ employee: null, isAuthenticated: false, employeeLoading: false });
    }
  },
}));


export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  companyLoading: true,
  isAuthenticated: false,

  checkCompanyAuth: async () => {
    try {
      const res = await api.authInfo.checkAuth();
      console.log("RES: ", res);
      if (res.companyGetResponseDTO) {
        set({ company: res.companyGetResponseDTO, isAuthenticated: true, companyLoading: false });
        console.log("FFFF");
      }
      else
        set({ company: null, isAuthenticated: false, companyLoading: false });
    } catch(error){
        console.error("checkAuth error:", error);
      set({ company: null, isAuthenticated: false, companyLoading: false });
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
      set({ company: null, isAuthenticated: false, companyLoading: false });
    }
  },
}));



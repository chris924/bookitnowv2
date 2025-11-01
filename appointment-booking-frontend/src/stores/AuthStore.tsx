import { create } from "zustand";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { AuthInfoResponseDTO, CompanyGetResponseDTO, EmployeeGetResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";


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

async function checkAuthFunction(): Promise<AuthInfoResponseDTO>  {

  const api = useApi();
  const res = await api.authInfo.checkAuth();
  return res;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await checkAuthFunction();
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
      const api = useApi();
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
      const res = await checkAuthFunction();
      if (res.companyGetResponseDTO) {
        set({ employee: res.companyGetResponseDTO, isAuthenticated: true, loading: false });
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
      const api = useApi();
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
      const res = await checkAuthFunction();
      if (res.companyGetResponseDTO) {
        set({ company: res.companyGetResponseDTO, isAuthenticated: true, loading: false });
      }
    } catch {
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
      const api = useApi();
      await api.companyAuth.logoutCompany(); 
    } finally {
      set({ company: null, isAuthenticated: false, loading: false });
    }
  },
}));



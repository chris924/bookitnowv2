import { create } from "zustand"
import axios from "axios"

interface AuthState {
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      })
      if (res.status === 200) {
        set({ isAuthenticated: true })
      }
    } catch {
      set({ isAuthenticated: false })
    }
  },

  logout: async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, {
        withCredentials: true, 
      })
    } catch {
    } finally {
      set({ isAuthenticated: false })
    }
  }
}))
import { create } from "zustand"
import axios from "axios"

interface User {
  id: string
  email: string
  name: string
}

interface UserAuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<UserAuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
 
  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/user/me", {
        withCredentials: true,
      })
      if (res.status === 200) {
        set({ isAuthenticated: true, user: res.data, loading: false })
      }
    } catch {
      set({ isAuthenticated: false, user: null, loading: false })
    }
  },

  logout: async () => {
    try {
      await axios.post("http://localhost:8080/auth/user/logout", {}, {
        withCredentials: true, 
      })
    } catch {
    } finally {
      set({ isAuthenticated: false, user: null, loading: false })
    }
  }
}))
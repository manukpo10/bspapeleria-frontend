import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (authResponse) => {
        localStorage.setItem('token', authResponse.token)
        set({ user: authResponse, token: authResponse.token })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.rol === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export default useAuthStore

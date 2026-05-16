import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address, NotificationPreferences } from '../types';
import { authApi } from '../services/authApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdminView: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateAddresses: (addresses: Address[]) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;
  toggleAdminView: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdminView: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        authApi.logout();
        set({ user: null, isAuthenticated: false, isAdminView: false });
      },
      fetchUser: async () => {
        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
      updateUser: (data) => set((state) => state.user ? { user: { ...state.user, ...data } } : {}),
      updateAddresses: (addresses) => set((state) => state.user ? { user: { ...state.user, addresses } } : {}),
      updateNotificationPreferences: (prefs) => set((state) => state.user ? { user: { ...state.user, notificationPreferences: prefs } } : {}),
      toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),
    }),
    { name: 'bs-auth-storage' }
  )
);

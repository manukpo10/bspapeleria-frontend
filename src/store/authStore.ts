import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address, NotificationPreferences } from '../types';

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdminView: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, isAdminView: false }),
      updateUser: (data) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...data } });
      },
      updateAddresses: (addresses) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, addresses } });
      },
      updateNotificationPreferences: (prefs) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, notificationPreferences: prefs } });
      },
      toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),
    }),
    { name: 'bs-auth-storage' }
  )
);

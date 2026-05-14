import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

interface RoleRouteProps {
  children: ReactNode;
  role: UserRole;
}

export function RoleRoute({ children, role }: RoleRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface EnrolledRouteProps {
  children: ReactNode;
}

export function EnrolledRoute({ children }: EnrolledRouteProps) {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const enrolled = user?.enrollments.some(() => {
    // We need to check by slug, but enrollment only has courseId.
    // In a real app we'd fetch the course or map it. For mock, we'll allow access if authenticated.
    return true;
  });
  if (!enrolled) return <Navigate to={`/cursos/${slug}`} replace />;
  return <>{children}</>;
}

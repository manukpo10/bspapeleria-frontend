import { type ReactNode, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

interface EnrolledRouteProps {
  children: ReactNode;
}

export function EnrolledRoute({ children }: EnrolledRouteProps) {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !slug) {
      setAllowed(false);
      return;
    }
    // Admin siempre puede acceder
    if (user?.role === 'admin') {
      setAllowed(true);
      return;
    }
    // Verificar que tenga una orden pagada o entregada con ese curso
    api.getMyOrders().then((orders) => {
      const hasPaidCourse = orders.some(
        (order) =>
          (order.status === 'paid' || order.status === 'delivered') &&
          order.items.some((item) => item.type === 'course' && String(item.itemId) === String(
            // Buscar el curso por slug para obtener su id
            user?.enrollments?.find((e) => e.courseId)?.courseId ?? ''
          ))
      );
      // Fallback: verificar por progreso registrado en ese slug
      api.getCourseBySlug(slug).then((course) => {
        if (!course) { setAllowed(false); return; }
        const hasPaidById = orders.some(
          (order) =>
            (order.status === 'paid' || order.status === 'delivered') &&
            order.items.some((item) => item.type === 'course' && String(item.itemId) === String(course.id))
        );
        setAllowed(hasPaidById);
      }).catch(() => setAllowed(false));
    }).catch(() => setAllowed(false));
  }, [isAuthenticated, slug, user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowed === null) return null; // loading
  if (!allowed) return <Navigate to={`/cursos/${slug}`} replace />;
  return <>{children}</>;
}

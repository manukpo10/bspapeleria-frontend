import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Package, Play } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import { courses } from '../data/mocks';


export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const { enrollments } = useEnrollmentStore();

  const enrolledCourses = enrollments.length;
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const completed = enrollments.filter((e) => e.progress >= 100).length;
  const certificates = enrollments.filter((e) => e.certificateUnlocked).length;

  const lastEnrollment = enrollments.length > 0
    ? enrollments.sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())[0]
    : null;

  const lastCourse = lastEnrollment ? courses.find((c) => c.id === lastEnrollment.courseId) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-dark">Hola, {user?.name?.split(' ')[0]}</h1>
        <p className="text-dark/60 text-sm">Este es tu resumen de actividad</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cursos inscritos', value: enrolledCourses, icon: BookOpen, color: 'bg-primary/10 text-primary' },
          { label: 'En progreso', value: inProgress, icon: Play, color: 'bg-warning/10 text-warning' },
          { label: 'Completados', value: completed, icon: Award, color: 'bg-success/10 text-success' },
          { label: 'Certificados', value: certificates, icon: Award, color: 'bg-secondary/10 text-secondary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white border border-sand/50 p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-display font-semibold text-dark">{stat.value}</p>
            <p className="text-xs text-dark/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {lastCourse && lastEnrollment && (
        <div className="rounded-2xl bg-white border border-sand/50 p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Continuar aprendiendo</h3>
          <div className="flex items-start gap-4">
            <img src={lastCourse.coverImage} alt={lastCourse.title} className="w-24 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-display font-medium text-dark">{lastCourse.title}</h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-sand/50 overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${lastEnrollment.progress}%` }} />
                </div>
                <span className="text-xs text-dark/60">{lastEnrollment.progress}%</span>
              </div>
              <Link
                to={`/cursos/${lastCourse.slug}/aprender`}
                className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
              >
                <Play className="w-3 h-3" /> Reanudar
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-sand/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-dark">Mis cursos en progreso</h3>
            <Link to="/mi-cuenta/mis-cursos" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {enrollments.filter((e) => e.progress > 0 && e.progress < 100).slice(0, 3).map((e) => {
              const c = courses.find((c) => c.id === e.courseId);
              if (!c) return null;
              return (
                <div key={e.courseId} className="flex items-center gap-3">
                  <img src={c.coverImage} alt={c.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-sand/50 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${e.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-dark/50">{e.progress}%</span>
                    </div>
                  </div>
                  <Link to={`/cursos/${c.slug}/aprender`} className="p-2 rounded-full bg-sand/30 hover:bg-sand/50 transition-colors">
                    <Play className="w-4 h-4 text-dark" />
                  </Link>
                </div>
              );
            })}
            {enrollments.filter((e) => e.progress > 0 && e.progress < 100).length === 0 && (
              <p className="text-sm text-dark/60">No tenés cursos en progreso.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-sand/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-dark">Últimos pedidos</h3>
            <Link to="/mi-cuenta/pedidos" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {user?.orders?.slice(0, 3).map((orderId) => (
              <div key={orderId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-dark/40" />
                  <span className="text-dark">{orderId}</span>
                </div>
                <Link to="/mi-cuenta/pedidos" className="text-primary hover:underline text-xs">Ver</Link>
              </div>
            ))}
            {(!user?.orders || user.orders.length === 0) && (
              <p className="text-sm text-dark/60">No tenés pedidos aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

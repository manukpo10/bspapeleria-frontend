import { Link } from 'react-router-dom';
import { BookOpen, Award, CircleCheck, GraduationCap, Package, Play, ShoppingBag } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { ProgressBar } from '../components/shared/ProgressBar';
import { useAuthStore } from '../store/authStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import { courses } from '../data/mocks';

const blockHeading = 'font-display text-xl font-semibold text-dark';
const seeAllLink = 'inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-iris transition-colors hover:text-dark hover:underline';

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

  const stats = [
    { label: 'Cursos inscritos', value: enrolledCourses, icon: BookOpen },
    { label: 'En progreso', value: inProgress, icon: Play },
    { label: 'Completados', value: completed, icon: CircleCheck },
    { label: 'Certificados', value: certificates, icon: Award },
  ];

  const inProgressEnrollments = enrollments.filter((e) => e.progress > 0 && e.progress < 100);

  return (
    <div className="animate-fade-in space-y-8">
      <section aria-labelledby="overview-stats-title">
        <h2 id="overview-stats-title" className="sr-only">Resumen de actividad</h2>
        <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label} className="card p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-mist text-iris">
                <stat.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-2xl font-bold tabular-nums text-dark">{stat.value}</p>
              <p className="mt-0.5 text-sm text-dark/65">{stat.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {lastCourse && lastEnrollment && (
        <section aria-labelledby="continue-title" className="card p-5 sm:p-6">
          <h2 id="continue-title" className={blockHeading}>Continuar aprendiendo</h2>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={lastCourse.coverImage}
              alt=""
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full rounded-2xl bg-sand/40 object-cover sm:w-56 sm:shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold leading-snug text-dark">{lastCourse.title}</h3>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={lastEnrollment.progress} label={`Progreso en ${lastCourse.title}`} />
                <span className="shrink-0 text-sm font-semibold tabular-nums text-dark">{Math.round(lastEnrollment.progress)}%</span>
              </div>
              <Link to={`/cursos/${lastCourse.slug}/aprender`} className="btn btn-primary btn-sm mt-5 min-h-11">
                <Play className="size-4" aria-hidden="true" /> Reanudar
                <span className="sr-only">: {lastCourse.title}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="in-progress-title" className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="in-progress-title" className={blockHeading}>Mis cursos en progreso</h2>
            <Link to="/mi-cuenta/mis-cursos" className={seeAllLink}>Ver todos</Link>
          </div>
          {inProgressEnrollments.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {inProgressEnrollments.slice(0, 3).map((e) => {
                const c = courses.find((c) => c.id === e.courseId);
                if (!c) return null;
                return (
                  <li key={e.courseId} className="flex items-center gap-3">
                    <img
                      src={c.coverImage}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="size-14 shrink-0 rounded-xl bg-sand/40 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dark">{c.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar size="sm" value={e.progress} label={`Progreso en ${c.title}`} />
                        <span className="shrink-0 text-xs tabular-nums text-dark/65">{Math.round(e.progress)}%</span>
                      </div>
                    </div>
                    <Link
                      to={`/cursos/${c.slug}/aprender`}
                      aria-label={`Continuar ${c.title}`}
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-iris transition-colors hover:bg-sand/50 hover:text-dark"
                    >
                      <Play className="size-4" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              compact
              icon={GraduationCap}
              title="No tenés cursos en progreso."
              action={<Link to="/cursos" className="btn btn-secondary btn-sm min-h-11">Ver cursos</Link>}
            />
          )}
        </section>

        <section aria-labelledby="recent-orders-title" className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="recent-orders-title" className={blockHeading}>Últimos pedidos</h2>
            <Link to="/mi-cuenta/pedidos" className={seeAllLink}>Ver todos</Link>
          </div>
          {user?.orders && user.orders.length > 0 ? (
            <ul className="mt-4 divide-y divide-sand/60">
              {user.orders.slice(0, 3).map((orderId) => (
                <li key={orderId} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
                      <Package className="size-5" aria-hidden="true" />
                    </span>
                    <span className="truncate text-sm font-medium text-dark">{orderId}</span>
                  </div>
                  <Link to="/mi-cuenta/pedidos" className="btn btn-ghost btn-sm min-h-11 shrink-0">
                    Ver
                    <span className="sr-only"> pedido {orderId}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              compact
              icon={ShoppingBag}
              title="No tenés pedidos aún."
              action={<Link to="/productos" className="btn btn-secondary btn-sm min-h-11">Ver productos</Link>}
            />
          )}
        </section>
      </div>
    </div>
  );
}

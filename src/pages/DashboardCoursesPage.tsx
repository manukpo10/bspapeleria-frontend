import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, BookOpen, CircleCheck, GraduationCap } from 'lucide-react';
import { api } from '../services/api';
import { EmptyState } from '../components/shared/EmptyState';
import { ProgressBar } from '../components/shared/ProgressBar';
import { SectionHeading } from '../components/shared/SectionHeading';
import { cn } from '../lib/utils';
import type { Course, Enrollment } from '../types';

export default function DashboardCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Map<string, Course>>(new Map());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'in-progress' | 'completed' | 'all'>('all');

  useEffect(() => {
    Promise.all([api.getMyProgresos(), api.getMyOrders()]).then(([progresos, orders]) => {
      // Solo mostrar cursos con orden pagada o entregada
      const paidCourseIds = new Set<string>();
      for (const order of orders) {
        if (order.status === 'paid' || order.status === 'delivered') {
          for (const item of order.items) {
            if (item.type === 'course') paidCourseIds.add(String(item.itemId));
          }
        }
      }

      setEnrollments(
        progresos
          .filter((p: any) => paidCourseIds.has(String(p.cursoId)))
          .map((p: any) => ({
            id: String(p.id),
            courseId: String(p.cursoId),
            enrolledAt: p.fechaInscripcion,
            lastAccessedAt: p.ultimaActividad,
            completedLessons: p.leccionesCompletadas || [],
            currentLessonId: p.leccionActualId ? String(p.leccionActualId) : undefined,
            progress: p.porcentajeProgreso || 0,
            completedAt: p.fechaCompletado,
            certificateUnlocked: p.certificadoDesbloqueado || false,
          }))
      );
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    enrollments.forEach((e) => {
      api.getCourseById(e.courseId).then((course) => {
        if (course) {
          setCourses((prev) => new Map(prev).set(e.courseId, course));
        }
      }).catch(() => {});
    });
  }, [enrollments.length > 0]);

  const filtered = enrollments.filter((e) => {
    if (tab === 'in-progress') return e.progress > 0 && e.progress < 100;
    if (tab === 'completed') return e.progress >= 100;
    return true;
  });

  if (loading) {
    return (
      <div role="status" className="space-y-6">
        <span className="sr-only">Cargando tus cursos…</span>
        <SectionHeading title="Mis cursos" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-sand/40 sm:h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading title="Mis cursos" />

      <div role="group" aria-label="Filtrar cursos" className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'in-progress', label: 'En progreso' },
          { id: 'completed', label: 'Completados' },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              aria-pressed={active}
              className={cn(
                'min-h-11 rounded-full px-5 text-sm font-semibold transition-colors',
                active
                  ? 'bg-dark text-white shadow-soft'
                  : 'bg-white text-dark/75 ring-1 ring-sand hover:text-dark hover:ring-secondary',
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="card"
          icon={BookOpen}
          title="No tenés cursos en esta categoría."
          action={<Link to="/cursos" className="btn btn-secondary">Explorar cursos</Link>}
        >
          Tus cursos van a aparecer acá a medida que avances.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {filtered.map((e) => {
            const c = courses.get(e.courseId);
            if (!c) return null;
            const percent = Math.round(e.progress);
            const done = e.progress >= 100;
            return (
              <li key={e.courseId}>
                <article className="card flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
                  <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-sand/40 sm:w-56">
                    {c.coverImage ? (
                      <img
                        src={c.coverImage}
                        alt=""
                        width={640}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-items-center bg-ribbon text-dark/60">
                        <GraduationCap className="size-10" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <h3 className="min-w-0 font-display text-lg font-semibold leading-snug text-dark">{c.title}</h3>
                      {done && (
                        <span className="chip shrink-0 bg-success/40 text-dark">
                          <CircleCheck className="size-3.5" aria-hidden="true" /> Completado
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-dark/65">Tu progreso</span>
                        <span className="font-display font-semibold tabular-nums text-dark">{percent}% completado</span>
                      </div>
                      <ProgressBar className="mt-2" value={e.progress} label={`Progreso en ${c.title}`} />
                    </div>

                    <div className="mt-auto pt-5">
                      <Link to={`/cursos/${c.slug}/aprender`} className="btn btn-primary btn-sm min-h-11 w-full sm:w-auto">
                        {done ? (
                          <><Award className="size-4" aria-hidden="true" /> Ver certificado</>
                        ) : (
                          <><Play className="size-4" aria-hidden="true" /> Continuar</>
                        )}
                        <span className="sr-only">: {c.title}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

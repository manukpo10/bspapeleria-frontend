import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { CourseCard } from '../components/shared/CourseCard';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import type { Course } from '../types';

// The skeletons use the same columns as the list, so nothing jumps when the courses arrive
const grid = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';
const skeletonBlock = 'animate-pulse rounded-full bg-sand/40';

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-sand/40" />
      <div className="space-y-3 p-5">
        <div className={cn(skeletonBlock, 'h-5 w-11/12')} />
        <div className={cn(skeletonBlock, 'h-5 w-2/3')} />
        <div className={cn(skeletonBlock, 'h-4 w-1/2')} />
        <div className={cn(skeletonBlock, 'h-4 w-3/4')} />
        <div className={cn(skeletonBlock, 'h-6 w-2/5')} />
        <div className={cn(skeletonBlock, 'h-11 w-full')} />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
      <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
        <GraduationCap className="size-9" aria-hidden="true" />
      </span>
      <h3 className="mt-6 font-display text-xl font-semibold text-dark">Todavía no hay cursos publicados</h3>
      <p className="mt-2 max-w-sm text-dark/75">Muy pronto vas a encontrar acá nuestros próximos cursos.</p>
    </div>
  );
}

/*
 * The course catalogue: just the cards, full width. The owner asked to drop the filters (search, level,
 * modality, price) and the sort menu while there are only a few courses (2026-10); they are in the git history
 * if the catalogue grows.
 */
export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getCourses().then(data => {
      if (!cancelled) {
        setCourses(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <SEO title="Cursos" description="Aprendé con nuestros cursos de sublimación, lettering, diseño, impresión 3D y más." />
      <PageHeader
        title="Cursos"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Cursos' }]}
        description={loading ? undefined : `${courses.length} ${courses.length === 1 ? 'curso' : 'cursos'}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h2 className="sr-only">Listado de cursos</h2>
        {loading ? (
          <div role="status">
            <span className="sr-only">Cargando cursos…</span>
            <div className={grid}>
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={grid}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} detailed />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

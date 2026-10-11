import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, GraduationCap, Sparkles, Star, Users } from 'lucide-react';
import type { Course } from '../../types';
import { cn, formatPrice } from '../../lib/utils';

const NEW_COURSE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const levelLabel: Record<Course['level'], string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const modalityLabel: Record<Course['modality'], string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

interface CourseCardProps {
  course: Course;
  /** Adds modality, status flags, review count, module count and a full-width enrol button.
   *  The home slider keeps the minimal body with a text link */
  detailed?: boolean;
}

export function CourseCard({ course, detailed = false }: CourseCardProps) {
  // The clock is read once when the card mounts, so rendering stays pure
  const [mountedAt] = useState(() => Date.now());

  const href = `/cursos/${course.slug}`;
  const isNew = mountedAt - new Date(course.createdAt).getTime() < NEW_COURSE_WINDOW_MS;
  const modules = course.topics.length;

  const priceRow = (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className="font-display text-xl font-bold text-dark">{formatPrice(course.price)}</span>
      {course.comparePrice && (
        <del className="text-sm text-dark/65">
          <span className="sr-only">Precio anterior: </span>
          {formatPrice(course.comparePrice)}
        </del>
      )}
    </div>
  );

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden bg-sand/40">
          {course.coverImage ? (
            <img
              src={course.coverImage}
              alt={course.title}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="grid size-full place-items-center bg-ribbon text-dark/60">
              <GraduationCap className="size-12" aria-hidden="true" />
            </span>
          )}
        </Link>

        <span className="chip pointer-events-none absolute left-3 top-3 bg-white/90 text-dark shadow-soft">
          {levelLabel[course.level] ?? course.level}
        </span>
        {course.duration && (
          <span className="chip pointer-events-none absolute bottom-3 right-3 bg-dark/75 text-white backdrop-blur-sm">
            <Clock className="size-3.5" aria-hidden="true" /> {course.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {detailed && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <p className="text-xs text-dark/65">{modalityLabel[course.modality] ?? course.modality}</p>
            {isNew && <span className="chip bg-mist text-iris">Nuevo</span>}
            {course.featured && (
              <span className="chip bg-mist text-iris">
                <Sparkles className="size-3.5" aria-hidden="true" /> Destacado
              </span>
            )}
          </div>
        )}

        <h3 className={cn('font-display text-lg font-semibold leading-snug text-dark line-clamp-2', detailed && 'mt-1.5')}>
          <Link to={href} className="transition-colors hover:text-iris">
            {course.title}
          </Link>
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <img
            src={course.instructor.avatar}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
            className="size-6 rounded-full object-cover ring-2 ring-sand"
          />
          <span className="text-sm text-dark/70">{course.instructor.name}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dark/65">
          {course.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Duración: </span>
              {course.duration}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Estudiantes: </span>
            {course.enrolledCount}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="sr-only">Calificación: </span>
            {course.rating.toFixed(1)}
            {detailed && ` (${course.reviewsCount})`}
          </span>
          {detailed && modules > 0 && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" aria-hidden="true" />
              {modules} {modules === 1 ? 'módulo' : 'módulos'}
            </span>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="border-t border-sand/60 pt-4">
            {detailed ? (
              <>
                {priceRow}
                <Link to={href} className="btn btn-soft mt-3 w-full">
                  <GraduationCap className="size-4" aria-hidden="true" /> Inscribirme
                  <span className="sr-only">: {course.title}</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                {priceRow}
                <Link
                  to={href}
                  className="group/link inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-iris transition-colors hover:text-dark"
                >
                  Ver curso
                  <ArrowRight
                    className="size-4 transition-transform group-hover/link:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

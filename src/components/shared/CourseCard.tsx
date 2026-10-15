import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, GraduationCap, InfinityIcon, MessageCircle, Sparkles } from 'lucide-react';
import type { Course } from '../../types';
import { formatPrice } from '../../lib/utils';

const NEW_COURSE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Lower case on purpose: it reads as "Nivel inicial" in the meta line
const levelLabel: Record<Course['level'], string> = {
  principiante: 'inicial',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
};

const modalityLabel: Record<Course['modality'], string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

interface CourseCardProps {
  course: Course;
  /** Same content in both variants. Detailed closes with a full-width button under the price;
   *  the home slider and related courses keep a text link beside it */
  detailed?: boolean;
}

export function CourseCard({ course, detailed = false }: CourseCardProps) {
  // The clock is read once when the card mounts, so rendering stays pure
  const [mountedAt] = useState(() => Date.now());

  const href = `/cursos/${course.slug}`;
  const isNew = mountedAt - new Date(course.createdAt).getTime() < NEW_COURSE_WINDOW_MS;
  const shortDescription = course.shortDescription.trim();

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

        {(isNew || course.featured) && (
          <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
            {isNew && <span className="chip bg-white/90 text-iris shadow-soft">Nuevo</span>}
            {course.featured && (
              <span className="chip bg-white/90 text-iris shadow-soft">
                <Sparkles className="size-3.5" aria-hidden="true" /> Destacado
              </span>
            )}
          </div>
        )}
        {course.duration && (
          <span className="chip pointer-events-none absolute bottom-3 right-3 bg-dark/75 text-white backdrop-blur-sm">
            <Clock className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Duración: </span>
            {course.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Wraps instead of squeezing: on a narrow card the second item drops below the first */}
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-dark/70">
          <li className="flex items-start gap-1.5">
            <InfinityIcon className="size-4 shrink-0 text-iris" aria-hidden="true" /> Acceso de por vida
          </li>
          <li className="flex items-start gap-1.5">
            <MessageCircle className="size-4 shrink-0 text-iris" aria-hidden="true" /> Acompañamiento personalizado
          </li>
        </ul>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-dark line-clamp-2">
          <Link to={href} className="transition-colors hover:text-iris">
            {course.title}
          </Link>
        </h3>

        {shortDescription && <p className="mt-2 text-sm text-dark/75 line-clamp-3">{shortDescription}</p>}

        <p className="mt-3 text-xs text-dark/65">
          {modalityLabel[course.modality] ?? course.modality} <span aria-hidden="true">·</span> Nivel{' '}
          {levelLabel[course.level] ?? course.level}
        </p>

        <div className="mt-auto pt-5">
          <div className="border-t border-sand/60 pt-4">
            {detailed ? (
              <>
                {priceRow}
                <Link to={href} className="btn btn-soft mt-3 w-full">
                  <GraduationCap className="size-4" aria-hidden="true" /> Conocer el curso
                  <span className="sr-only">: {course.title}</span>
                </Link>
              </>
            ) : (
              // Wraps so the longer link never pushes past the edge of a narrow slider card
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                {priceRow}
                <Link
                  to={href}
                  className="group/link inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-iris transition-colors hover:text-dark"
                >
                  Conocer el curso
                  <span className="sr-only">: {course.title}</span>
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

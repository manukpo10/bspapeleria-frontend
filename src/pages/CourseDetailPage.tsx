import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play, Clock, Users, BookOpen, Check, ChevronDown, FileText, HelpCircle,
  FileDown, ClipboardList, ShoppingCart, GraduationCap, Sparkles,
  InfinityIcon, CirclePlay, MessageCircleHeart,
  type LucideIcon
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { Breadcrumbs } from '../components/shared/PageHeader';
import { StarRating } from '../components/shared/StarRating';
import { MobileBuyBar, mobileBuyBarClearance } from '../components/shared/MobileBuyBar';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { cn, formatPrice } from '../lib/utils';
import type { Course, Lesson } from '../types';
import { toast } from 'sonner';

const lessonMeta: Record<Lesson['type'], { icon: LucideIcon; label: string }> = {
  video: { icon: Play, label: 'Video' },
  text: { icon: FileText, label: 'Lectura' },
  quiz: { icon: HelpCircle, label: 'Cuestionario' },
  assignment: { icon: ClipboardList, label: 'Tarea' },
  file: { icon: FileDown, label: 'Material descargable' },
};

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

// What every course of the shop includes (the owner's list), shown in the purchase card
const courseIncludes: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: InfinityIcon, title: 'Acceso de por vida', detail: 'Volvé a las clases cuando quieras.' },
  { icon: CirclePlay, title: 'Clases grabadas', detail: 'Aprendé a tu ritmo y desde donde estés.' },
  { icon: MessageCircleHeart, title: 'Acompañamiento personalizado', detail: 'Consultá tus dudas durante el aprendizaje.' },
  { icon: BookOpen, title: 'Contenido paso a paso', detail: 'Desde el diseño hasta el armado final.' },
];

// Every course is taught by the shop's owners, so "Sobre el instructor" introduces them in their own words
const teamPhotos = [
  { src: '/images/brand/clari-avatar.webp', name: 'Clari' },
  { src: '/images/brand/dario-avatar.webp', name: 'Darío' },
];
const teamBio = [
  'Somos Clari y Darío, y hace más de 6 años que trabajamos en el mundo de la papelería personalizada.',
  'Empezamos aprendiendo, probando y resolviendo problemas, igual que muchas de las personas que hoy llegan a nuestros cursos.',
  'Ahora compartimos nuestra experiencia para que puedas aprender de forma sencilla, evitar errores comunes y animarte a crear tu propio emprendimiento.',
];

// The API gives the duration as "8h"; running text reads "8 horas"
const hoursLabel = (duration: string) => {
  const hours = parseInt(duration, 10);
  return Number.isNaN(hours) ? duration : `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
};

const sectionHeading = 'font-display text-2xl font-bold tracking-tight text-dark';
const skeletonBlock = 'animate-pulse rounded-full bg-sand/40';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [playingPreview, setPlayingPreview] = useState(false);
  // The page's own main call to action: the phone buy bar watches it
  const [ctaEl, setCtaEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getCourseBySlug(slug)
      .then((c) => {
        setCourse(c ?? null);
        if (c?.topics[0]) setExpandedTopic(c.topics[0].id);
        setLoading(false);
      })
      .catch(() => {
        setCourse(null);
        setLoading(false);
      });
  }, [slug]);

  // A session stored by an older version of the site may have no enrollments list
  const isEnrolled = isAuthenticated && user?.enrollments?.some((e) => e.courseId === course?.id);

  const handleAddToCart = () => {
    if (!course) return;
    addItem({
      id: `cart-${course.id}`,
      type: 'course',
      itemId: course.id,
      name: course.title,
      image: course.coverImage,
      price: course.price,
      quantity: 1,
      isDigital: true,
    });
    toast.success('Curso agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  if (loading) {
    return (
      <div role="status">
        <span className="sr-only">Cargando curso…</span>
        <div className="bg-ribbon-soft">
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-4 sm:px-6 lg:px-8">
            <div className={cn(skeletonBlock, 'h-4 w-56')} />
            <div className="mt-6 max-w-2xl space-y-4">
              <div className={cn(skeletonBlock, 'h-10 w-3/4')} />
              <div className={cn(skeletonBlock, 'h-4 w-full')} />
              <div className={cn(skeletonBlock, 'h-4 w-5/6')} />
              <div className={cn(skeletonBlock, 'h-5 w-1/2')} />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-48 animate-pulse rounded-3xl bg-sand/40" />
              <div className="h-24 animate-pulse rounded-3xl bg-sand/40" />
            </div>
            <div className="h-80 animate-pulse rounded-3xl bg-sand/40" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
          <GraduationCap className="size-9" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-dark">Curso no encontrado</h1>
        <p className="mt-3 max-w-md text-dark/75">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
        <Link to="/cursos" className="btn btn-primary mt-8">Ver todos los cursos</Link>
      </div>
    );
  }

  const totalLessons = course.topics.reduce((sum, t) => sum + t.lessons.length, 0);
  const discount = course.comparePrice ? Math.round((1 - course.price / course.comparePrice) * 100) : 0;
  // The full description leads the page (the owner's layout); the short one is for the course cards and the
  // search snippet, and stands in only when a course has no full description
  const heroText = course.description.trim() || course.shortDescription.trim();
  const instructor = course.instructor;

  // The main action is defined once and rendered twice: in the purchase card and in the phone buy bar
  const renderMainAction = (className: string, ref?: (el: HTMLElement | null) => void) =>
    isEnrolled ? (
      <Link ref={ref} to={`/cursos/${course.slug}/aprender`} className={className}>
        <Play className="size-5" aria-hidden="true" /> Continuar aprendiendo
      </Link>
    ) : (
      <button ref={ref} type="button" onClick={handleAddToCart} className={className}>
        <ShoppingCart className="size-5" aria-hidden="true" /> Agregar al carrito
      </button>
    );
  const mainActionClass = 'btn btn-primary btn-lg w-full whitespace-normal text-center';

  return (
    <>
      <SEO title={course.title} description={course.shortDescription} image={course.coverImage} />

      {/* One grid for the whole page: the hero copy and the body share the left columns, and the
          purchase card spans both rows on the right so it can stay sticky from the top of the hero.
          The clip only trims the full-bleed hero gradient, it does not create a scroll container */}
      <div className="overflow-x-clip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
            {/* Hero band background, full width of the viewport */}
            <div aria-hidden="true" className="relative col-start-1 row-start-1 lg:col-end-4">
              <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-ribbon-soft" />
            </div>

            {/* Hero copy */}
            <header className="relative col-start-1 row-start-1 min-w-0 pb-10 pt-2 lg:col-end-3 lg:pb-14">
              <Breadcrumbs
                crumbs={[
                  { label: 'Inicio', to: '/' },
                  { label: 'Cursos', to: '/cursos' },
                  { label: course.title },
                ]}
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="chip bg-white text-dark shadow-soft">{levelLabel[course.level] ?? course.level}</span>
                <span className="chip bg-white text-dark shadow-soft">{modalityLabel[course.modality] ?? course.modality}</span>
                {course.featured && (
                  <span className="chip bg-white text-iris shadow-soft">
                    <Sparkles className="size-3.5" aria-hidden="true" /> Destacado
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                {course.title}
              </h1>
              {heroText && <p className="mt-4 max-w-2xl whitespace-pre-line text-base text-dark/75">{heroText}</p>}

              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-dark/75">
                {/* A new course has no reviews and no students yet: those figures are left out instead of printing zeros */}
                {course.reviewsCount > 0 && (
                  <li>
                    <StarRating rating={course.rating} count={course.reviewsCount} size={18} />
                  </li>
                )}
                {course.enrolledCount > 0 && (
                  <li className="flex items-center gap-2">
                    <Users className="size-5 text-iris" aria-hidden="true" /> {course.enrolledCount} estudiantes
                  </li>
                )}
                {course.duration && (
                  <li className="flex items-center gap-2">
                    <Clock className="size-5 text-iris" aria-hidden="true" /> {hoursLabel(course.duration)}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <BookOpen className="size-5 text-iris" aria-hidden="true" /> {totalLessons} lecciones
                </li>
              </ul>

              {/* Every course is taught by the shop itself, so the line under the name speaks for it */}
              <div className="mt-6 text-sm">
                <p className="text-dark/75">
                  Dictado por <span className="font-semibold text-dark">{instructor.name}</span>
                </p>
                <p className="mt-0.5 text-dark/65">Aprendé con quienes también emprendieron desde cero.</p>
              </div>
            </header>

            {/* Purchase card */}
            <aside
              aria-label="Inscripción al curso"
              className="relative z-10 col-start-1 row-start-2 min-w-0 max-lg:-mt-6 lg:col-start-3 lg:row-start-1 lg:row-end-3 lg:pt-4"
            >
              <div className="card p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-mist ring-1 ring-sand/70">
                  {playingPreview && course.videoPreviewUrl ? (
                    <iframe
                      src={course.videoPreviewUrl.replace('watch?v=', 'embed/')}
                      className="size-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Vista previa del curso"
                    />
                  ) : (
                    <>
                      {course.coverImage ? (
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          width={640}
                          height={360}
                          decoding="async"
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-items-center bg-ribbon text-dark/60">
                          <GraduationCap className="size-12" aria-hidden="true" />
                        </span>
                      )}
                      {course.videoPreviewUrl && (
                        <button
                          type="button"
                          onClick={() => setPlayingPreview(true)}
                          aria-label="Reproducir vista previa del curso"
                          className="group/play absolute inset-0 grid place-items-center bg-dark/10 transition-colors hover:bg-dark/25 focus-visible:-outline-offset-4"
                        >
                          <span className="grid size-16 place-items-center rounded-full bg-white/95 text-dark shadow-lift transition-transform group-hover/play:scale-105">
                            <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-display text-3xl font-bold text-dark">{formatPrice(course.price)}</p>
                  {course.comparePrice && (
                    <del className="font-display text-xl text-dark/65">
                      <span className="sr-only">Precio anterior: </span>
                      {formatPrice(course.comparePrice)}
                    </del>
                  )}
                  {discount > 0 && <span className="chip bg-dark text-white">-{discount}%</span>}
                </div>

                {isEnrolled ? (
                  renderMainAction(cn(mainActionClass, 'mt-5'), setCtaEl)
                ) : (
                  <div className="mt-5 grid gap-3">
                    {renderMainAction(mainActionClass, setCtaEl)}
                    <button
                      type="button"
                      onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                      className="btn btn-secondary btn-lg w-full whitespace-normal text-center"
                    >
                      Inscribirme ahora
                    </button>
                  </div>
                )}

                <div className="mt-6 border-t border-sand/60 pt-5">
                  <h2 className="font-display text-sm font-semibold text-dark">Este curso incluye</h2>
                  <ul className="mt-4 space-y-4">
                    {courseIncludes.map(({ icon: Icon, title, detail }) => (
                      <li key={title} className="flex items-start gap-3 text-sm">
                        <Icon className="mt-0.5 size-5 shrink-0 text-iris" aria-hidden="true" />
                        <p>
                          <span className="block font-semibold text-dark">{title}</span>
                          <span className="block text-dark/65">{detail}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Body */}
            <div
              className={cn(
                'col-start-1 row-start-3 min-w-0 space-y-12 py-10 lg:col-end-3 lg:row-start-2 lg:py-12',
                mobileBuyBarClearance,
              )}
            >
              {/* What you'll learn */}
              {course.whatYouWillLearn.length > 0 && (
                <section aria-labelledby="learn-heading" className="card p-6 sm:p-8">
                  <h2 id="learn-heading" className={sectionHeading}>Lo que vas a aprender</h2>
                  <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {course.whatYouWillLearn.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-dark/75">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mist text-iris">
                          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Requirements */}
              {course.requirements.length > 0 && (
                <section aria-labelledby="requirements-heading">
                  <h2 id="requirements-heading" className={sectionHeading}>Requisitos previos</h2>
                  <ul className="mt-5 space-y-3">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-dark/75">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Syllabus */}
              {course.topics.length > 0 && (
                <section aria-labelledby="syllabus-heading">
                  <h2 id="syllabus-heading" className={sectionHeading}>Esto es lo que vas a aprender</h2>
                  {/* The course's own introduction when it has one; otherwise the figures */}
                  <p className="mt-2 max-w-3xl text-sm text-dark/65">
                    {course.syllabusIntro || (
                      <>
                        {course.topics.length} {course.topics.length === 1 ? 'módulo' : 'módulos'} · {totalLessons} lecciones
                        {course.duration && ` · ${course.duration}`}
                      </>
                    )}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {course.topics.map((topic, index) => {
                      const open = expandedTopic === topic.id;
                      return (
                        <li key={topic.id} className="card overflow-hidden">
                          <h3>
                            <button
                              type="button"
                              id={`topic-btn-${topic.id}`}
                              aria-expanded={open}
                              aria-controls={`topic-panel-${topic.id}`}
                              onClick={() => setExpandedTopic(open ? null : topic.id)}
                              className={cn(
                                'flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-mist',
                                open && 'bg-mist',
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className="grid size-10 shrink-0 place-items-center rounded-xl bg-ribbon font-display text-sm font-bold text-dark"
                              >
                                {index + 1}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display font-semibold leading-snug text-dark">{topic.title}</span>
                                <span className="mt-0.5 block text-xs text-dark/65">
                                  {topic.lessons.length} {topic.lessons.length === 1 ? 'lección' : 'lecciones'}
                                </span>
                              </span>
                              <span
                                aria-hidden="true"
                                className={cn(
                                  'grid size-8 shrink-0 place-items-center rounded-full transition-all',
                                  open ? 'rotate-180 bg-dark text-white' : 'bg-mist text-iris',
                                )}
                              >
                                <ChevronDown className="size-5" />
                              </span>
                            </button>
                          </h3>
                          <div
                            id={`topic-panel-${topic.id}`}
                            hidden={!open}
                            className="animate-fade-in border-t border-sand/60"
                          >
                            <ul className="divide-y divide-sand/50">
                              {topic.lessons.map((lesson) => {
                                const meta = lessonMeta[lesson.type] ?? lessonMeta.video;
                                const LessonIcon = meta.icon;
                                return (
                                  <li key={lesson.id} className="flex items-center gap-3 px-5 py-3.5">
                                    <span
                                      className={cn(
                                        'grid size-10 shrink-0 place-items-center rounded-xl',
                                        lesson.isPreview ? 'bg-mist text-iris' : 'bg-sand/40 text-dark/65',
                                      )}
                                    >
                                      <LessonIcon className="size-5" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-medium text-dark">{lesson.title}</span>
                                      <span className="block text-xs text-dark/65">
                                        {meta.label}
                                        {lesson.duration && ` · ${lesson.duration}`}
                                      </span>
                                    </span>
                                    {lesson.isPreview && <span className="chip shrink-0 bg-mist text-iris">Vista previa</span>}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Instructor: the shop's owners, with their photos and their own words */}
              <section aria-labelledby="instructor-heading">
                <h2 id="instructor-heading" className={sectionHeading}>Sobre el instructor</h2>
                <div className="card mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
                  <div className="flex shrink-0 -space-x-3">
                    {teamPhotos.map((person) => (
                      <img
                        key={person.name}
                        src={person.src}
                        alt={person.name}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="size-20 rounded-full object-cover ring-4 ring-white"
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-dark">{instructor.name}</h3>
                    <p className="text-sm text-dark/65">Emprendedores y creadores de contenido educativo</p>
                    <div className="mt-4 space-y-3 text-dark/75">
                      {teamBio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      <p className="font-semibold text-dark">Nos encanta enseñar, pero sobre todo acompañarte mientras aprendés.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Frequently asked questions: each course has its own. Reviews stay hidden until there are real ones,
                  and related courses come back when the catalogue has more than a handful */}
              {course.faqs && course.faqs.length > 0 && (
                <section aria-labelledby="faq-heading">
                  <h2 id="faq-heading" className={sectionHeading}>Preguntas frecuentes</h2>
                  <ul className="mt-6 space-y-3">
                    {course.faqs.map((faq, i) => (
                      <li key={`${i}-${faq.question}`} className="card p-5 sm:p-6">
                        <h3 className="font-display text-base font-semibold text-dark">{faq.question}</h3>
                        <p className="mt-2 whitespace-pre-line text-dark/75">{faq.answer}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileBuyBar
        watch={ctaEl}
        // An enrolled student does not need the price: the whole bar is the way back to the classroom
        price={
          isEnrolled ? undefined : (
            <>
              <p className="font-display text-xl font-bold leading-tight text-dark">{formatPrice(course.price)}</p>
              {course.comparePrice ? (
                <del className="text-xs text-dark/65">
                  <span className="sr-only">Precio anterior: </span>
                  {formatPrice(course.comparePrice)}
                </del>
              ) : null}
            </>
          )
        }
        action={renderMainAction('btn btn-primary w-full whitespace-normal px-4 text-center')}
      />
    </>
  );
}

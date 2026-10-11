import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play, Clock, Users, Star, BookOpen, Check, ChevronDown, FileText, HelpCircle,
  FileDown, ClipboardList, ShoppingCart, Award, GraduationCap, Sparkles, MessageSquareText,
  type LucideIcon
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { Breadcrumbs } from '../components/shared/PageHeader';
import { CourseCard } from '../components/shared/CourseCard';
import { StarRating } from '../components/shared/StarRating';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { cn, formatPrice } from '../lib/utils';
import type { Course, Lesson } from '../types';
import { courses, reviews as mockReviews } from '../data/mocks';
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

const tabs = [
  { id: 'reviews', label: 'Reseñas' },
  { id: 'qa', label: 'Q&A' },
] as const;

type TabId = (typeof tabs)[number]['id'];

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
  const [activeTab, setActiveTab] = useState<TabId>('reviews');
  const [playingPreview, setPlayingPreview] = useState(false);
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

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

  const isEnrolled = isAuthenticated && user?.enrollments.some((e) => e.courseId === course?.id);

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
  // Backend courses have one description only: it goes in the hero and the "about" block is left out
  const heroText = course.shortDescription || course.description;
  const showAbout = Boolean(course.description) && course.description !== heroText;
  const relatedCourses = courses.filter((c) => c.id !== course.id).slice(0, 2);
  const instructor = course.instructor;

  // Arrow keys, Home and End move between tabs, as in the ARIA tabs pattern
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, current: TabId) => {
    const index = tabs.findIndex((t) => t.id === current);
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const nextId = tabs[next].id;
    setActiveTab(nextId);
    tabRefs.current[nextId]?.focus();
  };

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
              <p className="mt-4 max-w-2xl text-base text-dark/75">{heroText}</p>

              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-dark/75">
                <li>
                  <StarRating rating={course.rating} count={course.reviewsCount} size={18} />
                </li>
                <li className="flex items-center gap-2">
                  <Users className="size-5 text-iris" aria-hidden="true" /> {course.enrolledCount} estudiantes
                </li>
                {course.duration && (
                  <li className="flex items-center gap-2">
                    <Clock className="size-5 text-iris" aria-hidden="true" /> {course.duration}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <BookOpen className="size-5 text-iris" aria-hidden="true" /> {totalLessons} lecciones
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <img
                  src={instructor.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover ring-2 ring-white"
                />
                <p className="text-sm text-dark/75">
                  Dictado por <span className="font-semibold text-dark">{instructor.name}</span>
                </p>
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
                  <Link to={`/cursos/${course.slug}/aprender`} className="btn btn-primary btn-lg mt-5 w-full whitespace-normal text-center">
                    <Play className="size-5" aria-hidden="true" /> Continuar aprendiendo
                  </Link>
                ) : (
                  <div className="mt-5 grid gap-3">
                    <button type="button" onClick={handleAddToCart} className="btn btn-primary btn-lg w-full whitespace-normal text-center">
                      <ShoppingCart className="size-5" aria-hidden="true" /> Agregar al carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                      className="btn btn-secondary btn-lg w-full whitespace-normal text-center"
                    >
                      Inscribirme ahora
                    </button>
                  </div>
                )}

                {(course.includes.length > 0 || course.certificate) && (
                  <div className="mt-6 border-t border-sand/60 pt-5">
                    <h2 className="font-display text-sm font-semibold text-dark">Este curso incluye</h2>
                    <ul className="mt-3 space-y-2.5">
                      {course.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-dark/75">
                          <Check className="mt-0.5 size-5 shrink-0 text-iris" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                      {course.certificate && (
                        <li className="flex items-start gap-3 text-sm text-dark/75">
                          <Award className="mt-0.5 size-5 shrink-0 text-iris" aria-hidden="true" />
                          Certificado de finalización
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Body */}
            <div className="col-start-1 row-start-3 min-w-0 space-y-12 py-10 lg:col-end-3 lg:row-start-2 lg:py-12">
              {/* About */}
              {showAbout && (
                <section aria-labelledby="about-heading">
                  <h2 id="about-heading" className={sectionHeading}>Sobre este curso</h2>
                  <p className="mt-4 max-w-3xl whitespace-pre-line text-base text-dark/75">{course.description}</p>
                </section>
              )}

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
                  <h2 id="syllabus-heading" className={sectionHeading}>Temario del curso</h2>
                  <p className="mt-2 text-sm text-dark/65">
                    {course.topics.length} {course.topics.length === 1 ? 'módulo' : 'módulos'} · {totalLessons} lecciones
                    {course.duration && ` · ${course.duration}`}
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

              {/* Instructor */}
              <section aria-labelledby="instructor-heading">
                <h2 id="instructor-heading" className={sectionHeading}>Sobre el instructor</h2>
                <div className="card mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="size-20 shrink-0 rounded-full object-cover ring-4 ring-mist"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-dark">{instructor.name}</h3>
                    {instructor.bio && <p className="mt-2 text-dark/75">{instructor.bio}</p>}
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-dark/65">
                      {instructor.coursesCount > 0 && (
                        <li className="flex items-center gap-1.5">
                          <BookOpen className="size-4 text-iris" aria-hidden="true" /> {instructor.coursesCount} cursos
                        </li>
                      )}
                      {instructor.studentsCount > 0 && (
                        <li className="flex items-center gap-1.5">
                          <Users className="size-4 text-iris" aria-hidden="true" /> {instructor.studentsCount} estudiantes
                        </li>
                      )}
                      {instructor.rating > 0 && (
                        <li className="flex items-center gap-1.5">
                          <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {instructor.rating.toFixed(1)}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Reviews & Q&A */}
              <section aria-labelledby="reviews-heading">
                <h2 id="reviews-heading" className={sectionHeading}>Reseñas y preguntas</h2>
                <div className="mt-6">
                  <div
                    role="tablist"
                    aria-label="Reseñas y preguntas del curso"
                    className="flex gap-1 overflow-x-auto border-b border-sand/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        ref={(el) => { tabRefs.current[tab.id] = el; }}
                        id={`tab-${tab.id}`}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        onClick={() => setActiveTab(tab.id)}
                        onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                        className={cn(
                          'min-h-12 shrink-0 border-b-[3px] px-4 font-display text-sm font-semibold transition-colors sm:px-6',
                          activeTab === tab.id
                            ? 'border-iris text-dark'
                            : 'border-transparent text-dark/65 hover:text-dark',
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div
                    key={activeTab}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    tabIndex={0}
                    className="animate-fade-in pt-6"
                  >
                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        <div className="card flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:gap-6 sm:text-left">
                          <p className="font-display text-5xl font-bold text-dark">{course.rating.toFixed(1)}</p>
                          <div>
                            <StarRating rating={course.rating} size={20} className="justify-center sm:justify-start" />
                            <p className="mt-1 text-sm text-dark/65">Basado en {course.reviewsCount} reseñas</p>
                          </div>
                        </div>
                        <ul className="space-y-4">
                          {mockReviews.slice(0, 4).map((review) => (
                            <li key={review.id} className="card p-5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={review.userAvatar}
                                  alt=""
                                  width={40}
                                  height={40}
                                  loading="lazy"
                                  decoding="async"
                                  className="size-10 rounded-full object-cover ring-2 ring-sand"
                                />
                                <div>
                                  <p className="font-display text-sm font-semibold text-dark">{review.userName}</p>
                                  <StarRating rating={review.rating} size={14} className="mt-0.5" />
                                </div>
                              </div>
                              <p className="mt-3 text-dark/75">{review.comment}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activeTab === 'qa' && (
                      <div className="flex items-center gap-4 rounded-2xl bg-mist p-5">
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-iris">
                          <MessageSquareText className="size-6" aria-hidden="true" />
                        </span>
                        <p className="text-dark/75">Sección de Q&A próximamente.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Related courses */}
              {relatedCourses.length > 0 && (
                <section aria-labelledby="related-heading">
                  <h2 id="related-heading" className={sectionHeading}>Cursos relacionados</h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {relatedCourses.map((related) => (
                      <CourseCard key={related.id} course={related} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

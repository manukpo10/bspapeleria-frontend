import { useState, useEffect, useMemo, useRef, useId, type KeyboardEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play, FileText, HelpCircle, FileDown, Check, ChevronLeft, ChevronRight,
  ChevronDown, BookOpen, Award, X, Clock, Download, MessageCircle,
  ThumbsUp, Pencil, Trash2, MonitorPlay, Plus, ClipboardList, LockOpen,
  Upload, Loader2, type LucideIcon
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { Dialog } from '../components/shared/Dialog';
import { ProgressBar } from '../components/shared/ProgressBar';
import { ScaledEmbed } from '../components/shared/ScaledEmbed';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import type { Course, Lesson, Topic, QAItem } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

/* ─── helpers ─── */

const LESSON_META: Record<Lesson['type'], { icon: LucideIcon; label: string }> = {
  video: { icon: Play, label: 'Video' },
  text: { icon: FileText, label: 'Lectura' },
  quiz: { icon: HelpCircle, label: 'Cuestionario' },
  assignment: { icon: ClipboardList, label: 'Tarea' },
  file: { icon: FileDown, label: 'Material' },
};

function LessonIcon({ type }: { type: Lesson['type'] }) {
  const Icon = (LESSON_META[type] ?? LESSON_META.video).icon;
  return <Icon className="size-4 shrink-0" aria-hidden="true" />;
}

const TAB_LIST = [
  { key: 'summary' as const, label: 'Resumen' },
  { key: 'resources' as const, label: 'Recursos' },
  { key: 'qa' as const, label: 'Q&A' },
  { key: 'notes' as const, label: 'Notas' },
  { key: 'announcements' as const, label: 'Anuncios' },
];

type TabKey = typeof TAB_LIST[number]['key'];

interface LocalNote {
  id: string;
  content: string;
  timestamp: string;
  createdAt: string;
}

const INITIAL_NOTES: LocalNote[] = [
  { id: 'n1', content: 'Recordar que la temperatura ideal para poliéster es 200°C. No exceder el tiempo para evitar quemaduras.', timestamp: '04:32', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'n2', content: 'El papel de sublimación debe ser de buena calidad. El barato deja residuos en la prensa.', timestamp: '09:18', createdAt: '2026-01-10T10:05:00Z' },
];

const MOCK_RESOURCES = [
  { name: 'Guía de materiales.pdf', size: '2.4 MB' },
  { name: 'Plantilla base.psd', size: '15 MB' },
  { name: 'Tabla de temperaturas.xlsx', size: '180 KB' },
  { name: 'Checklist de control.pdf', size: '850 KB' },
];

const FALLBACK_QAS: QAItem[] = [
  {
    id: 'fallback-1',
    courseId: '',
    userId: 'u-1',
    userName: 'Ana García',
    question: '¿Se puede aplicar sublimación sobre algodón?',
    answers: [{ userId: 'inst-1', userName: 'Belén Sánchez', isInstructor: true, content: 'Directamente no, ya que la sublimación requiere materiales sintéticos. Para algodón se usa una técnica diferente llamada transferencia con vinilo o poliamida.', createdAt: '2026-01-12T00:00:00Z' }],
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'fallback-2',
    courseId: '',
    userId: 'u-2',
    userName: 'Carlos Ruiz',
    question: '¿Cuánto tiempo dura la tinta de sublimación?',
    answers: [{ userId: 'inst-1', userName: 'Belén Sánchez', isInstructor: true, content: 'La tinta de sublimación tiene una vida útil de aproximadamente 6 meses una vez abierta. Guardala en un lugar fresco y oscuro.', createdAt: '2026-01-14T00:00:00Z' }],
    createdAt: '2026-01-13T00:00:00Z',
  },
];

interface MockAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
}

const MOCK_ANNOUNCEMENTS: MockAnnouncement[] = [
  { id: 'a1', title: 'Nueva actualización del curso', content: 'Agregamos 2 lecciones bonus sobre sublimación en aluminio y botellas térmicas. ¡No te las pierdas!', date: '2026-01-15' },
  { id: 'a2', title: 'Sesión en vivo este viernes', content: 'Este viernes 20 de enero a las 19hs haremos una sesión de preguntas y respuestas en vivo. Prepará tus consultas.', date: '2026-01-18' },
];

/* ─── shared styles ─── */

const panelTitle = 'font-display text-lg font-semibold text-dark';

// Text lessons arrive as an HTML string and the Typography plugin is not installed, so the elements are styled from here
const lessonHtml =
  'max-w-prose text-base text-dark/75 [&>*:first-child]:mt-0 [&_p]:mt-4 ' +
  '[&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-dark ' +
  '[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-dark ' +
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1.5 ' +
  '[&_a]:font-medium [&_a]:text-iris [&_a]:underline [&_strong]:font-semibold [&_strong]:text-dark ' +
  '[&_img]:mt-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_pre]:mt-4 [&_pre]:overflow-x-auto';

const iconButton =
  'grid size-11 shrink-0 place-items-center rounded-full text-dark/70 transition-colors hover:bg-sand/40 hover:text-dark';

/* ─── sub-components (same file) ─── */

function TopicItem({
  topic,
  enrollment,
  currentLessonId,
  onSelectLesson,
}: {
  topic: Topic;
  enrollment: import('../types').Enrollment | undefined;
  currentLessonId: string;
  onSelectLesson: (l: Lesson) => void;
}) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(() =>
    topic.lessons.some((l) => l.id === currentLessonId)
  );

  useEffect(() => {
    if (topic.lessons.some((l) => l.id === currentLessonId)) {
      setExpanded(true);
    }
  }, [currentLessonId, topic.lessons]);

  const completedCount = topic.lessons.filter((l) =>
    enrollment?.completedLessons.includes(l.id)
  ).length;
  const totalCount = topic.lessons.length;

  return (
    <li className="border-b border-sand/60 last:border-b-0">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-mist focus-visible:-outline-offset-2',
          expanded && 'bg-mist',
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-semibold leading-snug text-dark">{topic.title}</span>
          <span className="mt-0.5 block text-xs text-dark/65">
            {completedCount} de {totalCount} completadas
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full transition-all',
            expanded ? 'rotate-180 bg-dark text-white' : 'bg-mist text-iris',
          )}
        >
          <ChevronDown className="size-5" />
        </span>
      </button>
      <div id={panelId} hidden={!expanded} className="animate-fade-in">
        <ul className="space-y-1 px-2 py-2">
          {topic.lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isDone = enrollment?.completedLessons.includes(lesson.id);
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => onSelectLesson(lesson)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors focus-visible:-outline-offset-2',
                    isActive ? 'bg-sand/50' : 'hover:bg-mist',
                  )}
                >
                  {isDone ? (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-iris text-white">
                      <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      <span className="sr-only">Completada</span>
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-full ring-2',
                        isActive ? 'ring-iris' : 'ring-sand',
                      )}
                    >
                      {isActive && <span aria-hidden="true" className="size-2 rounded-full bg-iris" />}
                      <span className="sr-only">{isActive ? 'En curso' : 'Pendiente'}</span>
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'line-clamp-2 block text-sm leading-snug text-dark',
                        isActive ? 'font-semibold' : 'font-medium',
                      )}
                    >
                      {lesson.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-dark/65">
                      <span className="inline-flex items-center gap-1.5">
                        <LessonIcon type={lesson.type} />
                        {(LESSON_META[lesson.type] ?? LESSON_META.video).label}
                        {lesson.duration && ` · ${lesson.duration}`}
                      </span>
                      {lesson.isPreview && (
                        <span className="chip bg-mist text-iris">
                          <LockOpen className="size-3.5" aria-hidden="true" /> Vista previa
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

function SidebarContent({
  course,
  enrollment,
  currentLessonId,
  onSelectLesson,
  onClose,
}: {
  course: Course;
  enrollment: import('../types').Enrollment | undefined;
  currentLessonId: string;
  onSelectLesson: (l: Lesson) => void;
  onClose?: () => void;
}) {
  const progress = enrollment?.progress ?? 0;
  return (
    <>
      <div className="border-b border-sand/60 p-4">
        <div className="flex items-start gap-3">
          <img
            src={course.coverImage}
            alt=""
            width={56}
            height={56}
            decoding="async"
            className="size-14 shrink-0 rounded-2xl bg-sand/40 object-cover"
          />
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold leading-snug text-dark">
              {course.title}
            </p>
            <p className="mt-0.5 text-xs text-dark/65">
              {course.instructor.name}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark/65">Tu progreso</span>
            <span className="font-display font-semibold tabular-nums text-dark">{Math.round(progress)}%</span>
          </div>
          <ProgressBar className="mt-2" value={progress} label="Progreso del curso" />
        </div>
        <Link
          to={`/cursos/${course.slug}`}
          onClick={onClose}
          className="btn btn-ghost btn-sm -ml-3 mt-3 min-h-11"
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Volver al curso
        </Link>
      </div>
      <nav aria-label="Temario del curso">
        <ul>
          {course.topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              enrollment={enrollment}
              currentLessonId={currentLessonId}
              onSelectLesson={(l) => {
                onSelectLesson(l);
                onClose?.();
              }}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

/* ─── main page ─── */

export default function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const { enrollments, updateEnrollment, syncWithBackend } = useEnrollmentStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [noteContent, setNoteContent] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNoteContent, setQuickNoteContent] = useState('');
  const [notesList, setNotesList] = useState<LocalNote[]>(INITIAL_NOTES);
  const [qaList] = useState<QAItem[]>([]);
  const tabRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});

  const enrollment = useMemo(
    () => enrollments.find((e) => e.courseId === course?.id),
    [enrollments, course?.id]
  );

  const allLessons = useMemo(
    () => course?.topics.flatMap((t) => t.lessons) ?? [],
    [course]
  );

  const currentIndex = currentLesson
    ? allLessons.findIndex((l) => l.id === currentLesson.id)
    : -1;

  useEffect(() => {
    if (!slug) return;
    api.getCourseBySlug(slug).then((c) => {
      if (c) {
        setCourse(c);
        const existing = enrollments.find((e) => e.courseId === c.id);
        if (existing?.currentLessonId) {
          const lesson = c.topics
            .flatMap((t) => t.lessons)
            .find((l) => l.id === existing.currentLessonId);
          if (lesson) setCurrentLesson(lesson);
        } else {
          setCurrentLesson(c.topics[0]?.lessons[0] ?? null);
        }
      }
    });
    if (user) syncWithBackend();
  }, [slug, user]);

  const handleCompleteLesson = async () => {
    if (!course || !currentLesson || !user) return;
    const alreadyCompleted = enrollment?.completedLessons.includes(currentLesson.id);
    if (alreadyCompleted) return;
    try {
      const updated = await api.updateLessonProgress(
        course.id,
        user.id,
        currentLesson.id,
        true
      );
      updateEnrollment(course.id, updated);
      toast.success('¡Lección completada! 🎉 +1 paso más cerca del certificado');
      if (updated.progress >= 100) {
        setShowCertificate(true);
        toast.success('¡Felicitaciones! Completaste el curso');
      }
    } catch (err) {
      toast.error((err as { message?: string }).message);
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
      setQuizSubmitted(false);
      setQuizResult(null);
      setQuizAnswers({});
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
      setQuizSubmitted(false);
      setQuizResult(null);
      setQuizAnswers({});
    }
  };

  const handleQuizSubmit = async () => {
    if (!course || !currentLesson?.quiz || !user) return;
    try {
      const result = await api.submitQuiz(
        course.id,
        user.id,
        currentLesson.quiz.id,
        quizAnswers
      );
      setQuizSubmitted(true);
      setQuizResult(result);
      if (result.passed) {
        toast.success(`¡Aprobaste! Puntaje: ${result.score}`);
        handleCompleteLesson();
      } else {
        toast.error(`No aprobaste. Puntaje: ${result.score}`);
      }
    } catch (err) {
      toast.error((err as { message?: string }).message);
    }
  };

  const handleAddNote = async (overrideContent?: string) => {
    if (!course || !currentLesson || !user) return;
    const contentToSave = (overrideContent ?? noteContent).trim();
    if (!contentToSave) return;
    try {
      await api.addNote(course.id, user.id, currentLesson.id, contentToSave, 0);
      toast.success('Nota guardada');
      setNoteContent('');
      setNotesList((prev) => [
        {
          id: `local-${Date.now()}`,
          content: contentToSave,
          timestamp: new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      toast.error((err as { message?: string }).message);
    }
  };

  if (!course || !currentLesson) {
    return (
      <div role="status" className="grid min-h-[50vh] place-items-center p-8 text-center">
        <div className="flex flex-col items-center gap-3 text-dark/75">
          <Loader2 className="size-8 animate-spin text-iris" aria-hidden="true" />
          <p>Cargando aula...</p>
        </div>
      </div>
    );
  }

  const isCompleted = enrollment?.completedLessons.includes(currentLesson.id) ?? false;
  const embedUrl = currentLesson.videoUrl?.includes('/embed/')
    ? currentLesson.videoUrl
    : currentLesson.videoUrl?.replace('watch?v=', 'embed/');
  const videoFrameProps = {
    src: embedUrl,
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
    title: currentLesson.title,
  };

  const displayQAs =
    qaList.length >= 3
      ? qaList.slice(0, 3)
      : [...qaList, ...FALLBACK_QAS].slice(0, 3);

  const overallProgress = enrollment?.progress ?? 0;

  const selectLesson = (l: Lesson) => {
    setCurrentLesson(l);
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizAnswers({});
  };

  // Arrow keys, Home and End move between tabs, as in the ARIA tabs pattern
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, current: TabKey) => {
    const index = TAB_LIST.findIndex((t) => t.key === current);
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
        next = (index + 1) % TAB_LIST.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + TAB_LIST.length) % TAB_LIST.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = TAB_LIST.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const nextKey = TAB_LIST[next].key;
    setActiveTab(nextKey);
    tabRefs.current[nextKey]?.focus();
  };

  const resources = (
    course.courseMaterials && course.courseMaterials.length > 0
      ? course.courseMaterials.map((f) => ({
          name: f.name,
          size: 'Descargable',
          url: f.url,
        }))
      : currentLesson.files && currentLesson.files.length > 0
      ? currentLesson.files.map((f) => ({
          name: f.name,
          size: 'Descargable',
          url: f.url,
        }))
      : MOCK_RESOURCES.map((r) => ({ ...r, url: '#' }))
  );

  return (
    <>
      <SEO title={`Aula - ${course.title}`} />
      <div className="flex h-[calc(100dvh-5.0625rem)]">
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <aside
            aria-label="Temario del curso"
            className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r border-sand/60 bg-white lg:flex"
          >
            <SidebarContent
              course={course}
              enrollment={enrollment}
              currentLessonId={currentLesson.id}
              onSelectLesson={selectLesson}
            />
          </aside>
        )}

        {/* Mobile Sidebar Drawer */}
        <Dialog
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          labelledBy="mobile-toc-title"
          placement="left"
          scrimClassName="lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-sand/60 py-2 pl-4 pr-2">
            <p id="mobile-toc-title" className="font-display text-lg font-semibold text-dark">Temario</p>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Cerrar temario"
              className={iconButton}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <SidebarContent
            course={course}
            enrollment={enrollment}
            currentLessonId={currentLesson.id}
            onSelectLesson={selectLesson}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </Dialog>

        {/* Floating desktop reopen button */}
        {!sidebarOpen && (
          <div className="fixed bottom-4 left-4 z-10 hidden lg:block">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mostrar temario"
              className="grid size-12 place-items-center rounded-full bg-dark text-white shadow-lift transition-colors hover:bg-dark/85"
            >
              <BookOpen className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-mist">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-sand/60 bg-white/90 px-4 py-2 backdrop-blur-sm lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileSidebarOpen}
              className="btn btn-secondary btn-sm min-h-11 shrink-0"
            >
              <BookOpen className="size-4 text-iris" aria-hidden="true" /> Temario
            </button>
            <ProgressBar size="sm" value={overallProgress} label="Progreso del curso" />
            <span className="shrink-0 text-sm font-semibold tabular-nums text-dark">{Math.round(overallProgress)}%</span>
          </div>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl animate-fade-in space-y-6">
              {/* Breadcrumb + title */}
              <div>
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-dark/65">
                  <span className="min-w-0">{course.title}</span>
                  <ChevronRight className="size-4 shrink-0 text-dark/40" aria-hidden="true" />
                  <span className="font-medium text-dark/75">
                    Lección {currentIndex + 1} de {allLessons.length}
                  </span>
                </p>
                <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-dark sm:text-3xl">
                  {currentLesson.title}
                </h1>
              </div>

              {/* Lesson Player */}
              <div
                className={cn(
                  'overflow-hidden rounded-3xl',
                  currentLesson.type === 'video' ? 'bg-dark shadow-lift' : 'card',
                )}
              >
                {currentLesson.type === 'video' && (
                  <div className="aspect-video bg-dark">
                    {embedUrl ? (
                      // Drive's player crops its poster below 480px of width, so ScaledEmbed scales that one down
                      <ScaledEmbed {...videoFrameProps} />
                    ) : (
                      <div className="grid size-full place-items-center p-6 text-center text-white">
                        <div>
                          <MonitorPlay className="mx-auto size-10" aria-hidden="true" />
                          <p className="mt-3">El video de esta lección todavía no está disponible.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {currentLesson.type === 'text' && currentLesson.content && (
                  <div className="p-6 sm:p-8">
                    <div
                      className={lessonHtml}
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  </div>
                )}
                {currentLesson.type === 'quiz' && currentLesson.quiz && (
                  <div className="p-6 sm:p-8">
                    {!quizSubmitted ? (
                      <div className="space-y-5">
                        {currentLesson.quiz.questions.map((q, i) => (
                          <div key={q.id} className="rounded-2xl bg-mist p-5">
                            {q.type === 'short-answer' ? (
                              <>
                                <label htmlFor={`quiz-${q.id}`} className="block font-medium text-dark">
                                  {i + 1}. {q.question}
                                </label>
                                <input
                                  id={`quiz-${q.id}`}
                                  name={q.id}
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Tu respuesta"
                                  onChange={(e) =>
                                    setQuizAnswers({
                                      ...quizAnswers,
                                      [q.id]: e.target.value,
                                    })
                                  }
                                  className="field mt-3"
                                />
                              </>
                            ) : (
                              <fieldset>
                                <legend className="font-medium text-dark">
                                  {i + 1}. {q.question}
                                </legend>
                                {q.type === 'multiple-choice' && q.options && (
                                  <div className="mt-3 space-y-2">
                                    {q.options.map((opt) => (
                                      <label
                                        key={opt}
                                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-2 text-dark/80 ring-1 ring-sand transition-colors hover:text-dark hover:ring-secondary has-checked:text-dark has-checked:ring-2 has-checked:ring-iris"
                                      >
                                        <input
                                          type="radio"
                                          name={q.id}
                                          value={opt}
                                          onChange={(e) =>
                                            setQuizAnswers({
                                              ...quizAnswers,
                                              [q.id]: e.target.value,
                                            })
                                          }
                                          className="size-5 shrink-0 accent-iris"
                                        />
                                        {opt}
                                      </label>
                                    ))}
                                  </div>
                                )}
                                {q.type === 'true-false' && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {['true', 'false'].map((opt) => (
                                      <label
                                        key={opt}
                                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-2 text-dark/80 ring-1 ring-sand transition-colors hover:text-dark hover:ring-secondary has-checked:text-dark has-checked:ring-2 has-checked:ring-iris"
                                      >
                                        <input
                                          type="radio"
                                          name={q.id}
                                          value={opt}
                                          onChange={(e) =>
                                            setQuizAnswers({
                                              ...quizAnswers,
                                              [q.id]: e.target.value,
                                            })
                                          }
                                          className="size-5 shrink-0 accent-iris"
                                        />
                                        {opt === 'true' ? 'Verdadero' : 'Falso'}
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </fieldset>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleQuizSubmit}
                          className="btn btn-primary"
                        >
                          Enviar respuestas
                        </button>
                      </div>
                    ) : (
                      <div role="status" className="py-6 text-center">
                        <span
                          className={cn(
                            'mx-auto grid size-16 place-items-center rounded-full text-dark',
                            quizResult?.passed ? 'bg-success/40' : 'bg-error/40',
                          )}
                        >
                          {quizResult?.passed ? (
                            <Check className="size-8" aria-hidden="true" />
                          ) : (
                            <X className="size-8" aria-hidden="true" />
                          )}
                        </span>
                        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-dark">
                          {quizResult?.passed ? '¡Aprobaste!' : 'No aprobaste'}
                        </h2>
                        <p className="mt-1 text-dark/75">
                          Puntaje: {quizResult?.score} puntos
                        </p>
                        {!quizResult?.passed && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                            }}
                            className="btn btn-secondary mt-6"
                          >
                            Reintentar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {currentLesson.type === 'assignment' && currentLesson.assignment && (
                  <div className="p-6 sm:p-8">
                    <h2 className="font-display text-xl font-semibold text-dark">
                      {currentLesson.assignment.title}
                    </h2>
                    <p className="mt-2 max-w-prose text-dark/75">
                      {currentLesson.assignment.description}
                    </p>
                    <div className="mt-6 rounded-2xl border-2 border-dashed border-sand bg-mist p-8 text-center">
                      <Upload className="mx-auto size-8 text-iris" aria-hidden="true" />
                      <p className="mt-2 text-sm text-dark/75">
                        Arrastrá tu archivo aquí o hacé clic para subir
                      </p>
                      <input type="file" className="hidden" aria-label="Archivo de la tarea" />
                    </div>
                  </div>
                )}
                {currentLesson.type === 'file' && currentLesson.files && (
                  <div className="p-6 sm:p-8">
                    <h2 className="font-display text-xl font-semibold text-dark">
                      Recursos descargables
                    </h2>
                    <ul className="mt-4 space-y-2">
                      {currentLesson.files.map((file) => (
                        <li key={file.name}>
                          <a
                            href={file.url}
                            className="flex min-h-14 items-center gap-3 rounded-2xl bg-mist px-4 py-3 text-dark transition-colors hover:bg-sand/40"
                          >
                            <FileDown className="size-5 shrink-0 text-iris" aria-hidden="true" />
                            <span className="min-w-0 text-sm font-medium">{file.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Instructor Card */}
              <section aria-label="Instructor" className="card p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="size-14 shrink-0 rounded-full object-cover ring-2 ring-sand"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-dark">
                      {course.instructor.name} · Instructora de Sublimación
                    </p>
                    <p className="mt-0.5 text-sm text-dark/65">
                      Más de 8 años enseñando técnicas creativas
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <button
                      type="button"
                      onClick={() => toast.info('Perfil del instructor próximamente')}
                      className="btn btn-secondary btn-sm min-h-11"
                    >
                      Ver perfil
                    </button>
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-sand/60 pt-4 text-sm text-dark/65">
                  <li className="flex items-center gap-1.5">
                    <MonitorPlay className="size-4 text-iris" aria-hidden="true" /> Video ·{' '}
                    {currentLesson.duration}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <FileDown className="size-4 text-iris" aria-hidden="true" />{' '}
                    {currentLesson.files?.length ?? 3} recursos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MessageCircle className="size-4 text-iris" aria-hidden="true" /> 12 preguntas Q&A
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Pencil className="size-4 text-iris" aria-hidden="true" /> Tomá notas
                  </li>
                </ul>
              </section>

              {/* Tabs */}
              <div>
                <div
                  role="tablist"
                  aria-label="Información de la lección"
                  className="flex gap-1 overflow-x-auto border-b border-sand/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {TAB_LIST.map((tab) => (
                    <button
                      key={tab.key}
                      ref={(el) => { tabRefs.current[tab.key] = el; }}
                      id={`learn-tab-${tab.key}`}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.key}
                      aria-controls={activeTab === tab.key ? `learn-panel-${tab.key}` : undefined}
                      tabIndex={activeTab === tab.key ? 0 : -1}
                      onClick={() => setActiveTab(tab.key)}
                      onKeyDown={(e) => handleTabKeyDown(e, tab.key)}
                      className={cn(
                        'min-h-12 shrink-0 border-b-[3px] px-4 font-display text-sm font-semibold transition-colors sm:px-6',
                        activeTab === tab.key
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
                  id={`learn-panel-${activeTab}`}
                  aria-labelledby={`learn-tab-${activeTab}`}
                  tabIndex={0}
                  className="animate-fade-in pt-6"
                >
                  {activeTab === 'summary' && (
                    <div className="space-y-6">
                      <div className="card p-5 sm:p-6">
                        <h2 className={panelTitle}>Sobre esta lección</h2>
                        <p className="mt-3 max-w-prose text-dark/75">
                          {currentLesson.type === 'video'
                            ? 'En esta lección vamos a profundizar en los conceptos fundamentales a través de un video explicativo paso a paso. Preparate para tomar notas y pausar cuando sea necesario.'
                            : currentLesson.type === 'text'
                            ? 'Esta lección teórica cubre los conceptos esenciales que necesitás dominar antes de pasar a la práctica. Asegurate de leer atentamente y consultar los recursos adjuntos.'
                            : currentLesson.type === 'quiz'
                            ? 'Es momento de poner a prueba tus conocimientos. Respondé las preguntas con atención y recordá que podés reintentar si no apruebas en el primer intento.'
                            : 'En esta lección aplicarás todo lo aprendido en un proyecto práctico. Seguí las instrucciones cuidadosamente y no dudes en consultar el foro de preguntas.'}
                        </p>
                      </div>
                      <div className="card p-5 sm:p-6">
                        <h2 className={panelTitle}>Qué vas a aprender</h2>
                        <ul className="mt-4 space-y-3">
                          {course.whatYouWillLearn
                            .slice(0, 5)
                            .map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-dark/75"
                              >
                                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mist text-iris">
                                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                                </span>
                                {item}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className="card p-5 sm:p-6">
                        <h2 className={panelTitle}>Antes de empezar</h2>
                        <ul className="mt-4 space-y-3">
                          {course.requirements.map((req, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-dark/75"
                            >
                              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <ul className="space-y-3">
                      {resources.map((file, i) => (
                        <li
                          key={i}
                          className="card flex items-center gap-4 p-4"
                        >
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
                            <FileDown className="size-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-dark">
                              {file.name}
                            </p>
                            <p className="text-xs text-dark/65">
                              {file.size}
                            </p>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-soft btn-sm min-h-11 shrink-0"
                          >
                            <Download className="size-4" aria-hidden="true" /> Descargar
                            <span className="sr-only">: {file.name} (se abre en una pestaña nueva)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'qa' && (
                    <div className="space-y-4">
                      <ul className="space-y-4">
                        {displayQAs.map((qa) => (
                          <li
                            key={qa.id}
                            className="card p-5"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                aria-hidden="true"
                                className="grid size-10 shrink-0 place-items-center rounded-full bg-mist font-display text-sm font-bold text-iris"
                              >
                                {qa.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-dark">
                                    {qa.userName}
                                  </p>
                                  <span className="shrink-0 text-xs text-dark/65">
                                    {new Date(qa.createdAt).toLocaleDateString(
                                      'es-AR'
                                    )}
                                  </span>
                                </div>
                                <p className="mt-1 text-dark/75">
                                  {qa.question}
                                </p>
                                <div className="-ml-3 mt-1 flex items-center gap-1">
                                  <button
                                    type="button"
                                    aria-label="Me gusta (3)"
                                    className="btn btn-ghost btn-sm min-h-11"
                                  >
                                    <ThumbsUp className="size-4" aria-hidden="true" /> 3
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Responder a ${qa.userName}`}
                                    className="btn btn-ghost btn-sm min-h-11"
                                  >
                                    Responder
                                  </button>
                                </div>
                              </div>
                            </div>
                            {qa.answers.map((ans, ai) => (
                              <div
                                key={ai}
                                className="mt-4 flex items-start gap-3 rounded-2xl bg-mist p-4 sm:ml-12"
                              >
                                <img
                                  src={course.instructor.avatar}
                                  alt=""
                                  width={32}
                                  height={32}
                                  loading="lazy"
                                  decoding="async"
                                  className="size-8 shrink-0 rounded-full object-cover ring-2 ring-white"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="text-sm font-semibold text-dark">
                                      {ans.userName}
                                    </span>
                                    <span className="chip bg-white text-iris">
                                      Instructora
                                    </span>
                                    <span className="text-xs text-dark/65">
                                      {new Date(
                                        ans.createdAt
                                      ).toLocaleDateString('es-AR')}
                                    </span>
                                  </div>
                                  <p className="text-dark/75">
                                    {ans.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info('Hacer una pregunta próximamente')
                        }
                        className="btn btn-secondary w-full"
                      >
                        <Plus className="size-4" aria-hidden="true" /> Hacer una pregunta
                      </button>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="card p-5 sm:p-6">
                        <label htmlFor="lesson-note" className="mb-1.5 block text-sm font-medium text-dark">
                          Nueva nota
                        </label>
                        <textarea
                          id="lesson-note"
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Escribí una nota sobre esta lección..."
                          rows={4}
                          className="field min-h-28 resize-y"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleAddNote()}
                            disabled={!noteContent.trim()}
                            className="btn btn-primary btn-sm min-h-11"
                          >
                            Guardar nota con timestamp
                          </button>
                        </div>
                      </div>
                      <ul className="space-y-4">
                        {notesList.map((note) => (
                          <li
                            key={note.id}
                            className="card p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <span className="chip bg-mist text-iris">
                                  <Clock className="size-3.5" aria-hidden="true" />{' '}
                                  {note.timestamp}
                                </span>
                                <p className="mt-3 text-dark/75">
                                  {note.content}
                                </p>
                              </div>
                              <div className="-mr-2 -mt-2 flex shrink-0 items-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toast.info('Editar nota próximamente')
                                  }
                                  aria-label={`Editar la nota de las ${note.timestamp}`}
                                  className={iconButton}
                                >
                                  <Pencil className="size-4" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNotesList((prev) =>
                                      prev.filter((n) => n.id !== note.id)
                                    )
                                  }
                                  aria-label={`Eliminar la nota de las ${note.timestamp}`}
                                  className={cn(iconButton, 'hover:bg-rose-50 hover:text-rose-700')}
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'announcements' && (
                    <ul className="space-y-4">
                      {MOCK_ANNOUNCEMENTS.map((ann) => (
                        <li
                          key={ann.id}
                          className="card p-5 sm:p-6"
                        >
                          <time dateTime={ann.date} className="chip bg-mist text-iris">
                            {ann.date}
                          </time>
                          <h2 className={cn(panelTitle, 'mt-3')}>
                            {ann.title}
                          </h2>
                          <p className="mt-2 max-w-prose text-dark/75">
                            {ann.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-sand/60 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevLesson}
                  disabled={currentIndex === 0}
                  aria-label="Lección anterior"
                  className="btn btn-secondary min-h-11 max-sm:size-11 max-sm:p-0"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  <span className="max-sm:sr-only">Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteLesson}
                  disabled={isCompleted}
                  className={cn(
                    'btn min-h-11 w-full whitespace-normal text-center max-sm:py-2',
                    isCompleted ? 'btn-soft disabled:opacity-100' : 'btn-primary',
                  )}
                >
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                  {isCompleted ? 'Completada' : 'Marcar como completada'}
                </button>

                <button
                  type="button"
                  onClick={handleNextLesson}
                  disabled={currentIndex === allLessons.length - 1}
                  aria-label="Lección siguiente"
                  className={cn(
                    'btn min-h-11 max-sm:size-11 max-sm:p-0',
                    isCompleted ? 'btn-primary' : 'btn-secondary',
                  )}
                >
                  <span className="max-sm:sr-only">Siguiente</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                <label className="flex min-h-11 cursor-pointer select-none items-center gap-2 text-sm text-dark/75">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="size-5 shrink-0 accent-iris"
                  />
                  Autoplay
                </label>
                <div className="flex items-center gap-2">
                  <label htmlFor="playback-speed" className="text-sm text-dark/75">Velocidad</label>
                  <div className="w-28">
                    <select
                      id="playback-speed"
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(e.target.value)}
                      className="field min-h-11 py-2"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickNote(true)}
                  aria-haspopup="dialog"
                  className="btn btn-ghost btn-sm min-h-11"
                >
                  <Pencil className="size-4" aria-hidden="true" /> Tomar nota rápida
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <Dialog
        open={showCertificate}
        onClose={() => setShowCertificate(false)}
        labelledBy="certificate-title"
        className="max-w-lg"
      >
        <div className="card relative overflow-hidden text-center">
          <button
            type="button"
            onClick={() => setShowCertificate(false)}
            aria-label="Cerrar"
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white/80 text-dark/70 transition-colors hover:bg-white hover:text-dark"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <div className="relative bg-ribbon px-6 pb-14 pt-10">
            <div aria-hidden="true" className="absolute inset-0 bg-stars opacity-50" />
            <span className="relative mx-auto grid size-20 place-items-center rounded-full bg-white text-iris shadow-soft">
              <Award className="size-10" aria-hidden="true" />
            </span>
          </div>
          <div className="px-6 pb-8 pt-8 sm:px-10">
            <h2 id="certificate-title" className="font-display text-3xl font-bold tracking-tight text-dark">
              ¡Felicitaciones!
            </h2>
            <p className="mt-3 text-dark/75">
              Completaste el curso <strong className="font-semibold text-dark">{course.title}</strong>. Tu
              certificado está disponible.
            </p>
            <button
              type="button"
              data-autofocus
              onClick={() => toast.info('Descarga de certificado próximamente')}
              className="btn btn-primary btn-lg mt-6"
            >
              Descargar certificado
            </button>
          </div>
        </div>
      </Dialog>

      {/* Quick Note Modal */}
      <Dialog
        open={showQuickNote}
        onClose={() => setShowQuickNote(false)}
        labelledBy="quick-note-title"
      >
        <div className="card p-6 sm:p-8">
          <h2 id="quick-note-title" className="font-display text-xl font-semibold text-dark">
            Nota rápida
          </h2>
          <label htmlFor="quick-note" className="sr-only">Tu nota</label>
          <textarea
            id="quick-note"
            data-autofocus
            value={quickNoteContent}
            onChange={(e) => setQuickNoteContent(e.target.value)}
            placeholder="Escribí tu nota..."
            rows={5}
            className="field mt-4 resize-y"
          />
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowQuickNote(false)}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                if (quickNoteContent.trim()) {
                  handleAddNote(quickNoteContent);
                  setQuickNoteContent('');
                  setShowQuickNote(false);
                }
              }}
              disabled={!quickNoteContent.trim()}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

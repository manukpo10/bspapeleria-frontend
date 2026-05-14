import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, FileText, HelpCircle, FileDown, Check, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, BookOpen, Award, X, Clock, Download, MessageCircle,
  ThumbsUp, Edit, Trash, MonitorPlay, Plus, Star
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import type { Course, Lesson, Topic, QAItem } from '../types';
import { courses } from '../data/mocks';
import { toast } from 'sonner';

/* ─── helpers ─── */

function LessonIcon({ type }: { type: Lesson['type'] }) {
  switch (type) {
    case 'video': return <Play className="w-4 h-4" />;
    case 'text': return <FileText className="w-4 h-4" />;
    case 'quiz': return <HelpCircle className="w-4 h-4" />;
    case 'assignment': return <FileDown className="w-4 h-4" />;
    case 'file': return <FileDown className="w-4 h-4" />;
    default: return <Play className="w-4 h-4" />;
  }
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
    <div className="border-b border-sand/30 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-sand/20 transition-colors"
      >
        <span className="text-sm font-medium text-dark text-left">{topic.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-dark/50 whitespace-nowrap">
            {completedCount} de {totalCount} completadas
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-dark/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-dark/40" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-sand/20">
              {topic.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isDone = enrollment?.completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                      isActive
                        ? 'bg-primary/5 border-l-[3px] border-primary'
                        : 'hover:bg-sand/10 border-l-[3px] border-transparent'
                    }`}
                  >
                    <span
                      className={`p-1.5 rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-sand/40 text-dark/40'
                      }`}
                    >
                      <LessonIcon type={lesson.type} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs truncate ${
                          isActive ? 'text-primary font-medium' : 'text-dark/70'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-dark/40 mt-0.5">
                        {lesson.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {lesson.isPreview && (
                        <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-medium">
                          🔓 Preview
                        </span>
                      )}
                      {isDone && (
                        <Check className="w-3.5 h-3.5 text-success" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      <div className="p-4 border-b border-sand/50">
        <div className="flex items-start gap-3 mb-3">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-[50px] h-[50px] rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-dark text-sm leading-tight">
              {course.title}
            </h3>
            <p className="text-xs text-dark/60 mt-0.5">
              {course.instructor.name}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-dark/60 mb-1.5">
            <span>Tu progreso</span>
            <span className="font-medium text-dark">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-sand/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
        <Link
          to={`/cursos/${course.slug}`}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-secondary font-medium transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> Volver al curso
        </Link>
      </div>
      <div className="divide-y divide-sand/30">
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
      </div>
    </>
  );
}

/* ─── main page ─── */

export default function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const { enrollments, updateEnrollment } = useEnrollmentStore();

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
  const [qaList, setQaList] = useState<QAItem[]>([]);

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
    const c = courses.find((co) => co.slug === slug);
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
      api.getQAs(c.id).then((data) => setQaList(data)).catch(() => setQaList([]));
    }
  }, [slug, enrollments]);

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
    } catch (err: any) {
      toast.error(err.message);
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
    } catch (err: any) {
      toast.error(err.message);
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
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!course || !currentLesson) {
    return <div className="p-8 text-center">Cargando aula...</div>;
  }

  const isCompleted = enrollment?.completedLessons.includes(currentLesson.id) ?? false;
  const embedUrl = currentLesson.videoUrl?.includes('/embed/')
    ? currentLesson.videoUrl
    : currentLesson.videoUrl?.replace('watch?v=', 'embed/');

  const displayQAs =
    qaList.length >= 3
      ? qaList.slice(0, 3)
      : [...qaList, ...FALLBACK_QAS].slice(0, 3);

  return (
    <>
      <SEO title={`Aula - ${course.title}`} />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden lg:flex border-r border-sand/50 bg-white overflow-y-auto shrink-0 flex-col"
            >
              <SidebarContent
                course={course}
                enrollment={enrollment}
                currentLessonId={currentLesson.id}
                onSelectLesson={(l) => {
                  setCurrentLesson(l);
                  setQuizSubmitted(false);
                  setQuizResult(null);
                  setQuizAnswers({});
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-[320px] bg-white overflow-y-auto lg:hidden shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-sand/50 flex items-center justify-between">
                  <span className="font-display font-semibold text-sm text-dark">Temario</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-dark/40 hover:text-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SidebarContent
                  course={course}
                  enrollment={enrollment}
                  currentLessonId={currentLesson.id}
                  onSelectLesson={(l) => {
                    setCurrentLesson(l);
                    setQuizSubmitted(false);
                    setQuizResult(null);
                    setQuizAnswers({});
                  }}
                  onClose={() => setMobileSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Floating desktop reopen button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed left-4 bottom-4 z-10 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-secondary transition-colors"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-cream/20">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-20 bg-cream/20 backdrop-blur-sm px-4 py-3 border-b border-sand/30">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white border border-sand px-4 py-2 text-sm font-medium text-dark shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-primary" /> 📋 Temario
            </button>
          </div>

          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-dark/50"
              >
                <span className="capitalize">{course.title}</span>
                <ChevronRight className="w-3 h-3" />
                <span>
                  Lección {currentIndex + 1} de {allLessons.length}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-xl lg:text-2xl font-semibold text-dark"
              >
                {currentLesson.title}
              </motion.h1>

              {/* Lesson Player */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] overflow-hidden"
              >
                {currentLesson.type === 'video' && embedUrl && (
                  <div className="aspect-video bg-dark">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                )}
                {currentLesson.type === 'text' && currentLesson.content && (
                  <div
                    className="p-6 prose prose-sm max-w-none text-dark/70"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />
                )}
                {currentLesson.type === 'quiz' && currentLesson.quiz && (
                  <div className="p-6">
                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {currentLesson.quiz.questions.map((q, i) => (
                          <div key={q.id} className="rounded-xl bg-sand/20 p-4">
                            <p className="font-medium text-dark mb-3">
                              {i + 1}. {q.question}
                            </p>
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="space-y-2">
                                {q.options.map((opt) => (
                                  <label
                                    key={opt}
                                    className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark"
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
                                      className="text-primary focus:ring-primary"
                                    />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            )}
                            {q.type === 'true-false' && (
                              <div className="flex gap-4">
                                {['true', 'false'].map((opt) => (
                                  <label
                                    key={opt}
                                    className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer"
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
                                      className="text-primary focus:ring-primary"
                                    />
                                    {opt === 'true' ? 'Verdadero' : 'Falso'}
                                  </label>
                                ))}
                              </div>
                            )}
                            {q.type === 'short-answer' && (
                              <input
                                type="text"
                                placeholder="Tu respuesta"
                                onChange={(e) =>
                                  setQuizAnswers({
                                    ...quizAnswers,
                                    [q.id]: e.target.value,
                                  })
                                }
                                className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            )}
                          </div>
                        ))}
                        <button
                          onClick={handleQuizSubmit}
                          className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors"
                        >
                          Enviar respuestas
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            quizResult?.passed
                              ? 'bg-success/10'
                              : 'bg-error/10'
                          }`}
                        >
                          {quizResult?.passed ? (
                            <Check className="w-8 h-8 text-success" />
                          ) : (
                            <X className="w-8 h-8 text-error" />
                          )}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-dark mb-2">
                          {quizResult?.passed ? '¡Aprobaste!' : 'No aprobaste'}
                        </h3>
                        <p className="text-dark/60 mb-4">
                          Puntaje: {quizResult?.score} puntos
                        </p>
                        {!quizResult?.passed && (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                            }}
                            className="rounded-2xl border border-sand px-6 py-2.5 text-sm font-medium text-dark hover:bg-sand/30 transition-colors"
                          >
                            Reintentar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {currentLesson.type === 'assignment' && currentLesson.assignment && (
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-dark mb-2">
                      {currentLesson.assignment.title}
                    </h3>
                    <p className="text-dark/70 mb-4">
                      {currentLesson.assignment.description}
                    </p>
                    <div className="rounded-xl border-2 border-dashed border-sand p-8 text-center">
                      <FileDown className="w-8 h-8 text-dark/30 mx-auto mb-2" />
                      <p className="text-sm text-dark/60">
                        Arrastrá tu archivo aquí o hacé clic para subir
                      </p>
                      <input type="file" className="hidden" />
                    </div>
                  </div>
                )}
                {currentLesson.type === 'file' && currentLesson.files && (
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-dark mb-4">
                      Recursos descargables
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.files.map((file) => (
                        <a
                          key={file.name}
                          href={file.url}
                          className="flex items-center gap-3 rounded-xl bg-sand/20 p-3 hover:bg-sand/40 transition-colors"
                        >
                          <FileDown className="w-5 h-5 text-primary" />
                          <span className="text-sm text-dark">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Instructor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-4 lg:p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-[60px] h-[60px] rounded-full object-cover border-2 border-sand shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark">
                      {course.instructor.name} · Instructora de Sublimación
                    </p>
                    <p className="text-xs text-dark/60 mt-0.5">
                      Más de 8 años enseñando técnicas creativas
                    </p>
                  </div>
                  <button
                    onClick={() => toast.info('Perfil del instructor próximamente')}
                    className="hidden sm:flex items-center rounded-xl border border-sand px-3 py-1.5 text-xs font-medium text-dark hover:bg-sand/30 transition-colors shrink-0"
                  >
                    Ver perfil
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-dark/60">
                  <span className="flex items-center gap-1">
                    <MonitorPlay className="w-3.5 h-3.5" /> Video ·{' '}
                    {currentLesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileDown className="w-3.5 h-3.5" />{' '}
                    {currentLesson.files?.length ?? 3} recursos
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" /> 12 preguntas Q&A
                  </span>
                  <span className="flex items-center gap-1">
                    <Edit className="w-3.5 h-3.5" /> Tomá notas
                  </span>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex gap-1 border-b border-sand/50 overflow-x-auto">
                  {TAB_LIST.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.key
                          ? 'text-primary'
                          : 'text-dark/60 hover:text-dark'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="learn-tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    {activeTab === 'summary' && (
                      <div className="space-y-6">
                        <div className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5 lg:p-6">
                          <h3 className="font-display font-semibold text-dark mb-3">
                            Sobre esta lección
                          </h3>
                          <p className="text-sm text-dark/70 leading-relaxed">
                            {currentLesson.type === 'video'
                              ? 'En esta lección vamos a profundizar en los conceptos fundamentales a través de un video explicativo paso a paso. Preparate para tomar notas y pausar cuando sea necesario.'
                              : currentLesson.type === 'text'
                              ? 'Esta lección teórica cubre los conceptos esenciales que necesitás dominar antes de pasar a la práctica. Asegurate de leer atentamente y consultar los recursos adjuntos.'
                              : currentLesson.type === 'quiz'
                              ? 'Es momento de poner a prueba tus conocimientos. Respondé las preguntas con atención y recordá que podés reintentar si no apruebas en el primer intento.'
                              : 'En esta lección aplicarás todo lo aprendido en un proyecto práctico. Seguí las instrucciones cuidadosamente y no dudes en consultar el foro de preguntas.'}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5 lg:p-6">
                          <h3 className="font-display font-semibold text-dark mb-3">
                            Qué vas a aprender
                          </h3>
                          <ul className="space-y-2">
                            {course.whatYouWillLearn
                              .slice(0, 5)
                              .map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-dark/70"
                                >
                                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5 lg:p-6">
                          <h3 className="font-display font-semibold text-dark mb-3">
                            Antes de empezar
                          </h3>
                          <ul className="space-y-2">
                            {course.requirements.map((req, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-dark/70"
                              >
                                <Star className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === 'resources' && (
                      <div className="space-y-3">
                        {(currentLesson.files && currentLesson.files.length > 0
                          ? currentLesson.files.map((f) => ({
                              name: f.name,
                              size: 'Descargable',
                            }))
                          : MOCK_RESOURCES
                        ).map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-4"
                          >
                            <div className="p-2.5 rounded-xl bg-sand/30 text-primary">
                              <FileDown className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-dark/50">
                                {file.size}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                toast.info('Descarga próximamente')
                              }
                              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-secondary transition-colors shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" /> Descargar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'qa' && (
                      <div className="space-y-4">
                        {displayQAs.map((qa) => (
                          <div
                            key={qa.id}
                            className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {qa.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-dark">
                                    {qa.userName}
                                  </p>
                                  <span className="text-[10px] text-dark/40 shrink-0">
                                    {new Date(qa.createdAt).toLocaleDateString(
                                      'es-AR'
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm text-dark/80 mt-1">
                                  {qa.question}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <button className="flex items-center gap-1 text-xs text-dark/50 hover:text-primary transition-colors">
                                    <ThumbsUp className="w-3.5 h-3.5" /> 3
                                  </button>
                                  <button className="text-xs text-dark/50 hover:text-primary transition-colors">
                                    Responder
                                  </button>
                                </div>
                              </div>
                            </div>
                            {qa.answers.map((ans, ai) => (
                              <div
                                key={ai}
                                className="mt-4 ml-12 flex items-start gap-3"
                              >
                                <img
                                  src={course.instructor.avatar}
                                  alt={ans.userName}
                                  className="w-8 h-8 rounded-full object-cover border border-sand shrink-0"
                                />
                                <div className="flex-1 rounded-xl bg-sand/20 p-3">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-medium text-dark">
                                      {ans.userName}
                                    </span>
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                      Instructora
                                    </span>
                                    <span className="text-[10px] text-dark/40">
                                      {new Date(
                                        ans.createdAt
                                      ).toLocaleDateString('es-AR')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-dark/70">
                                    {ans.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            toast.info('Hacer una pregunta próximamente')
                          }
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white px-5 py-3 text-sm font-medium text-dark hover:bg-sand/20 transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Hacer una pregunta
                        </button>
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5">
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Escribí una nota sobre esta lección..."
                            rows={4}
                            className="w-full rounded-xl border border-sand bg-cream/20 px-4 py-3 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                          <div className="flex justify-end mt-3">
                            <button
                              onClick={() => handleAddNote()}
                              disabled={!noteContent.trim()}
                              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Guardar nota con timestamp
                            </button>
                          </div>
                        </div>
                        {notesList.map((note) => (
                          <motion.div
                            key={note.id}
                            layout
                            className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  <Clock className="w-3 h-3" />{' '}
                                  {note.timestamp}
                                </span>
                                <p className="text-sm text-dark/80 mt-2">
                                  {note.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() =>
                                    toast.info('Editar nota próximamente')
                                  }
                                  className="p-1.5 rounded-lg hover:bg-sand/30 text-dark/40 hover:text-dark transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setNotesList((prev) =>
                                      prev.filter((n) => n.id !== note.id)
                                    )
                                  }
                                  className="p-1.5 rounded-lg hover:bg-error/10 text-dark/40 hover:text-error transition-colors"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'announcements' && (
                      <div className="space-y-4">
                        {MOCK_ANNOUNCEMENTS.map((ann) => (
                          <div
                            key={ann.id}
                            className="rounded-2xl bg-white border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.08)] p-5"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {ann.date}
                              </span>
                            </div>
                            <h3 className="font-display font-semibold text-dark mb-2">
                              {ann.title}
                            </h3>
                            <p className="text-sm text-dark/70 leading-relaxed">
                              {ann.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-sand/50 p-4 bg-white">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={handlePrevLesson}
                disabled={currentIndex === 0}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-dark hover:bg-sand/30 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleCompleteLesson}
                  disabled={isCompleted}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-success/10 text-success cursor-default'
                      : 'bg-primary text-white hover:bg-secondary'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {isCompleted ? '✓ Completada' : 'Marcar como completada'}
                </button>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-dark/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="rounded border-sand text-primary focus:ring-primary"
                    />
                    Autoplay
                  </label>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(e.target.value)}
                    className="rounded-xl border border-sand bg-white px-2 py-1.5 text-xs text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowQuickNote(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-sand px-3 py-2 text-xs font-medium text-dark hover:bg-sand/30 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Tomar nota rápida
                </button>
              </div>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-dark hover:bg-sand/30 disabled:opacity-30 transition-colors"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 lg:p-10 max-w-lg w-full text-center shadow-2xl border border-sand"
            >
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-success" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-dark mb-2">
                ¡Felicitaciones!
              </h2>
              <p className="text-dark/60 mb-6">
                Completaste el curso <strong>{course.title}</strong>. Tu
                certificado está disponible.
              </p>
              <button
                onClick={() => toast.info('Descarga de certificado próximamente')}
                className="rounded-2xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors"
              >
                Descargar certificado
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Note Modal */}
      <AnimatePresence>
        {showQuickNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQuickNote(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-sand shadow-[0_8px_30px_rgba(152,172,248,0.12)] p-6 w-full max-w-md"
            >
              <h3 className="font-display font-semibold text-dark mb-3">
                Nota rápida
              </h3>
              <textarea
                value={quickNoteContent}
                onChange={(e) => setQuickNoteContent(e.target.value)}
                placeholder="Escribí tu nota..."
                rows={5}
                className="w-full rounded-xl border border-sand bg-cream/20 px-4 py-3 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowQuickNote(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-dark hover:bg-sand/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (quickNoteContent.trim()) {
                      handleAddNote(quickNoteContent);
                      setQuickNoteContent('');
                      setShowQuickNote(false);
                    }
                  }}
                  disabled={!quickNoteContent.trim()}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

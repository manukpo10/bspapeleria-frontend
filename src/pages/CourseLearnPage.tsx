import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, FileText, HelpCircle, FileDown, Check, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, BookOpen, Award, X
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import type { Course, Lesson, Topic } from '../types';
import { courses } from '../data/mocks';
import { toast } from 'sonner';

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

export default function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const { enrollments, updateEnrollment } = useEnrollmentStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'resources' | 'qa' | 'notes' | 'announcements'>('summary');
  const [noteContent, setNoteContent] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  const enrollment = enrollments.find((e) => e.courseId === course?.id);
  const allLessons = course?.topics.flatMap((t) => t.lessons) ?? [];
  const currentIndex = currentLesson ? allLessons.findIndex((l) => l.id === currentLesson.id) : -1;

  useEffect(() => {
    if (!slug) return;
    const c = courses.find((c) => c.slug === slug);
    if (c) {
      setCourse(c);
      // Set current lesson from enrollment or first lesson
      const existing = enrollments.find((e) => e.courseId === c.id);
      if (existing?.currentLessonId) {
        const lesson = c.topics.flatMap((t) => t.lessons).find((l) => l.id === existing.currentLessonId);
        if (lesson) setCurrentLesson(lesson);
      } else {
        setCurrentLesson(c.topics[0]?.lessons[0] ?? null);
      }
    }
  }, [slug, enrollments]);

  const handleCompleteLesson = async () => {
    if (!course || !currentLesson || !user) return;
    const isCompleted = enrollment?.completedLessons.includes(currentLesson.id);
    try {
      const updated = await api.updateLessonProgress(course.id, user.id, currentLesson.id, !isCompleted);
      updateEnrollment(course.id, updated);
      if (!isCompleted) {
        toast.success('¡Lección completada!');
        if (updated.progress >= 100) {
          setShowCertificate(true);
          toast.success('¡Felicitaciones! Completaste el curso');
        }
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
      const result = await api.submitQuiz(course.id, user.id, currentLesson.quiz.id, quizAnswers);
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

  const handleAddNote = async () => {
    if (!course || !currentLesson || !user || !noteContent.trim()) return;
    try {
      await api.addNote(course.id, user.id, currentLesson.id, noteContent, 0);
      toast.success('Nota guardada');
      setNoteContent('');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!course || !currentLesson) {
    return <div className="p-8 text-center">Cargando aula...</div>;
  }

  const progress = enrollment?.progress ?? 0;
  const isCompleted = enrollment?.completedLessons.includes(currentLesson.id) ?? false;

  return (
    <>
      <SEO title={`Aula - ${course.title}`} />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-sand/50 bg-white overflow-y-auto shrink-0"
            >
              <div className="p-4 border-b border-sand/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-dark text-sm">{course.title}</h3>
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-dark/60 mb-2">
                  <span>{Math.round(progress)}% completado</span>
                </div>
                <div className="h-1.5 rounded-full bg-sand/50 overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="divide-y divide-sand/30">
                {course.topics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    enrollment={enrollment}
                    currentLessonId={currentLesson.id}
                    onSelectLesson={setCurrentLesson}
                  />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed left-4 bottom-4 z-10 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-secondary transition-colors"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1 p-6 lg:p-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-xs text-dark/50 mb-4">
                <span className="capitalize">{course.title}</span>
                <ChevronRight className="w-3 h-3" />
                <span>Lección {currentIndex + 1} de {allLessons.length}</span>
              </div>

              <h1 className="font-display text-2xl font-semibold text-dark mb-6">{currentLesson.title}</h1>

              {/* Lesson Content */}
              <div className="rounded-2xl bg-white border border-sand/50 overflow-hidden mb-8">
                {currentLesson.type === 'video' && currentLesson.videoUrl && (
                  <div className="aspect-video bg-dark">
                    <iframe
                      src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                )}
                {currentLesson.type === 'text' && currentLesson.content && (
                  <div className="p-6 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                )}
                {currentLesson.type === 'quiz' && currentLesson.quiz && (
                  <div className="p-6">
                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {currentLesson.quiz.questions.map((q, i) => (
                          <div key={q.id} className="rounded-xl bg-sand/20 p-4">
                            <p className="font-medium text-dark mb-3">{i + 1}. {q.question}</p>
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="space-y-2">
                                {q.options.map((opt) => (
                                  <label key={opt} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark">
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={opt}
                                      onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
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
                                  <label key={opt} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={opt}
                                      onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
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
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
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
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${quizResult?.passed ? 'bg-success/10' : 'bg-error/10'}`}>
                          {quizResult?.passed ? <Check className="w-8 h-8 text-success" /> : <X className="w-8 h-8 text-error" />}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-dark mb-2">
                          {quizResult?.passed ? '¡Aprobaste!' : 'No aprobaste'}
                        </h3>
                        <p className="text-dark/60 mb-4">Puntaje: {quizResult?.score} puntos</p>
                        {!quizResult?.passed && (
                          <button
                            onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
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
                    <h3 className="font-display font-semibold text-dark mb-2">{currentLesson.assignment.title}</h3>
                    <p className="text-dark/70 mb-4">{currentLesson.assignment.description}</p>
                    <div className="rounded-xl border-2 border-dashed border-sand p-8 text-center">
                      <FileDown className="w-8 h-8 text-dark/30 mx-auto mb-2" />
                      <p className="text-sm text-dark/60">Arrastrá tu archivo aquí o hacé clic para subir</p>
                      <input type="file" className="hidden" />
                    </div>
                  </div>
                )}
                {currentLesson.type === 'file' && currentLesson.files && (
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-dark mb-4">Recursos descargables</h3>
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
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex gap-4 border-b border-sand/50">
                  {(['summary', 'resources', 'qa', 'notes', 'announcements'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-dark/60 hover:text-dark'}`}
                    >
                      {tab === 'summary' ? 'Resumen' : tab === 'resources' ? 'Recursos' : tab === 'qa' ? 'Q&A' : tab === 'notes' ? 'Notas' : 'Anuncios'}
                      {activeTab === tab && <motion.div layoutId="learn-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {activeTab === 'summary' && (
                  <div className="text-dark/70 text-sm leading-relaxed">
                    <p>Esta lección forma parte del curso <strong>{course.title}</strong>. Asegurate de completar todos los recursos antes de continuar.</p>
                  </div>
                )}
                {activeTab === 'resources' && (
                  <div>
                    {currentLesson.files && currentLesson.files.length > 0 ? (
                      <div className="space-y-2">
                        {currentLesson.files.map((file) => (
                          <a key={file.name} href={file.url} className="flex items-center gap-3 rounded-xl bg-sand/20 p-3 hover:bg-sand/40 transition-colors">
                            <FileDown className="w-5 h-5 text-primary" />
                            <span className="text-sm text-dark">{file.name}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-dark/60 text-sm">No hay recursos adicionales para esta lección.</p>
                    )}
                  </div>
                )}
                {activeTab === 'qa' && (
                  <div className="text-dark/60 text-sm">
                    <p>Sección de preguntas y respuestas próximamente.</p>
                  </div>
                )}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Escribí una nota sobre esta lección..."
                      rows={4}
                      className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <button
                      onClick={handleAddNote}
                      className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
                    >
                      Guardar nota
                    </button>
                  </div>
                )}
                {activeTab === 'announcements' && (
                  <div className="text-dark/60 text-sm">
                    <p>No hay anuncios nuevos para este curso.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-sand/50 p-4 bg-white">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={handlePrevLesson}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-dark hover:bg-sand/30 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                onClick={handleCompleteLesson}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'bg-success/10 text-success'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                <Check className="w-4 h-4" />
                {isCompleted ? 'Completada' : 'Marcar como completada'}
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-dark hover:bg-sand/30 disabled:opacity-30 transition-colors"
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
              className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-success" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-dark mb-2">¡Felicitaciones!</h2>
              <p className="text-dark/60 mb-6">
                Completaste el curso <strong>{course.title}</strong>. Tu certificado está disponible.
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
    </>
  );
}

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
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-sand/20 transition-colors"
      >
        <span className="text-sm font-medium text-dark text-left">{topic.title}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-dark/40" /> : <ChevronDown className="w-4 h-4 text-dark/40" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="divide-y divide-sand/20">
              {topic.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isDone = enrollment?.completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                      isActive ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-sand/10 border-l-2 border-transparent'
                    }`}
                  >
                    <span className={`p-1 rounded ${isActive ? 'bg-primary/10 text-primary' : 'bg-sand/50 text-dark/40'}`}>
                      <LessonIcon type={lesson.type} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${isActive ? 'text-primary font-medium' : 'text-dark/70'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-dark/40">{lesson.duration}</p>
                    </div>
                    {isDone && <Check className="w-3 h-3 text-success" />}
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

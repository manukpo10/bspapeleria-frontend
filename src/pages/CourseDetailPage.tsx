import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, Users, Star, BookOpen, Check, ChevronDown, ChevronUp,
  Monitor, FileText, HelpCircle, FileDown, ShoppingCart, Award
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../lib/utils';
import type { Course, Lesson } from '../types';
import { courses, reviews as mockReviews } from '../data/mocks';
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

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCartStore();
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');
  const [playingPreview, setPlayingPreview] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getCourseBySlug(slug).then((c) => {
      setCourse(c ?? null);
      if (c?.topics[0]) setExpandedTopic(c.topics[0].id);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-sand/50 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-sand/50 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-sand/50 rounded w-full animate-pulse" />
          </div>
          <div className="h-80 bg-sand/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-2xl text-dark mb-4">Curso no encontrado</h1>
        <Link to="/cursos" className="text-primary hover:underline">Ver todos los cursos</Link>
      </div>
    );
  }

  const totalLessons = course.topics.reduce((sum, t) => sum + t.lessons.length, 0);

  return (
    <>
      <SEO title={course.title} description={course.shortDescription} image={course.coverImage} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="rounded-2xl overflow-hidden aspect-video bg-dark relative mb-8">
              {playingPreview && course.videoPreviewUrl ? (
                <iframe
                  src={course.videoPreviewUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Preview"
                />
              ) : (
                <>
                  <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover opacity-60" />
                  {course.videoPreviewUrl && (
                    <button
                      onClick={() => setPlayingPreview(true)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 text-dark ml-1" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark mb-4">
              {course.title}
            </h1>
            <p className="text-dark/70 mb-6 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-dark/60 mb-8">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrolledCount} estudiantes</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> {course.rating} ({course.reviewsCount} reseñas)</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-1"><Monitor className="w-4 h-4" /> {course.modality}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {totalLessons} lecciones</span>
            </div>

            {/* What you'll learn */}
            <div className="rounded-2xl bg-sand/20 border border-sand/50 p-6 mb-8">
              <h3 className="font-display text-xl font-semibold text-dark mb-4">Lo que vas a aprender</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-sm text-dark/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h3 className="font-display text-xl font-semibold text-dark mb-4">Requisitos previos</h3>
              <ul className="space-y-2">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Syllabus */}
            <div className="mb-8">
              <h3 className="font-display text-xl font-semibold text-dark mb-4">Temario del curso</h3>
              <div className="space-y-3">
                {course.topics.map((topic) => (
                  <div key={topic.id} className="rounded-2xl border border-sand/50 overflow-hidden">
                    <button
                      onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-sand/20 transition-colors text-left"
                    >
                      <div>
                        <span className="font-display font-medium text-dark">{topic.title}</span>
                        <p className="text-xs text-dark/50 mt-0.5">{topic.lessons.length} lecciones</p>
                      </div>
                      {expandedTopic === topic.id ? <ChevronUp className="w-5 h-5 text-dark/40" /> : <ChevronDown className="w-5 h-5 text-dark/40" />}
                    </button>
                    <AnimatePresence>
                      {expandedTopic === topic.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="divide-y divide-sand/30">
                            {topic.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center gap-3 p-4 bg-sand/10">
                                <span className={`p-1.5 rounded-lg ${lesson.isPreview ? 'bg-primary/10 text-primary' : 'bg-sand/50 text-dark/40'}`}>
                                  <LessonIcon type={lesson.type} />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-dark truncate">{lesson.title}</p>
                                  <p className="text-xs text-dark/50">{lesson.duration}</p>
                                </div>
                                {lesson.isPreview && (
                                  <span className="text-xs font-medium text-primary">Vista previa</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="rounded-2xl bg-white border border-sand/50 p-6 mb-8">
              <h3 className="font-display text-xl font-semibold text-dark mb-4">Sobre el instructor</h3>
              <div className="flex items-start gap-4">
                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-display font-medium text-dark">{course.instructor.name}</p>
                  <p className="text-sm text-dark/60 mb-2">{course.instructor.bio}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-dark/50">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.instructor.coursesCount} cursos</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.instructor.studentsCount} estudiantes</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {course.instructor.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews & Q&A Tabs */}
            <div className="mb-8">
              <div className="flex gap-6 border-b border-sand/50 mb-6">
                {(['reviews', 'qa'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-dark/60 hover:text-dark'}`}
                  >
                    {tab === 'reviews' ? 'Reseñas' : 'Q&A'}
                    {activeTab === tab && <motion.div layoutId="course-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                ))}
              </div>
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {mockReviews.slice(0, 4).map((review) => (
                      <div key={review.id} className="rounded-2xl bg-white border border-sand/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-medium text-dark">{review.userName}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-warning fill-warning' : 'text-dark/20'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-dark/70">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'qa' && (
                  <div className="text-sm text-dark/60">
                    <p>Sección de Q&A próximamente.</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Related courses */}
            <div>
              <h3 className="font-display text-xl font-semibold text-dark mb-4">Cursos relacionados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.filter((c) => c.id !== course.id).slice(0, 2).map((related) => (
                  <Link key={related.id} to={`/cursos/${related.slug}`} className="group rounded-2xl bg-white border border-sand/50 overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img src={related.coverImage} alt={related.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-display font-medium text-sm text-dark group-hover:text-primary transition-colors">{related.title}</h4>
                      <p className="text-primary font-semibold text-sm mt-1">{formatPrice(related.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Aside */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand/50 shadow-soft p-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-sand/20 mb-4 relative">
                <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                {course.videoPreviewUrl && (
                  <button
                    onClick={() => setPlayingPreview(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-dark ml-0.5" />
                    </div>
                  </button>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-semibold text-primary">{formatPrice(course.price)}</span>
                {course.comparePrice && (
                  <span className="text-lg text-dark/40 line-through">{formatPrice(course.comparePrice)}</span>
                )}
              </div>

              {isEnrolled ? (
                <Link
                  to={`/cursos/${course.slug}/aprender`}
                  className="block w-full text-center rounded-2xl bg-success py-3.5 text-sm font-semibold text-white hover:bg-success/90 transition-colors"
                >
                  Continuar aprendiendo
                </Link>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-4 h-4" /> Agregar al carrito
                  </button>
                  <button
                    onClick={() => { handleAddToCart(); window.location.href = '/checkout'; }}
                    className="w-full rounded-2xl bg-dark py-3.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
                  >
                    Inscribirme ahora
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-sand/50">
                <h4 className="font-display font-medium text-dark mb-3 text-sm">Este curso incluye:</h4>
                <ul className="space-y-2">
                  {course.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-dark/60">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {course.certificate && (
                <div className="mt-4 flex items-center gap-2 text-sm text-dark/60">
                  <Award className="w-4 h-4 text-primary" />
                  Certificado de finalización
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

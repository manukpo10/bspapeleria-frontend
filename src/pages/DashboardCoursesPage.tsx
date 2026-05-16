import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Award, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { Course, Enrollment } from '../types';

export default function DashboardCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Map<string, Course>>(new Map());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'in-progress' | 'completed' | 'all'>('all');

  useEffect(() => {
    api.getMyProgresos().then((data) => {
      setEnrollments(data.map((p: any) => ({
        id: String(p.id),
        courseId: String(p.cursoId),
        enrolledAt: p.fechaInscripcion,
        lastAccessedAt: p.ultimaActividad,
        completedLessons: p.leccionesCompletadas || [],
        currentLessonId: p.leccionActualId ? String(p.leccionActualId) : undefined,
        progress: p.porcentajeProgreso || 0,
        completedAt: p.fechaCompletado,
        certificateUnlocked: p.certificadoDesbloqueado || false,
      })));
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
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-dark">Mis Cursos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-sand/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-dark">Mis Cursos</h1>

      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'in-progress', label: 'En progreso' },
          { id: 'completed', label: 'Completados' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'bg-sand/30 text-dark/70 hover:bg-sand/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-sand/20 border border-sand/50">
          <BookOpen className="w-12 h-12 text-dark/20 mx-auto mb-3" />
          <p className="text-dark/60 mb-4">No tenés cursos en esta categoría.</p>
          <Link to="/cursos" className="text-primary hover:underline text-sm">Explorar cursos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((e, i) => {
            const c = courses.get(e.courseId);
            if (!c) return null;
            return (
              <motion.div
                key={e.courseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-sand/50 overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img src={c.coverImage || 'https://picsum.photos/seed/course/600/400'} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${e.progress}%` }} />
                    </div>
                    <p className="text-white text-xs mt-1">{e.progress}% completado</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-medium text-dark">{c.title}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <Link
                      to={`/cursos/${c.slug}/aprender`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2 text-sm font-medium text-white hover:bg-secondary transition-colors"
                    >
                      {e.progress >= 100 ? (
                        <><Award className="w-4 h-4" /> Ver certificado</>
                      ) : (
                        <><Play className="w-4 h-4" /> Continuar</>
                      )}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

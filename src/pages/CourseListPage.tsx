import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Clock, Users, Star, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';
import { COURSE_LEVELS, COURSE_MODALITIES } from '../lib/constants';
import type { Course, CourseLevel, CourseModality } from '../types';
import { toast } from 'sonner';

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'popularity', label: 'Más populares' },
];

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<CourseModality[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 9;

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCourses({
        search: search || undefined,
        levels: selectedLevels.length ? selectedLevels : undefined,
        modalities: selectedModalities.length ? selectedModalities : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy as any,
      });
      setCourses(data);
    } catch {
      toast.error('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  }, [search, selectedLevels, selectedModalities, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const debouncedSearch = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setSearch(val);
          setPage(1);
        }, 400);
      };
    })(),
    []
  );

  const toggleLevel = (level: CourseLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setPage(1);
  };

  const toggleModality = (mod: CourseModality) => {
    setSelectedModalities((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedLevels([]);
    setSelectedModalities([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
  };

  const hasFilters = search || selectedLevels.length || selectedModalities.length || minPrice || maxPrice || sortBy !== 'newest';

  const totalPages = Math.ceil(courses.length / perPage);
  const paginated = courses.slice((page - 1) * perPage, page * perPage);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-display font-medium text-dark mb-3">Buscar</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
          <input
            type="text"
            placeholder="¿Qué querés aprender?"
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <h4 className="font-display font-medium text-dark mb-3">Nivel</h4>
        <div className="space-y-2">
          {COURSE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors capitalize">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => toggleLevel(level)}
                className="rounded border-sand text-primary focus:ring-primary"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display font-medium text-dark mb-3">Modalidad</h4>
        <div className="space-y-2">
          {COURSE_MODALITIES.map((mod) => (
            <label key={mod} className="flex items-center gap-2 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors capitalize">
              <input
                type="checkbox"
                checked={selectedModalities.includes(mod)}
                onChange={() => toggleModality(mod)}
                className="rounded border-sand text-primary focus:ring-primary"
              />
              {mod}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display font-medium text-dark mb-3">Precio</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="text-dark/40">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-error hover:underline">
          <X className="w-4 h-4" /> Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <SEO title="Cursos" description="Aprendé con nuestros cursos de sublimación, lettering, diseño, impresión 3D y más." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark">Cursos</h1>
            <p className="text-dark/60 mt-1">{courses.length} resultados</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand/50 p-6 shadow-soft">
              <FiltersContent />
            </div>
          </aside>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold">Filtros</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
                  </div>
                  <FiltersContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-sand/50 overflow-hidden animate-pulse">
                    <div className="aspect-video bg-sand/50" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-sand/50 rounded w-3/4" />
                      <div className="h-4 bg-sand/50 rounded w-1/2" />
                      <div className="h-8 bg-sand/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-sand/50 flex items-center justify-center">
                  <Search className="w-8 h-8 text-dark/30" />
                </div>
                <h3 className="font-display text-xl font-medium text-dark mb-2">No encontramos cursos</h3>
                <p className="text-dark/60 mb-6">Probá con otros filtros o términos de búsqueda.</p>
                <button onClick={clearFilters} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-secondary transition-colors">
                  <X className="w-4 h-4" /> Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group"
                    >
                      <div className="rounded-2xl bg-white border border-sand/50 shadow-soft hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                        <Link to={`/cursos/${course.slug}`} className="block relative aspect-video overflow-hidden">
                          <img
                            src={course.coverImage}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <span className="rounded-full bg-white/90 text-dark text-xs font-bold px-3 py-1 capitalize">
                              {course.level}
                            </span>
                            <span className="flex items-center gap-1 text-white text-xs">
                              <Clock className="w-3 h-3" /> {course.duration}
                            </span>
                          </div>
                        </Link>
                        <div className="p-5">
                          <Link to={`/cursos/${course.slug}`}>
                            <h3 className="font-display font-medium text-dark group-hover:text-primary transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 mt-3 text-xs text-dark/60">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolledCount}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {course.rating}</span>
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.topics.length} módulos</span>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <span className="text-primary font-semibold text-lg">{formatPrice(course.price)}</span>
                            {course.comparePrice && (
                              <span className="text-dark/40 text-sm line-through">{formatPrice(course.comparePrice)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-full border border-sand hover:bg-sand/50 disabled:opacity-30 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'hover:bg-sand/50 text-dark/70'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-full border border-sand hover:bg-sand/50 disabled:opacity-30 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

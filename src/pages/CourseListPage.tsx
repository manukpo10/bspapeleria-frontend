import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Clock, Users, Star, BookOpen,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, GraduationCap
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { formatPrice, debounce } from '../lib/utils';
import { COURSE_LEVELS, COURSE_MODALITIES } from '../lib/constants';
import type { Course, CourseLevel, CourseModality } from '../types';


const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'popularity', label: 'Más populares' },
];

const levelConfig: Record<CourseLevel, { label: string; bg: string; text: string }> = {
  principiante: { label: 'Principiante', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  intermedio: { label: 'Intermedio', bg: 'bg-amber-100', text: 'text-amber-700' },
  avanzado: { label: 'Avanzado', bg: 'bg-rose-100', text: 'text-rose-700' },
};

const modalityConfig: Record<CourseModality, string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

/* ─── Dual Range Slider ─── */
function DualRangeSlider({
  min, max, value, onChange,
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawVal = Math.round(min + pct * (max - min));
      if (dragging === 'min') {
        onChange([Math.min(rawVal, value[1] - 1), value[1]]);
      } else {
        onChange([value[0], Math.max(rawVal, value[0] + 1)]);
      }
    };
    const handleUp = () => setDragging(null);
    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [dragging, min, max, onChange]);

  return (
    <div className="pt-2 pb-1">
      <div
        ref={trackRef}
        className="relative h-2 bg-sand rounded-full select-none"
        onMouseDown={(e) => {
          const rect = trackRef.current!.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
          setDragging(pct < mid ? 'min' : 'max');
        }}
        onTouchStart={(e) => {
          const rect = trackRef.current!.getBoundingClientRect();
          const pct = (e.touches[0].clientX - rect.left) / rect.width;
          const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
          setDragging(pct < mid ? 'min' : 'max');
        }}
      >
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing shadow-md z-10"
          style={{ left: `calc(${minPercent}% - 10px)` }}
          onMouseDown={(e) => { e.stopPropagation(); setDragging('min'); }}
          onTouchStart={(e) => { e.stopPropagation(); setDragging('min'); }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing shadow-md z-10"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
          onMouseDown={(e) => { e.stopPropagation(); setDragging('max'); }}
          onTouchStart={(e) => { e.stopPropagation(); setDragging('max'); }}
        />
      </div>
    </div>
  );
}

/* ─── Star Rating ─── */
function StarRating({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={`${filled ? 'text-warning fill-warning' : half ? 'text-warning fill-warning/50' : 'text-dark/15'}`}
            />
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-dark/50">{rating.toFixed(1)} ({count})</span>
      )}
    </div>
  );
}

/* ─── Course Card ─── */
function CourseCard({ course, index }: { course: Course; index: number }) {
  const isNew = useMemo(() => {
    const created = new Date(course.createdAt);
    return (Date.now() - created.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }, [course.createdAt]);

  const level = levelConfig[course.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <div className="relative rounded-2xl bg-white border border-sand/50 overflow-hidden shadow-[0_4px_20px_rgba(152,172,248,0.08)] hover:shadow-[0_16px_40px_rgba(152,172,248,0.2)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col">
        <Link to={`/cursos/${course.slug}`} className="block relative aspect-video overflow-hidden">
          <img
            src={course.coverImage} alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`rounded-lg ${level.bg} ${level.text} text-[11px] font-bold px-2.5 py-1 shadow-sm`}>
              {level.label}
            </span>
            {course.featured && (
              <span className="rounded-lg bg-primary text-white text-[11px] font-bold px-2.5 py-1 shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Destacado
              </span>
            )}
            {isNew && (
              <span className="rounded-lg bg-success text-white text-[11px] font-bold px-2.5 py-1 shadow-md">Nuevo</span>
            )}
          </div>
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-white text-xs drop-shadow-md">
              <Clock className="w-3 h-3" /> {course.duration}
            </span>
            <span className="flex items-center gap-1 text-white text-xs drop-shadow-md">
              <BookOpen className="w-3 h-3" /> {course.topics.length} módulos
            </span>
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-1">
          <Link to={`/cursos/${course.slug}`}>
            <h3 className="font-body font-bold text-dark group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
              {course.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-sand/50"
            />
            <span className="text-xs text-dark/60">{course.instructor.name}</span>
          </div>
          
          <div className="mt-2">
            <StarRating rating={course.rating} count={course.reviewsCount} />
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-dark/50">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolledCount} inscriptos</span>
            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {modalityConfig[course.modality]}</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{formatPrice(course.price)}</span>
              {course.comparePrice && (
                <span className="text-dark/40 text-sm line-through">{formatPrice(course.comparePrice)}</span>
              )}
            </div>
          </div>
          
          <Link
            to={`/cursos/${course.slug}`}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-secondary hover:shadow-glow transition-all duration-300 active:scale-[0.98]"
          >
            <GraduationCap className="w-4 h-4" /> Inscribirme
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-sand/50 overflow-hidden animate-pulse h-full flex flex-col">
      <div className="aspect-video bg-sand/50" />
      <div className="p-5 space-y-3 flex-1">
        <div className="h-4 bg-sand/50 rounded w-3/4" />
        <div className="h-3 bg-sand/50 rounded w-1/2" />
        <div className="h-3 bg-sand/50 rounded w-2/3" />
        <div className="h-6 bg-sand/50 rounded w-20" />
        <div className="h-9 bg-sand/50 rounded w-full mt-auto" />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 col-span-full"
    >
      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-sand/30 flex items-center justify-center">
        <GraduationCap className="w-10 h-10 text-dark/20" />
      </div>
      <h3 className="font-display text-xl font-medium text-dark mb-2">No encontramos cursos con esos filtros</h3>
      <p className="text-dark/60 mb-6 max-w-sm mx-auto">Probá ajustando los filtros o buscando con otros términos.</p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary transition-colors shadow-glow"
      >
        <X className="w-4 h-4" /> Limpiar filtros
      </button>
    </motion.div>
  );
}

/* ─── Breadcrumbs ─── */
function Breadcrumbs() {
  return (
    <nav className="flex items-center gap-2 text-sm text-dark/50 mb-3">
      <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
      <span className="text-accent">/</span>
      <span className="text-dark font-medium">Cursos</span>
    </nav>
  );
}

/* ════════════════════════════════════════ */
/* ═══════ MAIN PAGE ══════════════════════ */
/* ════════════════════════════════════════ */

export default function CourseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── State from URL ── */
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [urlSearch, setUrlSearch] = useState(searchParams.get('search') ?? '');
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>(
    searchParams.get('nivel')?.split(',').filter(Boolean) as CourseLevel[] ?? []
  );
  const [selectedModalities, setSelectedModalities] = useState<CourseModality[]>(
    searchParams.get('modalidad')?.split(',').filter(Boolean) as CourseModality[] ?? []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('precio_min') ?? 0),
    Number(searchParams.get('precio_max') ?? 999999),
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get('orden') ?? 'relevance');
  const [page, setPage] = useState(Number(searchParams.get('pagina') ?? 1));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const perPage = 9;

  /* ── Fetch all courses ── */
  useEffect(() => {
    let cancelled = false;
    api.getCourses().then(data => {
      if (!cancelled) {
        setAllCourses(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /* ── Catalog price bounds ── */
  const catalogMinPrice = useMemo(() => allCourses.length ? Math.min(...allCourses.map(c => c.price)) : 0, [allCourses]);
  const catalogMaxPrice = useMemo(() => allCourses.length ? Math.max(...allCourses.map(c => c.price)) : 999999, [allCourses]);

  useEffect(() => {
    if (allCourses.length && priceRange[1] === 999999) {
      setPriceRange([catalogMinPrice, catalogMaxPrice]);
    }
  }, [allCourses, catalogMinPrice, catalogMaxPrice]);

  /* ── Filtering ── */
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];
    if (urlSearch) {
      const q = urlSearch.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (selectedLevels.length) result = result.filter(c => selectedLevels.includes(c.level));
    if (selectedModalities.length) result = result.filter(c => selectedModalities.includes(c.modality));
    result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'popularity': result.sort((a, b) => b.enrolledCount - a.enrolledCount); break;
      default: break;
    }
    return result;
  }, [allCourses, urlSearch, selectedLevels, selectedModalities, priceRange, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / perPage));
  const paginated = filteredCourses.slice((page - 1) * perPage, page * perPage);

  /* ── Counts ── */
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCourses.forEach(c => { counts[c.level] = (counts[c.level] || 0) + 1; });
    return counts;
  }, [allCourses]);

  const modalityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCourses.forEach(c => { counts[c.modality] = (counts[c.modality] || 0) + 1; });
    return counts;
  }, [allCourses]);

  /* ── Active filter chips ── */
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (urlSearch) chips.push({ key: 'search', label: `Búsqueda: "${urlSearch}"`, onRemove: () => updateSearch('') });
    selectedLevels.forEach(l => {
      chips.push({ key: `level-${l}`, label: levelConfig[l].label, onRemove: () => toggleLevel(l) });
    });
    selectedModalities.forEach(m => {
      chips.push({ key: `mod-${m}`, label: modalityConfig[m], onRemove: () => toggleModality(m) });
    });
    if (priceRange[0] > catalogMinPrice || priceRange[1] < catalogMaxPrice) {
      chips.push({ key: 'price', label: `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`, onRemove: () => setPriceRange([catalogMinPrice, catalogMaxPrice]) });
    }
    return chips;
  }, [search, selectedLevels, selectedModalities, priceRange, catalogMinPrice, catalogMaxPrice]);

  const filterCount = activeChips.length + (sortBy !== 'relevance' ? 1 : 0);
  const hasFilters = filterCount > 0;

  /* ── URL sync ── */
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (urlSearch) params.set('search', urlSearch);
    if (selectedLevels.length) params.set('nivel', selectedLevels.join(','));
    if (selectedModalities.length) params.set('modalidad', selectedModalities.join(','));
    if (priceRange[0] > catalogMinPrice) params.set('precio_min', String(priceRange[0]));
    if (priceRange[1] < catalogMaxPrice) params.set('precio_max', String(priceRange[1]));
    if (sortBy !== 'relevance') params.set('orden', sortBy);
    if (page > 1) params.set('pagina', String(page));
    return params;
  }, [urlSearch, selectedLevels, selectedModalities, priceRange, sortBy, page, catalogMinPrice, catalogMaxPrice]);

  useEffect(() => {
    setSearchParams(buildParams());
  }, [buildParams, setSearchParams]);

  /* ── Debounced search ── */
  const updateSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUrlSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleLevel = (level: CourseLevel) => {
    setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
    setPage(1);
  };

  const toggleModality = (mod: CourseModality) => {
    setSelectedModalities(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedLevels([]);
    setSelectedModalities([]);
    setPriceRange([catalogMinPrice, catalogMaxPrice]);
    setSortBy('relevance');
    setPage(1);
  };

  const renderFilters = (onClose?: () => void) => (
    <div className="space-y-0">
      {/* Search */}
      <div className="pb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
          <input
            type="text"
            placeholder="Buscá lettering, sublimación, diseño..."
            value={search}
            onChange={(e) => { updateSearch(e.target.value); }}
            className="w-full rounded-xl border border-sand bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      {/* Levels */}
      <div className="border-t border-sand pt-5 mt-5">
        <h4 className="font-display font-semibold text-dark mb-3">Nivel</h4>
        <div className="space-y-2.5">
          {COURSE_LEVELS.map((level) => {
            const checked = selectedLevels.includes(level);
            const cfg = levelConfig[level];
            return (
              <label key={level} className="flex items-center gap-3 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors group">
                <button
                  onClick={() => toggleLevel(level)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    checked ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary/50'
                  }`}
                >
                  {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <span className="flex-1 capitalize">{cfg.label}</span>
                <span className="text-xs text-dark/40">({levelCounts[level] ?? 0})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Modalities */}
      <div className="border-t border-sand pt-5 mt-5">
        <h4 className="font-display font-semibold text-dark mb-3">Modalidad</h4>
        <div className="space-y-2.5">
          {COURSE_MODALITIES.map((mod) => {
            const checked = selectedModalities.includes(mod);
            return (
              <label key={mod} className="flex items-center gap-3 text-sm text-dark/70 cursor-pointer hover:text-dark transition-colors group">
                <button
                  onClick={() => toggleModality(mod)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    checked ? 'bg-primary border-primary' : 'border-sand group-hover:border-primary/50'
                  }`}
                >
                  {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <span className="flex-1">{modalityConfig[mod]}</span>
                <span className="text-xs text-dark/40">({modalityCounts[mod] ?? 0})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-sand pt-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-semibold text-dark">Precio</h4>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
        <DualRangeSlider
          min={catalogMinPrice} max={catalogMaxPrice} value={priceRange}
          onChange={(v) => { setPriceRange(v); setPage(1); }}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <div className="border-t border-sand pt-5 mt-5">
          <button
            onClick={() => { clearFilters(); onClose?.(); }}
            className="text-sm text-secondary hover:underline font-medium"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );

  const showingFrom = filteredCourses.length ? (page - 1) * perPage + 1 : 0;
  const showingTo = Math.min(page * perPage, filteredCourses.length);

  return (
    <>
      <SEO title="Cursos" description="Aprendé con nuestros cursos de sublimación, lettering, diseño, impresión 3D y más." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark">Cursos</h1>
            <p className="text-dark/60 mt-1 text-sm">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'resultado' : 'resultados'}
              {filteredCourses.length > 0 && ` — Mostrando ${showingFrom}-${showingTo}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-sand bg-white pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {activeChips.map(chip => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 hover:bg-primary/20 transition-colors"
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={clearFilters} className="text-xs text-secondary hover:underline font-medium px-1">
              Limpiar todo
            </button>
          </motion.div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-white border border-sand p-6 shadow-soft">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl font-semibold text-dark">Filtros</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-secondary hover:underline font-medium">
                    Limpiar todo
                  </button>
                )}
              </div>
              {renderFilters()}
            </div>
          </aside>

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl lg:hidden overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between p-5 border-b border-sand shrink-0">
                    <h3 className="font-display font-semibold text-lg">Filtros</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-sand/50">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto p-5">
                    {renderFilters(() => setMobileFiltersOpen(false))}
                  </div>
                  <div className="p-5 border-t border-sand shrink-0">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white hover:bg-secondary transition-colors"
                    >
                      Ver {filteredCourses.length} {filteredCourses.length === 1 ? 'resultado' : 'resultados'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="grid grid-cols-1">
                <EmptyState onClear={clearFilters} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((course, i) => (
                    <CourseCard key={course.id} course={course} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                    <p className="text-sm text-dark/50 order-2 sm:order-1">
                      Página {page} de {totalPages} — {filteredCourses.length} resultados
                    </p>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-sand hover:bg-sand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" /> Anterior
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const p = i + 1;
                          const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                          const showEllipsis = (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2);
                          if (showEllipsis) return <span key={p} className="w-8 h-8 flex items-center justify-center text-dark/30 text-sm">...</span>;
                          if (!show) return null;
                          return (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                                page === p ? 'bg-primary text-white shadow-glow' : 'hover:bg-sand/50 text-dark/70'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-sand hover:bg-sand/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter FAB */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-dark text-white px-5 py-3 shadow-lg hover:bg-dark/90 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filtros</span>
        {filterCount > 0 && (
          <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>
    </>
  );
}

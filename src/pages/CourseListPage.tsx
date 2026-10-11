import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronDown, GraduationCap, Check
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { CourseCard } from '../components/shared/CourseCard';
import { DualRangeSlider } from '../components/shared/DualRangeSlider';
import { api } from '../services/api';
import { cn, formatPrice } from '../lib/utils';
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

const levelLabels: Record<CourseLevel, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const modalityLabels: Record<CourseModality, string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

const sectionTitle = 'font-display text-sm font-semibold text-dark';
const sectionDivider = 'mt-5 border-t border-sand/60 pt-5';
const iconButton =
  'grid size-11 shrink-0 place-items-center rounded-full text-dark/75 transition-colors hover:bg-sand/40 hover:text-dark';
const pageButton = 'grid size-11 place-items-center rounded-full text-sm font-semibold transition-colors';
const skeletonBlock = 'animate-pulse rounded-full bg-sand/40';

/* Closes an overlay with the Escape key while it is open */
function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, onEscape]);
}

/* ─── Checkbox row ─── */
function CheckRow({
  checked, onChange, label, count,
}: {
  checked: boolean; onChange: () => void; label: string; count: number;
}) {
  return (
    <label className="-mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-dark/75 transition-colors hover:bg-mist hover:text-dark">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden="true"
        className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-secondary bg-white text-white transition-colors peer-checked:border-dark peer-checked:bg-dark peer-checked:[&>svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris"
      >
        <Check className="size-4 opacity-0 transition-opacity" strokeWidth={3} />
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-xs text-dark/65">({count})</span>
    </label>
  );
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-sand/40" />
      <div className="space-y-3 p-5">
        <div className={cn(skeletonBlock, 'h-5 w-11/12')} />
        <div className={cn(skeletonBlock, 'h-5 w-2/3')} />
        <div className={cn(skeletonBlock, 'h-4 w-1/2')} />
        <div className={cn(skeletonBlock, 'h-4 w-3/4')} />
        <div className={cn(skeletonBlock, 'h-6 w-2/5')} />
        <div className={cn(skeletonBlock, 'h-11 w-full')} />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
      <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
        <GraduationCap className="size-9" aria-hidden="true" />
      </span>
      <h3 className="mt-6 font-display text-xl font-semibold text-dark">No encontramos cursos con esos filtros</h3>
      <p className="mt-2 max-w-sm text-dark/75">Probá ajustando los filtros o buscando con otros términos.</p>
      <button type="button" onClick={onClear} className="btn btn-secondary mt-6">
        <X className="size-4" aria-hidden="true" /> Limpiar filtros
      </button>
    </div>
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
  // Where focus was before the sheet opened, so closing it puts the keyboard user back
  const lastFocusRef = useRef<HTMLElement | null>(null);

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
      chips.push({ key: `level-${l}`, label: levelLabels[l], onRemove: () => toggleLevel(l) });
    });
    selectedModalities.forEach(m => {
      chips.push({ key: `mod-${m}`, label: modalityLabels[m], onRemove: () => toggleModality(m) });
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

  /* ── Mobile sheet: remember and restore focus, close with Escape ── */
  const openMobileFilters = () => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setMobileFiltersOpen(true);
  };
  const closeMobileFilters = () => {
    setMobileFiltersOpen(false);
    lastFocusRef.current?.focus();
  };

  useEscapeKey(mobileFiltersOpen, closeMobileFilters);

  /* ── Filters (shared by the desktop sidebar and the mobile sheet) ── */
  const renderFilters = (idPrefix: string) => (
    <div>
      {/* Search */}
      <div>
        <label htmlFor={`${idPrefix}-search`} className={sectionTitle}>Buscar</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55" aria-hidden="true" />
          <input
            id={`${idPrefix}-search`}
            type="text"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscá lettering, sublimación, diseño..."
            value={search}
            onChange={(e) => { updateSearch(e.target.value); }}
            className="field pl-12"
          />
        </div>
      </div>

      {/* Levels */}
      <div className={sectionDivider}>
        <fieldset>
          <legend className={sectionTitle}>Nivel</legend>
          <div className="mt-2">
            {COURSE_LEVELS.map((level) => (
              <CheckRow
                key={level}
                checked={selectedLevels.includes(level)}
                onChange={() => toggleLevel(level)}
                label={levelLabels[level]}
                count={levelCounts[level] ?? 0}
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* Modalities */}
      <div className={sectionDivider}>
        <fieldset>
          <legend className={sectionTitle}>Modalidad</legend>
          <div className="mt-2">
            {COURSE_MODALITIES.map((mod) => (
              <CheckRow
                key={mod}
                checked={selectedModalities.includes(mod)}
                onChange={() => toggleModality(mod)}
                label={modalityLabels[mod]}
                count={modalityCounts[mod] ?? 0}
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* Price */}
      <div className={sectionDivider}>
        <h3 className={sectionTitle}>Precio</h3>
        <p className="mt-1 whitespace-nowrap text-xs font-medium text-dark/65">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </p>
        <div className="mt-2">
          <DualRangeSlider
            min={catalogMinPrice} max={catalogMaxPrice} value={priceRange}
            onChange={(v) => { setPriceRange(v); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );

  const showingFrom = filteredCourses.length ? (page - 1) * perPage + 1 : 0;
  const showingTo = Math.min(page * perPage, filteredCourses.length);

  return (
    <>
      <SEO title="Cursos" description="Aprendé con nuestros cursos de sublimación, lettering, diseño, impresión 3D y más." />
      <PageHeader
        title="Cursos"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Cursos' }]}
        description={
          <>
            {filteredCourses.length} {filteredCourses.length === 1 ? 'resultado' : 'resultados'}
            {filteredCourses.length > 0 && ` — Mostrando ${showingFrom}-${showingTo}`}
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside aria-labelledby="filters-heading" className="hidden w-80 shrink-0 lg:block">
            <div className="card sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain p-6">
              <div className="mb-5 flex min-h-11 items-center justify-between gap-3">
                <h2 id="filters-heading" className="font-display text-lg font-semibold text-dark">Filtros</h2>
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                    Limpiar filtros
                  </button>
                )}
              </div>
              {renderFilters('desktop')}
            </div>
          </aside>

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  key="filters-scrim"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-dark/45 backdrop-blur-sm lg:hidden"
                  onClick={closeMobileFilters}
                  aria-hidden="true"
                />
                <motion.div
                  key="filters-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="filters-sheet-title"
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[85dvh] flex-col rounded-t-3xl bg-white shadow-lift lg:hidden"
                >
                  <div className="flex items-center gap-2 border-b border-sand/60 py-3 pl-6 pr-4">
                    <h2 id="filters-sheet-title" className="mr-auto font-display text-xl font-semibold text-dark">Filtros</h2>
                    {hasFilters && (
                      <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                        Limpiar filtros
                      </button>
                    )}
                    <button
                      type="button"
                      autoFocus
                      onClick={closeMobileFilters}
                      className={iconButton}
                      aria-label="Cerrar filtros"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
                    {renderFilters('sheet')}
                  </div>
                  <div className="border-t border-sand/60 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                    <button type="button" onClick={closeMobileFilters} className="btn btn-primary btn-lg w-full">
                      Ver {filteredCourses.length} {filteredCourses.length === 1 ? 'resultado' : 'resultados'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={openMobileFilters}
                aria-haspopup="dialog"
                aria-expanded={mobileFiltersOpen}
                className="btn btn-secondary shrink-0 lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" /> Filtros
                {filterCount > 0 && (
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-dark px-1.5 text-xs font-bold text-white">
                    {filterCount}
                    <span className="sr-only"> activos</span>
                  </span>
                )}
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-end">
                {/* Sort */}
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <label htmlFor="course-sort" className="sr-only">Ordenar por</label>
                  <select
                    id="course-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="field cursor-pointer appearance-none pr-11 hover:border-secondary"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-dark/65" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div role="group" aria-label="Filtros aplicados" className="mb-6 flex animate-fade-in flex-wrap items-center gap-2">
                {activeChips.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Quitar filtro: ${chip.label}`}
                    className="btn btn-soft btn-sm min-h-11 max-w-full"
                  >
                    <span className="truncate">{chip.label}</span>
                    <X className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                ))}
                <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm min-h-11">
                  Limpiar filtros
                </button>
              </div>
            )}

            <h2 className="sr-only">Listado de cursos</h2>
            {loading ? (
              <div role="status">
                <span className="sr-only">Cargando cursos…</span>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((course) => (
                    <CourseCard key={course.id} course={course} detailed />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Paginación" className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="order-2 text-sm text-dark/65 sm:order-1">
                      Página {page} de {totalPages} — {filteredCourses.length} resultados
                    </p>
                    <div className="order-1 flex items-center gap-1.5 sm:order-2">
                      <button
                        type="button"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Página anterior"
                        className="btn btn-secondary size-11 p-0"
                      >
                        <ChevronLeft className="size-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                        const showEllipsis = (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2);
                        if (showEllipsis) {
                          return (
                            <span key={p} aria-hidden="true" className="grid size-11 place-items-center text-sm text-dark/65 max-sm:hidden">
                              ...
                            </span>
                          );
                        }
                        if (!show) return null;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            aria-label={`Ir a la página ${p}`}
                            aria-current={page === p ? 'page' : undefined}
                            className={cn(
                              pageButton,
                              page === p ? 'bg-dark text-white shadow-soft' : 'text-dark/75 hover:bg-sand/40 hover:text-dark max-sm:hidden',
                            )}
                          >
                            {p}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        aria-label="Página siguiente"
                        className="btn btn-secondary size-11 p-0"
                      >
                        <ChevronRight className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { Search, ChevronDown, MessageCircle, Mail, SearchX, X } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader } from '../components/shared/PageHeader';
import { faqs } from '../data/mocks';
import { cn } from '../lib/utils';
import { CONTACT_EMAIL, WHATSAPP_URL } from '../lib/constants';

const categories = [
  { id: 'all', name: 'Todas' },
  { id: 'envios', name: 'Envíos' },
  { id: 'pagos', name: 'Pagos' },
  { id: 'cursos', name: 'Cursos' },
  { id: 'devoluciones', name: 'Devoluciones' },
  { id: 'personalizados', name: 'Personalizados' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqs
    .filter((f) => (activeCategory === 'all' ? true : f.category === activeCategory))
    .filter((f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearch('');
  };

  return (
    <>
      <SEO title="Preguntas Frecuentes" />
      <PageHeader
        title="Preguntas Frecuentes"
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Preguntas frecuentes' }]}
        description={
          <>
            Respuestas a lo que más nos preguntan — {filtered.length} {filtered.length === 1 ? 'pregunta' : 'preguntas'}
          </>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <label htmlFor="faq-search" className="sr-only">Buscar preguntas</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55" aria-hidden="true" />
            <input
              id="faq-search"
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Buscar preguntas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field h-14 pl-12"
            />
          </div>
        </div>

        <div role="group" aria-label="Categorías" className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={active}
                className={cn(
                  'min-h-11 rounded-full px-5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-dark text-white shadow-soft'
                    : 'bg-white text-dark/75 ring-1 ring-sand hover:text-dark hover:ring-secondary',
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <h2 className="sr-only">Listado de preguntas</h2>
        {filtered.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {filtered.map((faq) => {
              const open = openId === faq.id;
              return (
                <li key={faq.id} className="card overflow-hidden">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${faq.id}`}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${faq.id}`}
                      onClick={() => setOpenId(open ? null : faq.id)}
                      className={cn(
                        'flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-mist sm:px-6',
                        open && 'bg-mist',
                      )}
                    >
                      <span className="font-display font-semibold leading-snug text-dark">{faq.question}</span>
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
                    id={`faq-panel-${faq.id}`}
                    hidden={!open}
                    className="animate-fade-in border-t border-sand/60 px-5 py-5 text-dark/75 sm:px-6"
                  >
                    {faq.answer}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
              <SearchX className="size-9" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold text-dark">No encontramos preguntas con esos filtros.</h3>
            <p className="mt-2 max-w-sm text-dark/75">Probá con otras palabras o elegí otra categoría.</p>
            <button type="button" onClick={clearFilters} className="btn btn-secondary mt-6">
              <X className="size-4" aria-hidden="true" /> Limpiar filtros
            </button>
          </div>
        )}

        {/* Contact */}
        <section aria-labelledby="faq-contact-heading" className="card mt-12 p-6 text-center sm:p-10">
          <h2 id="faq-contact-heading" className="font-display text-2xl font-bold tracking-tight text-dark">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-dark/75">
            Escribinos y te respondemos lo antes posible.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
              <Mail className="size-4" aria-hidden="true" /> Escribinos por email
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { faqs } from '../data/mocks';

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

  return (
    <>
      <SEO title="Preguntas Frecuentes" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <span className="block font-script text-2xl text-secondary mb-2">Ayuda</span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-dark">Preguntas Frecuentes</h1>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
          <input
            type="text"
            placeholder="Buscar preguntas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-sand bg-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-sand/30 text-dark/70 hover:bg-sand/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((faq) => (
            <div key={faq.id} className="rounded-2xl bg-white border border-sand/50 overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-sand/20 transition-colors"
              >
                <span className="font-medium text-dark text-sm">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-dark/40 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-dark/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark/60">No encontramos preguntas con esos filtros.</p>
          </div>
        )}
      </div>
    </>
  );
}

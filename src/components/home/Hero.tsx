import { Link } from 'react-router-dom';
import { ArrowRight, Send, Sparkles, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ribbon-soft">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="relative z-10 max-w-xl animate-slide-up">
          <span className="chip bg-white/70 py-1.5 pl-3 pr-4 shadow-soft ring-1 ring-white">
            <Sparkles className="size-4 text-iris" aria-hidden="true" />
            <span className="eyebrow">Papelería boutique</span>
          </span>

          <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.03] tracking-tight text-dark sm:text-6xl xl:text-7xl">
            Creá con estilo,
            <span className="mt-2 block font-script text-[1.15em] font-bold leading-none tracking-normal text-iris">
              aprendé con pasión
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-dark/70">
            Productos personalizados, sublimables y cursos creativos para quienes buscan algo más que lo ordinario.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/productos" className="btn btn-primary btn-lg w-full sm:w-auto">
              Ver productos <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link to="/cursos" className="btn btn-secondary btn-lg w-full sm:w-auto">
              Ver cursos
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-dark">4.9/5</span>
            </div>
            <span className="text-dark/70">Más de 2.500 clientes felices</span>
          </div>
        </div>

        {/* Collage: a ribbon band like the logo's, with the brand photos resting on it */}
        <div className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute left-[-6%] top-[27%] h-[44%] w-[135%] -rotate-8 overflow-hidden rounded-[3rem] bg-ribbon"
          >
            <div className="absolute inset-0 bg-stars opacity-60" />
          </div>

          <div className="absolute left-[4%] top-[7%] z-10 aspect-[4/3] w-[72%] -rotate-3 overflow-hidden rounded-[2rem] shadow-lift ring-8 ring-white">
            <img
              src="/images/home/hero-principal.webp"
              alt="Agenda lila con el logo de BS Papelería, una taza de té, lapiceras color cobre y un ramito de lavanda sobre un escritorio claro"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </div>

          <div className="absolute bottom-[5%] right-[3%] z-20 aspect-[4/5] w-[38%] rotate-6 overflow-hidden rounded-[1.75rem] shadow-lift ring-8 ring-white">
            <img
              src="/images/home/hero-secundaria.webp"
              alt="Cuaderno lila con el logo de BS Papelería dentro de una caja de regalo con cinta y lavanda"
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>

          <div className="absolute bottom-[26%] left-0 z-30 flex animate-float items-center gap-3 rounded-2xl bg-white py-3 pl-3 pr-5 shadow-lift ring-1 ring-sand/60">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist">
              <Send className="size-5 text-iris" aria-hidden="true" />
            </span>
            <p>
              <span className="block text-sm font-semibold text-dark">Hecho a mano</span>
              <span className="block text-xs text-dark/65">Personalizado para vos</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

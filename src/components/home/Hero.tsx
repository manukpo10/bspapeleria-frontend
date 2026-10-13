import { useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Sparkles, Star } from 'lucide-react';

// The same five-point star as the bg-stars pattern in index.css
const STAR = 'M0-10 2.9-3.9 9.5-3.1 4.6 1.5 5.9 8.1 0 4.8-5.9 8.1-4.6 1.5-9.5-3.1-2.9-3.9Z';

/*
 * The trail from the logo: the wake a paper plane leaves, wide where it started (bottom left) and thinning out
 * towards the plane (top right), in the ribbon colours and sprinkled with stars. Drawn on the logo's own
 * 1000 x 674 canvas so the proportions match.
 */
function PlaneTrail({ className }: { className?: string }) {
  // useId can contain characters that are awkward inside url(#...), so keep only the safe ones
  const id = `trail${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const trail = 'M0 272C240 165 520 72 835 26L862 56C640 105 420 235 250 345 140 420 50 540 0 674Z';

  return (
    <svg viewBox="0 0 1000 674" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#e9c5fb" />
          <stop offset="0.38" stopColor="#d0b8fb" />
          <stop offset="0.72" stopColor="#c1cdfb" />
          <stop offset="1" stopColor="#d8eafc" />
        </linearGradient>
        <pattern id={`${id}-stars`} width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="white" stroke="white" strokeWidth="2.5" strokeLinejoin="round">
            <path d={STAR} transform="translate(28 34) rotate(12)" />
            <path d={STAR} transform="translate(118 22) rotate(-8) scale(.7)" />
            <path d={STAR} transform="translate(186 70) rotate(20) scale(.9)" />
            <path d={STAR} transform="translate(76 96) rotate(-14) scale(.8)" />
            <path d={STAR} transform="translate(150 138) rotate(6)" />
            <path d={STAR} transform="translate(34 160) rotate(-20) scale(.75)" />
            <path d={STAR} transform="translate(100 192) rotate(14) scale(.65)" />
            <path d={STAR} transform="translate(200 196) rotate(-6) scale(.8)" />
          </g>
        </pattern>
        {/* In the logo the canvas edge cuts the far end of the trail; here it fades out instead, like a wake */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.24" stopColor="white" />
        </linearGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="674">
          <rect width="1000" height="674" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <g mask={`url(#${id}-mask)`}>
        <path d={trail} fill={`url(#${id}-ribbon)`} />
        <path d={trail} fill={`url(#${id}-stars)`} opacity="0.7" />
      </g>

      {/* The paper plane at the head of the trail, in the logo's violet */}
      <path d="M985 12 792 4 836 30Z" fill="#b79cf9" />
      <path d="M985 12 836 30 872 58Z" fill="#a584f3" />
      <path d="M836 30 829 56 853 44Z" fill="#8f6be8" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ribbon-soft">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="relative z-10 max-w-xl animate-slide-up">
          <span className="chip bg-white/70 py-1.5 pl-3 pr-4 shadow-soft ring-1 ring-white">
            <Sparkles className="size-4 text-iris" aria-hidden="true" />
            {/* Long label: tighter tracking than the usual eyebrow, and it only breaks at the bullets (two lines on phones) */}
            <span className="eyebrow tracking-[0.14em]">
              <span className="whitespace-nowrap">Cursos online •</span>{' '}
              <span className="whitespace-nowrap">Comunidad •</span>{' '}
              <span className="whitespace-nowrap">Emprendimiento</span>
            </span>
          </span>

          {/* The bold part is two lines (its longest word fills the phone width, hence the fluid size up to 40px) and the
              script part is up to two lines, so the sizes step down from the old one-liner to keep the hero height */}
          <h1 className="mt-6 font-display text-[length:clamp(1.75rem,9vw,2.5rem)] font-extrabold leading-[1.03] tracking-tight text-dark sm:text-5xl xl:text-[3.25rem]">
            Todo gran emprendimiento{' '}
            <span className="mt-2 block font-script text-[1.15em] font-bold leading-[1.1] tracking-normal text-iris">
              empieza con un primer paso.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-dark/70">
            Aprendé desde cero a crear productos personalizados, desarrollar tu creatividad y construir un emprendimiento con el acompañamiento de quienes también empezaron desde cero.
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

        {/* Collage: the logo's plane trail, with the brand photos resting on it */}
        <div className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg lg:max-w-none">
          {/* Tilted and lowered so its wide base shows under the main photo and the plane comes out on the right */}
          <PlaneTrail className="absolute left-[-12%] top-[40%] w-[128%] -rotate-14" />

          <div className="absolute left-[4%] top-[7%] z-10 aspect-[4/3] w-[72%] -rotate-3 overflow-hidden rounded-[2rem] shadow-lift ring-8 ring-white">
            <img
              src="/images/home/hero-principal.webp"
              alt="Agenda lila con el logo de BS Papelería sobre un podio, rodeada de una taza, cuadernos, una bolsa de tela, una caja de regalo y avioncitos de papel, sobre un fondo violeta"
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

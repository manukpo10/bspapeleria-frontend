import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Sparkles, Star } from 'lucide-react';
import { PlaneTrail } from '../shared/PlaneTrail';

const INTRO_KEY = 'bs-hero-intro';

// The plane flies in on the first visit to the home in a browser session; after that the hero opens finished
function usePlayIntroOnce() {
  const [play] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) === null;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      // Storage can be blocked (private mode): the intro simply plays again next time
    }
  }, []);

  return play;
}

export function Hero() {
  const playIntro = usePlayIntroOnce();

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
          <PlaneTrail animated={playIntro} className="absolute left-[-12%] top-[40%] w-[128%] -rotate-14" />

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

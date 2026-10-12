import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function StartCta() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* The photo is the panel's backdrop (bg-ribbon shows while it loads). Its left half is empty paper,
            which is where the copy sits from md up; the plane flies in on the right */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ribbon px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16 md:text-left">
          <img
            src="/images/home/avion-papel.webp"
            alt=""
            aria-hidden="true"
            width={1536}
            height={864}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-right-top"
          />
          {/* Below md the copy covers the plane, so the veil is strong there to keep the ink text above 4.5:1;
              from md it only softens the left side and leaves the plane untouched */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-white/85 via-white/75 to-white/60 md:bg-linear-to-r md:from-white/60 md:via-white/30 md:to-transparent"
          />

          <div className="relative mx-auto max-w-xl md:mx-0 md:max-w-xs lg:max-w-md">
            <p className="font-script text-2xl text-dark">Animate a empezar</p>
            {/* The title is longer than the old one, so it steps down at md where the copy column is only 20rem wide */}
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl md:text-3xl lg:text-4xl">
              Tus ideas merecen hacerse realidad
            </h2>
            <p className="mt-3 text-dark/75">
              No necesitás tener todo resuelto ni contar con las mejores herramientas. Con ganas de aprender y el acompañamiento adecuado, podés empezar a transformar tus ideas en proyectos reales.
            </p>

            {/* Default size on phones: the label with its arrow is too wide for btn-lg inside the panel padding */}
            <Link to="/cursos" className="btn btn-primary sm:btn-lg mt-8 w-full sm:w-auto">
              Encontrá tu curso ideal <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

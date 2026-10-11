import { RotateCw } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="bg-ribbon-soft">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-14 text-center sm:py-20">
        {/* The photo has empty paper on its left: the numerals sit there and the plane flies in on the right */}
        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-[2rem] bg-ribbon shadow-lift ring-1 ring-white/60">
          <img
            src="/images/home/avion-papel.webp"
            alt="Avión de papel violeta con estrellitas blancas sobre un fondo degradado de lila a celeste"
            width={1536}
            height={864}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          <p
            aria-hidden="true"
            className="absolute inset-y-0 left-0 flex w-3/5 items-center justify-center font-display text-7xl font-extrabold tracking-tight text-dark sm:text-8xl"
          >
            500
          </p>
        </div>

        <h1 className="mt-10 font-display text-4xl font-bold tracking-tight text-dark sm:text-5xl">
          <span className="sr-only">Error 500: </span>Algo salió mal
        </h1>
        <p className="mt-4 max-w-md text-base text-dark/75">
          Tuvimos un problema de nuestro lado. Probá de nuevo en unos instantes.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-primary btn-lg mt-8">
          <RotateCw className="size-5" aria-hidden="true" /> Reintentar
        </button>
      </div>
    </div>
  );
}

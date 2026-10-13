import { RotateCw } from 'lucide-react';
import { PlaneTrail } from '../components/shared/PlaneTrail';

export default function ErrorPage() {
  return (
    <div className="bg-ribbon-soft">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-14 text-center sm:py-20">
        {/* White card, since the trail only shows on a light surface. The numerals sit in the open sky under the plane */}
        <div className="card w-full max-w-lg rounded-[2rem] p-6 sm:p-8">
          <div className="relative">
            <PlaneTrail className="block w-full" />
            <p
              aria-hidden="true"
              className="absolute bottom-0 right-0 flex h-[55%] w-1/2 items-center justify-center font-display text-6xl font-extrabold tracking-tight text-dark sm:text-7xl"
            >
              500
            </p>
          </div>
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

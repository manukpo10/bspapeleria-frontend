import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PlaneTrail } from '../shared/PlaneTrail';

export function StartCta() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* White card: the trail only shows on a light surface. From md the drawing takes the right side, tilted like the
            hero's and cut by the bottom edge; below md it sits under the copy, in the space the bottom padding reserves */}
        <div className="card relative overflow-hidden rounded-[2.5rem] px-6 pb-44 pt-12 text-center sm:px-12 sm:pb-52 sm:pt-16 md:pb-16 md:text-left">
          <PlaneTrail
            animated="in-view"
            className="pointer-events-none absolute -bottom-4 right-3 w-60 sm:-bottom-6 sm:right-4 sm:w-72 md:-bottom-8 md:right-0 md:w-1/2 md:-rotate-14 lg:w-[55%]"
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

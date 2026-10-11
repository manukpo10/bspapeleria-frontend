import { Link } from 'react-router-dom';
import { Check, Package, BookOpen, ArrowRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';

export default function CheckoutSuccessPage() {
  return (
    <>
      <SEO title="Compra Exitosa" />
      <section className="relative isolate overflow-hidden bg-ribbon">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-stars opacity-60" />
        <div className="mx-auto flex min-h-[70dvh] max-w-7xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="card w-full max-w-lg animate-slide-up p-8 text-center sm:p-12">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-success/30 text-dark">
              <Check className="size-10" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <p className="mt-6 font-script text-2xl text-iris">¡Todo listo!</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              ¡Gracias por tu compra!
            </h1>
            <p className="mt-4 text-base text-dark/75">
              Tu orden fue procesada correctamente. Encontrarás todos los detalles en tu cuenta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/mi-cuenta/pedidos" className="btn btn-primary">
                <Package className="size-4" aria-hidden="true" /> Ver pedidos
              </Link>
              <Link to="/mi-cuenta/mis-cursos" className="btn btn-secondary">
                <BookOpen className="size-4" aria-hidden="true" /> Mis cursos
              </Link>
            </div>
            <Link to="/" className="btn btn-ghost mt-3">
              Volver al inicio <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

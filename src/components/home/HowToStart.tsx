import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, MonitorPlay, Search } from 'lucide-react';
import { WHATSAPP_URL } from '../../lib/constants';
import { SectionHeader } from './SectionHeader';

const steps = [
  {
    icon: Search,
    title: 'Elegí qué aprender',
    body: 'Encontrá el curso que conecte con tus ideas y con eso que soñás hacer.',
  },
  {
    icon: MonitorPlay,
    title: 'Aprendé a tu ritmo',
    body: 'Seguí las clases paso a paso y poné en práctica lo que vas aprendiendo.',
  },
  {
    icon: HeartHandshake,
    title: 'Avanzá acompañada',
    body: 'Consultá tus dudas y ganá confianza para llevar tus ideas a la realidad.',
  },
];

export function HowToStart() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Tu primer paso"
          title="Empezá hoy, a tu manera"
          subtitle="No necesitás saberlo todo para comenzar. Te damos las herramientas para aprender, crear y avanzar con confianza."
        />

        {/* role="list" keeps the list semantics that Safari drops once the markers are removed */}
        <ol role="list" className="grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="card relative p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-14 place-items-center rounded-full bg-ribbon font-display text-2xl font-bold text-dark"
                >
                  {i + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-mist text-iris">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark/75">{step.body}</p>

              {/* Dashed bridge across the column gap, level with the middle of the badge (2rem padding + 1.75rem) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-full top-15 hidden w-6 -translate-y-1/2 border-t-2 border-dashed border-secondary/60 md:block lg:w-8"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center">
          <Link to="/cursos" className="btn btn-primary btn-lg w-full sm:w-80">
            Ver todos los cursos <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <p className="mt-5 text-center text-dark/75">¿Tenés dudas? Estamos para ayudarte.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-medium text-iris underline decoration-iris/40 underline-offset-4 transition-colors hover:decoration-iris"
          >
            Consultar por WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

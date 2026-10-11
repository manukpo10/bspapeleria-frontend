import { Mail, MessageCircle, PackageCheck, Palette } from 'lucide-react';
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_URL } from '../../lib/constants';
import { SectionHeader } from './SectionHeader';

// Inside a paragraph the colour alone is not enough to tell a link apart, hence the underline
const textLink = 'font-medium text-iris underline decoration-iris/40 underline-offset-4 transition-colors hover:decoration-iris';

const steps = [
  {
    icon: MessageCircle,
    title: 'Escribinos',
    body: (
      <>
        Contactanos por{' '}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={textLink}>
          WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        , por <a href={`mailto:${CONTACT_EMAIL}`} className={textLink}>mail</a> o por mensaje directo en{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLink}>
          Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        .
      </>
    ),
  },
  {
    icon: Palette,
    title: 'Coordinamos los detalles',
    body: 'Elegís el interior que mejor se acomode a vos (anotador, cuaderno, agenda emprendedora, para tomar turnos y más) y personalizás todo a tu gusto: la cantidad de hojas, los colores del interior y las tapas.',
  },
  {
    icon: PackageCheck,
    title: 'Ponemos en marcha tu pedido',
    body: 'Con todos los detalles coordinados, demoramos aproximadamente una semana en realizarlo y entregarlo.',
  },
];

export function HowToOrder() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Paso a paso"
          title="¿Cómo hago mi pedido?"
          subtitle="Nuestros productos son 100% personalizados: los armamos con vos, a tu gusto."
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

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg w-full sm:w-auto">
            <MessageCircle className="size-5" aria-hidden="true" /> Escribinos por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-secondary btn-lg w-full sm:w-auto">
            <Mail className="size-5" aria-hidden="true" /> Mandanos un mail
          </a>
        </div>
      </div>
    </section>
  );
}

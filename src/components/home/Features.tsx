import { GraduationCap, Clock, MessagesSquare, Award, Heart } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const features = [
  {
    icon: GraduationCap,
    title: 'Aprendé desde cero',
    description: 'No necesitás experiencia previa. Te explicamos cada proceso de forma sencilla para que puedas aprender, incluso si nunca hiciste papelería.',
  },
  {
    icon: Clock,
    title: 'A tu ritmo y sin apuros',
    description: 'Accedé a las clases cuando quieras y volvé a verlas todas las veces que necesites. Tu aprendizaje se adapta a tus tiempos.',
  },
  {
    icon: MessagesSquare,
    title: 'Acompañamiento de verdad',
    description: 'No se trata solo de mirar videos. Estamos para responder tus dudas y ayudarte a encontrar soluciones cuando algo no sale como esperabas.',
  },
  {
    icon: Award,
    title: 'Experiencia real',
    description: 'Compartimos nuestra experiencia real para que no solo aprendas a crear productos, sino que también tengas herramientas para empezar a venderlos.',
  },
];

export function Features() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
        {/* Photo: a fixed 20rem tall crop on small screens, the full 4:5 portrait beside the copy from lg */}
        <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="relative h-80 overflow-hidden rounded-[2rem] bg-sand/40 shadow-lift lg:aspect-[4/5] lg:h-auto">
            <img
              src="/images/home/hecho-a-mano.webp"
              alt="Manos atando un moño de cinta lila sobre una libreta lavanda, junto a lapiceras color cobre y estrellitas de papel"
              width={1024}
              height={1280}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          {/* Sits outside the clipped frame so it can overlap the corner */}
          <div className="card absolute -bottom-5 right-4 flex items-center gap-3 py-3 pl-3 pr-5 lg:-right-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-iris">
              <Heart className="size-5" aria-hidden="true" />
            </span>
            <p>
              <span className="block text-sm font-semibold text-dark">Aprendé acompañada</span>
              <span className="block text-xs text-dark/65">Estamos para ayudarte a avanzar</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeader
            script="¿Por qué aprender con nosotros?"
            title="Mucho más que aprender una técnica"
            subtitle="Sabemos que empezar algo nuevo puede generar muchas dudas. Por eso creamos cursos prácticos, fáciles de seguir y con un acompañamiento real, para que puedas avanzar con confianza desde el primer día."
            startFromLg
          />

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {features.map((feature) => (
              // A row on phones (icon beside the text), the stacked card from sm
              <li key={feature.title} className="card flex items-start gap-4 p-5 sm:block sm:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ribbon text-dark">
                  <feature.icon className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-dark sm:mt-5">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-dark/65 sm:mt-2">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

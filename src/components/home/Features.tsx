import { Palette, Truck, Award, HeartHandshake, Heart } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const features = [
  {
    icon: Palette,
    title: 'Diseño Único',
    description: 'Cada producto es pensado con amor y diseñado para destacar. Nada de lo genérico.',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo el País',
    description: 'Llegamos a cada rincón de Argentina. Envío gratis en compras mayores a $15.000.',
  },
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Materiales de primera, impresión de alta definición y acabados impecables.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención Personalizada',
    description: 'Estamos para ayudarte en cada paso. Tu satisfacción es nuestra prioridad.',
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20">
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
              <span className="block text-sm font-semibold text-dark">Hecho con amor</span>
              <span className="block text-xs text-dark/65">Cada pedido, uno por uno</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeader
            script="¿Por qué elegirnos?"
            title="Hecho a mano, pensado para vos"
            subtitle="Cada detalle cuenta. Por eso nos enfocamos en ofrecerte la mejor experiencia de compra y aprendizaje."
            startFromLg
          />

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {features.map((feature) => (
              <li key={feature.title} className="card p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-ribbon text-dark">
                  <feature.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-dark">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/65">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

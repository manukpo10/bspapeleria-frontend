import { Palette, Truck, Award, HeartHandshake } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/shared/SEO';
import { Breadcrumbs } from '../components/shared/PageHeader';
import { VisitUsSection } from '../components/about/VisitUsSection';
import { SocialMediaSection } from '../components/about/SocialMediaSection';
import { InstagramFeedSection } from '../components/about/InstagramFeedSection';

const stories = [
  {
    eyebrow: 'Nuestra pasión',
    title: 'Cada pieza, pensada con amor',
    text: 'Cada pieza está pensada con amor y atención al detalle. Cuidamos los materiales, los acabados y preparamos cada pedido uno por uno, como si fuera para nosotras.',
    image: {
      src: '/images/home/hecho-a-mano.webp',
      width: 1024,
      height: 1280,
      alt: 'Manos atando un moño de cinta lila sobre una libreta lavanda, junto a lapiceras color cobre y estrellitas de papel',
      ratio: 'aspect-[4/5] max-w-md mx-auto lg:mx-0',
    },
  },
  {
    eyebrow: 'Nuestra tienda',
    title: 'Papelería que cuenta tu historia',
    text: 'Productos personalizados, sublimables y archivos digitales de alta calidad: agendas, cuadernos, tazas, tarjetas e invitaciones con tu nombre, tus colores y tu estilo.',
    image: {
      src: '/images/brand/agendas.webp',
      width: 1000,
      height: 713,
      alt: 'Dos agendas de tapa marrón personalizadas con nombre y el logo de BS Papelería, junto a lapiceras color cobre y stickers',
      ratio: 'aspect-[7/5]',
    },
  },
  {
    eyebrow: 'Nuestros cursos',
    title: 'Aprendé, creá y emprendé',
    text: 'Formación creativa para quienes quieren aprender y emprender. Nuestros cursos son on-demand: empezás cuando quieras y avanzás a tu ritmo.',
    image: {
      src: '/images/home/cursos.webp',
      width: 1536,
      height: 1024,
      alt: 'Notebook sobre un escritorio de madera clara, junto a una taza, una agenda lila, lapiceras, una paleta de colores pastel y una remera blanca',
      ratio: 'aspect-[3/2]',
    },
  },
];

const values = [
  {
    icon: Palette,
    title: 'Diseño Único',
    description: 'Cada producto es pensado con amor y diseñado para destacar. Nada de lo genérico.',
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
  {
    icon: Truck,
    title: 'Envíos a Todo el País',
    description: 'Llegamos a cada rincón de Argentina. Envío gratis en compras mayores a $15.000.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEO title="Nosotros" />

      {/* Hero */}
      <section className="bg-ribbon-soft">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <Breadcrumbs crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-script text-3xl text-dark">Conocenos</p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-dark sm:text-5xl">
                Sobre BS Papelería
              </h1>
              <p className="mt-5 max-w-xl text-base text-dark/75">
                Somos un estudio de papelería boutique que combina diseño, artesanía y tecnología para crear productos únicos y experiencias de aprendizaje inolvidables.
              </p>
            </div>
            <div className="aspect-[3/2] overflow-hidden rounded-[2rem] bg-sand/40 shadow-lift ring-1 ring-sand/70">
              <img
                src="/images/brand/home1.webp"
                alt="Agenda lila de tapa dura con lapiceras, una taza y tarjetas con frases sobre una mesa de tonos suaves"
                width={1500}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story: text and photo, alternating sides */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-24 sm:px-6 lg:px-8">
          {stories.map((story, i) => (
            <div key={story.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 1 ? 'lg:order-last' : undefined}>
                <p className="eyebrow">{story.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">{story.title}</h2>
                <p className="mt-4 max-w-xl text-base text-dark/75">{story.text}</p>
              </div>
              <div
                className={cn(
                  'w-full overflow-hidden rounded-[2rem] bg-sand/40 shadow-lift ring-1 ring-sand/70',
                  story.image.ratio,
                  i % 2 === 1 ? 'lg:justify-self-start' : 'lg:justify-self-end',
                )}
              >
                <img
                  src={story.image.src}
                  alt={story.image.alt}
                  width={story.image.width}
                  height={story.image.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Lo que nos define</p>
            <h2 id="values-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Lo que nos importa
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {values.map((value) => (
              <li key={value.title} className="card p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-ribbon text-dark">
                  <value.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-dark">{value.title}</h3>
                <p className="mt-2 text-sm text-dark/75">{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Collaborate */}
      <section aria-labelledby="collab-heading" className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ribbon px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
            <div aria-hidden="true" className="absolute inset-0 bg-stars opacity-50" />
            <div className="relative">
              <h2 id="collab-heading" className="font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                ¿Querés colaborar con nosotros?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-dark/75">
                Estamos siempre abiertos a nuevas ideas y proyectos creativos.
              </p>
              <a href="mailto:hola@bspapeleria.com" className="btn btn-primary btn-lg mt-8">
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Visitanos — Mapa + info */}
      <VisitUsSection />

      {/* Seguinos en redes */}
      <SocialMediaSection />

      {/* Instagram Feed */}
      <InstagramFeedSection />
    </>
  );
}

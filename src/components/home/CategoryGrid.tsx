import { RevealGroup, RevealItem } from '../shared/Reveal';
import { SectionHeader } from './SectionHeader';

interface Pillar {
  title: string;
  /** A full sentence: the card shows it in full at every width */
  description: string;
  image: string;
  width: number;
  height: number;
}

// What the courses cover. The cards are informational, so they are not links
const pillars: Pillar[] = [
  {
    title: 'Diseño creativo',
    description: 'Aprendé a diseñar tus propios proyectos desde cero, con herramientas accesibles y explicaciones sencillas.',
    image: '/images/home/cat-archivos-digitales.webp',
    width: 1280,
    height: 960,
  },
  {
    title: 'Producción y técnicas',
    description: 'Conocé materiales, herramientas y procesos para transformar tus diseños en productos reales.',
    image: '/images/home/cat-personalizados.webp',
    width: 1280,
    height: 960,
  },
  {
    title: 'Emprendimiento',
    description: 'Sumá conocimientos para organizar tus ideas, calcular costos y empezar a vender tus creaciones.',
    image: '/images/home/cursos.webp',
    width: 1536,
    height: 1024,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Aprendé y crecé"
          title="Tu próximo paso empieza acá"
          subtitle="Aprendé a crear, convertí tus ideas en proyectos y animate a construir tu propio emprendimiento creativo."
        />

        {/* The text lives beside or below the photo, never over it, so the full sentences stay readable at any width:
            compact rows up to lg, three cards with the photo on top from lg */}
        <RevealGroup as="ul" stagger={0.08} className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {pillars.map((pillar) => (
            <RevealItem key={pillar.title} as="li" className="flex">
              <div className="card flex min-w-0 flex-1 items-center gap-4 overflow-hidden p-3 lg:flex-col lg:items-stretch lg:gap-0 lg:p-0">
                {/* The photo only illustrates the text beside it, so it is hidden from screen readers */}
                <span className="block aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-sand/40 sm:w-32 lg:aspect-[4/3] lg:w-full lg:rounded-none">
                  <img
                    src={pillar.image}
                    alt=""
                    width={pillar.width}
                    height={pillar.height}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </span>
                <div className="min-w-0 flex-1 lg:p-6">
                  <h3 className="font-display text-base font-semibold leading-snug text-dark sm:text-lg">{pillar.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-dark/70 sm:text-sm sm:leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

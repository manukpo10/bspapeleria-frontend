import { Link } from 'react-router-dom';
import { Laptop, Medal, MessageCircleHeart, Palette } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/shared/SEO';
import { Breadcrumbs } from '../components/shared/PageHeader';
import { SocialMediaSection } from '../components/about/SocialMediaSection';
import { InstagramFeedSection } from '../components/about/InstagramFeedSection';

const team = [
  {
    name: 'Clari',
    text: '¡Hola! Soy Clari, Licenciada en Artes Audiovisuales y la mente creativa detrás de BS Papelería. Me encargo de los diseños y de enseñarte a crear tus propios proyectos desde cero. Fan de Volver al Futuro y de los perros.',
    caption: 'El día que retiré mi título, uno de mis mayores logros.',
    image: {
      src: '/images/brand/clari.webp',
      size: 564,
      alt: 'Clari sonriendo, con su título de la Universidad Nacional de La Plata en las manos',
    },
    tilt: '-rotate-2',
  },
  {
    name: 'Darío',
    text: '¡Hola! Soy Darío y me encargo de la parte práctica de BS Papelería. Te enseño a darle vida a tus diseños: desde el corte hasta el armado de cada proyecto. Fan de viajar y conocer nuevos lugares.',
    caption: null,
    image: {
      src: '/images/brand/dario.webp',
      size: 694,
      alt: 'Darío sonriendo, con una campera azul, al aire libre',
    },
    tilt: 'rotate-2',
  },
];

const stories = [
  {
    eyebrow: 'Nuestros comienzos',
    title: 'Todo empezó con una idea',
    text: 'BS Papelería nació en plena pandemia, cuando Darío se quedó sin trabajo y decidimos probar algo nuevo. Compramos nuestro primer curso de agendas y empezamos desde cero, sin imaginar que ese pequeño proyecto terminaría convirtiéndose en nuestro trabajo.',
    image: {
      src: '/images/home/hecho-a-mano.webp',
      width: 1024,
      height: 1280,
      alt: 'Manos atando un moño de cinta lila sobre una libreta lavanda, junto a lapiceras color cobre y estrellitas de papel',
      ratio: 'aspect-[4/5] max-w-md mx-auto lg:mx-0',
    },
  },
  {
    eyebrow: 'Nuestro camino',
    title: 'Aprendimos haciendo',
    text: 'Nuestro emprendimiento fue creciendo, pero también llegaron los errores, las pruebas y los desafíos. Aprendimos muchísimo en el camino y, con el tiempo, nuestros seguidores empezaron a consultarnos cómo hacíamos las cosas y a pedirnos consejos.',
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
    title: 'Ahora queremos enseñarte a vos',
    text: 'Así nació la idea de crear nuestros cursos: compartir lo que aprendimos y hacerles el camino un poquito más fácil a quienes recién empiezan. Con clases prácticas, explicaciones claras y acompañamiento, queremos que vos también puedas transformar tus ideas en proyectos reales.',
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
    title: 'Aprendé desde cero',
    description: 'No necesitás conocimientos previos de diseño ni experiencia en papelería. Te enseñamos paso a paso para que puedas empezar con confianza.',
  },
  {
    icon: Medal,
    title: 'Experiencia real',
    description: 'Compartimos lo que aprendimos trabajando en papelería, incluyendo esos trucos y soluciones que descubrimos con la práctica.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Acompañamiento personalizado',
    description: 'No estás sola en el proceso. Podés consultarnos tus dudas y contar con nuestra ayuda mientras aprendés.',
  },
  {
    icon: Laptop,
    title: 'Aprendé a tu ritmo',
    description: 'Accedé a las clases cuando quieras, las veces que necesites y desde donde estés. ¡Los cursos son tuyos para siempre!',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Nosotros"
        description="Conocé a Clary y Darío, las personas detrás de BS Papelería, y cómo te acompañamos a aprender papelería creativa y a emprender."
      />

      {/* Hero */}
      <section className="bg-ribbon-soft">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <Breadcrumbs crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-script text-3xl text-dark">Conocenos</p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-dark sm:text-5xl">
                Detrás de BS Papelería
              </h1>
              <div className="mt-5 max-w-xl space-y-4 text-base text-dark/75">
                <p>Somos Clary y Darío, los que estamos detrás de BS Papelería.</p>
                <p>
                  Empezamos en el mundo de la papelería creativa con muchas ganas de aprender, probar y crear cosas nuevas. Con el tiempo, fuimos transformando esa pasión en nuestro emprendimiento.
                </p>
                <p>
                  Hoy queremos compartir todo lo que aprendimos para que vos también puedas animarte a dar tus primeros pasos, desarrollar tus ideas y construir algo propio.
                </p>
                <p>
                  Porque creemos que aprender es mucho más fácil cuando tenés a alguien que te acompaña en el camino.
                </p>
              </div>
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

      {/* Meet the team: no bottom padding, the stories section's own top padding spaces what follows */}
      <section aria-labelledby="team-heading" className="pt-12 sm:pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="eyebrow">Quiénes somos</p>
            <h2 id="team-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Hola, somos Clary y Darío
            </h2>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {team.map((person) => (
              <li key={person.name} className="card p-6 text-center sm:p-10">
                {/* The sources are small crops, so the photos stay small to look sharp */}
                <figure className="mx-auto w-44 sm:w-48">
                  <img
                    src={person.image.src}
                    alt={person.image.alt}
                    width={person.image.size}
                    height={person.image.size}
                    loading="lazy"
                    decoding="async"
                    className={cn('aspect-square w-full rounded-3xl object-cover shadow-lift ring-4 ring-white', person.tilt)}
                  />
                  {person.caption && <figcaption className="mt-4 text-xs text-dark/65">{person.caption}</figcaption>}
                </figure>
                <h3 className="mt-6 font-display text-2xl font-semibold text-dark">{person.name}</h3>
                <p className="mt-3 text-base text-dark/75">{person.text}</p>
              </li>
            ))}
          </ul>
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

      {/* Invitation to the courses */}
      <section aria-labelledby="courses-cta-heading" className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ribbon px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
            <div aria-hidden="true" className="absolute inset-0 bg-stars opacity-50" />
            <div className="relative">
              <h2 id="courses-cta-heading" className="font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                ¿Te gustaría aprender con nosotros?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-dark/75">
                Ahora que conocés nuestra historia, ¡queremos ser parte de la tuya! Descubrí nuestros cursos y empezá a crear tus propios proyectos, con nuestro acompañamiento en cada paso.
              </p>
              <Link to="/cursos" className="btn btn-primary btn-lg mt-8">
                Conocé nuestros cursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seguinos en redes */}
      <SocialMediaSection />

      {/* Instagram Feed */}
      <InstagramFeedSection />
    </>
  );
}

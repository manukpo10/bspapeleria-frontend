import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SectionHeader } from './SectionHeader';
import { swiperLayout, swiperBullets } from './SliderArrows';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'María González',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Emprendedora',
    text: 'Los cursos de BS Papelería cambiaron mi vida. Pasé de no saber nada de diseño a tener mi propio negocio de productos personalizados. La calidad del contenido y la atención de las instructoras es excepcional.',
    rating: 5,
  },
  {
    name: 'Juan Pérez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Diseñador Gráfico',
    text: 'La calidad de los productos es inmejorable. La sublimación es perfecta y los materiales son de primera. Recomiendo al 100% cada artículo que compré.',
    rating: 5,
  },
  {
    name: 'Ana Ruiz',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Planificadora de Eventos',
    text: 'La papelería de boda que diseñaron para mi hermana fue espectacular. Cada invitado quedó fascinado con el nivel de detalle y la elegancia de cada pieza.',
    rating: 5,
  },
  {
    name: 'Carlos López',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Estudiante',
    text: 'El curso de impresión 3D me abrió un mundo nuevo. La instructora explica todo de forma clara y los proyectos son muy prácticos. Ya estoy vendiendo mis primeros diseños.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    // The swiper keeps its own 3.5rem of bottom padding (shadows + bullets), so the section needs less
    <section className="pb-6 pt-12 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Testimonios"
          title="Lo que dicen nuestros clientes"
          subtitle="Miles de personas ya confiaron en BS Papelería para sus proyectos creativos."
        />

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={`${swiperLayout} ${swiperBullets}`}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <figure className="card flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <Quote className="size-9 text-iris" aria-hidden="true" />
                  <div className="flex gap-0.5" role="img" aria-label={`${t.rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star
                        key={j}
                        aria-hidden="true"
                        className={cn('size-4', j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-dark/20')}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="mt-5 flex-1 leading-relaxed text-dark/70">“{t.text}”</blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-sand/60 pt-5">
                  <img
                    src={t.avatar}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="size-12 shrink-0 rounded-full object-cover ring-2 ring-sand"
                  />
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold text-dark">{t.name}</span>
                    <span className="block text-xs text-dark/65">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

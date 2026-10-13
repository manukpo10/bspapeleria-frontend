import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { swiperLayout, swiperBullets } from './SliderArrows';

import 'swiper/css';
import 'swiper/css/pagination';

// First names only: no photos or roles were provided, so the cards do not show any
const testimonials = [
  {
    name: 'Viviana',
    text: 'Pensé que iba a ser mucho más difícil porque nunca había diseñado nada. Me sorprendió poder seguir las clases y hacer mi primera agenda. Todavía me falta aprender un montón, pero estoy re contenta con lo que logré.',
  },
  {
    name: 'Daiana',
    text: 'Hacía tiempo que quería empezar con la papelería, pero siempre encontraba una excusa. El curso me ayudó a organizarme y animarme a probar. Ya hice mis primeros diseños y estoy practicando para empezar a vender.',
  },
  {
    name: 'Julieta',
    text: 'Lo que más me gustó es que cuando tuve una duda me ayudaron a resolverla. A veces una se traba con algo que parece una pavada y termina dejando todo. Poder consultar hace que sea mucho más fácil seguir.',
  },
  {
    name: 'Carina',
    text: 'Todavía no tengo un emprendimiento armado, pero ya empecé a hacer cositas para mi familia y me encanta cómo van quedando. Mi idea es seguir practicando y más adelante empezar a tomar pedidos.',
  },
];

export function Testimonials() {
  return (
    // The swiper keeps its own 3.5rem of bottom padding (shadows + bullets), so the section needs less
    <section className="pb-6 pt-12 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Experiencias que inspiran"
          title="Cada emprendimiento tiene su historia"
          subtitle="Detrás de cada proyecto hay alguien que se animó a aprender algo nuevo. Queremos acompañarte a escribir tu propia historia."
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
            // Swiper sets height: 100% on slides; auto lets the flex row stretch them to the tallest card
            <SwiperSlide key={t.name} className="h-auto!">
              <figure className="card flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <Quote className="size-9 text-iris" aria-hidden="true" />
                  {/* Ornament from the owner's layout, not a rating that each person gave */}
                  <div className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <blockquote className="mt-5 flex-1 leading-relaxed text-dark/70">“{t.text}”</blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-sand/60 pt-5">
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-ribbon font-display text-lg font-bold text-dark ring-2 ring-sand"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="font-display text-sm font-semibold text-dark">{t.name}</span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

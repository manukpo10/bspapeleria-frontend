import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'María González',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Emprendedora',
    text: 'Los cursos de BS Papelería cambiaron mi vida. Pasé de no saber nada de diseño a tener mi propio negocio de productos personalizados.',
    rating: 5,
  },
  {
    name: 'Juan Pérez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Diseñador Gráfico',
    text: 'La calidad de los productos es inmejorable. La sublimación es perfecta y los materiales son de primera. Recomiendo al 100%.',
    rating: 5,
  },
  {
    name: 'Ana Ruiz',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Planificadora de Eventos',
    text: 'La papelería de boda que diseñaron para mi hermana fue espectacular. Cada invitado quedó fascinado con el nivel de detalle.',
    rating: 5,
  },
  {
    name: 'Carlos López',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Estudiante',
    text: 'El curso de impresión 3D me abrió un mundo nuevo. La instructora explica todo de forma clara y los proyectos son muy prácticos.',
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-sand/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="block font-script text-2xl text-secondary mb-2">Testimonios</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

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
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="h-full"
              >
                <div className="h-full rounded-2xl bg-white p-6 border border-sand/50 shadow-soft">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-dark/70 text-sm leading-relaxed mb-6">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-dark text-sm">{t.name}</p>
                      <p className="text-dark/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < t.rating ? 'text-warning fill-warning' : 'text-dark/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

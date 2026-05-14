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
    <section className="py-24 bg-dark relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 grain opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="block font-script text-2xl text-secondary mb-2">Testimonios</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Miles de personas ya confiaron en BS Papelería para sus proyectos creativos.
          </p>
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
                <div className="h-full rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-colors duration-300">
                  <Quote className="w-10 h-10 text-primary/40 mb-6" />
                  <p className="text-white/80 text-sm leading-relaxed mb-8 min-h-[80px]">"{t.text}"</p>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" 
                    />
                    <div>
                      <p className="font-medium text-white">{t.name}</p>
                      <p className="text-white/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 mt-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < t.rating ? 'text-warning fill-warning' : 'text-white/20'}`}
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

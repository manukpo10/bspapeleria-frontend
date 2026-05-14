import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Clock, Users, Star, BookOpen } from 'lucide-react';
import type { Course } from '../../types';
import { formatPrice } from '../../lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CourseSliderProps {
  title: string;
  subtitle?: string;
  script?: string;
  courses: Course[];
}

export function CourseSlider({ title, subtitle, script, courses }: CourseSliderProps) {
  return (
    <section className="py-20 bg-sand/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            {script && <span className="block font-script text-xl text-secondary mb-1">{script}</span>}
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">{title}</h2>
            {subtitle && <p className="text-dark/60 mt-2">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button className="course-prev-btn p-2 rounded-full border border-sand hover:bg-sand/50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="course-next-btn p-2 rounded-full border border-sand hover:bg-sand/50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{ prevEl: '.course-prev-btn', nextEl: '.course-next-btn' }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {courses.map((course, i) => (
            <SwiperSlide key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white border border-sand/50 shadow-soft hover:shadow-lg transition-all hover:-translate-y-1">
                  <Link to={`/cursos/${course.slug}`} className="block relative aspect-video overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/90 text-dark text-xs font-bold px-3 py-1">
                        {course.level === 'principiante' ? 'Principiante' : course.level === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                      </span>
                      <span className="flex items-center gap-1 text-white text-xs">
                        <Clock className="w-3 h-3" /> {course.duration}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/cursos/${course.slug}`}>
                      <h3 className="font-display font-medium text-dark group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-3 text-xs text-dark/60">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolledCount}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {course.rating}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.topics.length} módulos</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-primary font-semibold text-lg">{formatPrice(course.price)}</span>
                      {course.comparePrice && (
                        <span className="text-dark/40 text-sm line-through">{formatPrice(course.comparePrice)}</span>
                      )}
                    </div>
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

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Course } from '../../types';
import { cn } from '../../lib/utils';
import { CourseCard } from '../shared/CourseCard';
import { SectionHeader } from './SectionHeader';
import { SliderArrows, swiperLayout, swiperBullets } from './SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CourseSliderProps {
  title: string;
  subtitle?: string;
  script?: string;
  courses: Course[];
  loading?: boolean;
}

function CourseSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-[16/10] animate-pulse bg-sand/40" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-11/12 animate-pulse rounded-full bg-sand/40" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-sand/40" />
        <div className="h-6 w-1/2 animate-pulse rounded-full bg-sand/40" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-sand/40" />
        <div className="h-7 w-full animate-pulse rounded-full bg-sand/40" />
      </div>
    </div>
  );
}

export function CourseSlider({ title, subtitle, script, courses, loading = false }: CourseSliderProps) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  if (!loading && courses.length === 0) return null;

  return (
    // The swiper keeps its own 3.5rem of bottom padding (shadows + bullets), so the section needs less
    <section className="pb-6 pt-12 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          script={script}
          centered={false}
          action={loading ? undefined : <SliderArrows label={title} setPrevEl={setPrevEl} setNextEl={setNextEl} />}
        />

        {loading ? (
          <div role="status" className="pb-14">
            <span className="sr-only">Cargando cursos…</span>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className={cn(i === 1 && 'max-sm:hidden', i === 2 && 'max-lg:hidden')}>
                  <CourseSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            // Phones: a little more than one card so the next one peeks. Swiper does not carry spaceBetween from
            // one breakpoint to the next, so every breakpoint states its own
            spaceBetween={12}
            slidesPerView={1.12}
            navigation={{ prevEl, nextEl }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className={`${swiperLayout} ${swiperBullets}`}
          >
            {courses.map((course) => (
              // Swiper sets height: 100% on slides; auto lets the flex row stretch them to the tallest card
              <SwiperSlide key={course.id} className="h-auto!">
                <CourseCard course={course} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

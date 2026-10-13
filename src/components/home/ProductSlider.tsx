import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';
import { ProductCard } from '../shared/ProductCard';
import { Reveal } from '../shared/Reveal';
import { SectionHeader } from './SectionHeader';
import { SliderArrows, swiperLayout, swiperBullets } from './SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  script?: string;
  products: Product[];
  loading?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-square animate-pulse bg-sand/40" />
      <div className="space-y-3 p-3 sm:p-5">
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-sand/40" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-sand/40" />
        <div className="h-6 w-2/5 animate-pulse rounded-full bg-sand/40" />
        <div className="h-11 w-full animate-pulse rounded-full bg-sand/40" />
      </div>
    </div>
  );
}

export function ProductSlider({ title, subtitle, script, products, loading = false }: ProductSliderProps) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  if (!loading && products.length === 0) return null;

  return (
    // The swiper keeps its own 3.5rem of bottom padding (shadows + bullets), so the section needs less.
    // overflow-x-clip: the slider block enters 32px from the right, which must not widen the page. Unlike
    // `overflow: hidden` it leaves the y axis visible, so shadows and bullets are not cut
    <section className="overflow-x-clip pb-6 pt-12 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          script={script}
          centered={false}
          action={loading ? undefined : <SliderArrows label={title} setPrevEl={setPrevEl} setNextEl={setNextEl} />}
        />

        {/* One wrapper for skeleton and swiper, so the entrance plays once and does not restart when the data arrives */}
        <Reveal from="right">
          {loading ? (
            <div role="status" className="pb-14">
              <span className="sr-only">Cargando productos…</span>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className={cn(i === 2 && 'max-lg:hidden', i === 3 && 'max-xl:hidden')}>
                    <ProductSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              // Phones: 1.6 compact cards so the next one peeks. Swiper does not carry spaceBetween from one
              // breakpoint to the next, so every breakpoint states its own
              spaceBetween={12}
              slidesPerView={1.6}
              navigation={{ prevEl, nextEl }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className={`${swiperLayout} ${swiperBullets}`}
            >
              {products.map((product) => (
                // Swiper sets height: 100% on slides; auto lets the flex row stretch them to the tallest card
                <SwiperSlide key={product.id} className="h-auto!">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Reveal>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';
import { ProductCard } from '../shared/ProductCard';
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
      <div className="space-y-3 p-5">
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
    // The swiper keeps its own 3.5rem of bottom padding (shadows + bullets), so the section needs less
    <section className="pb-6 pt-16 sm:pb-8 sm:pt-20">
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
            <span className="sr-only">Cargando productos…</span>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={cn(i === 1 && 'max-sm:hidden', i === 2 && 'max-lg:hidden', i === 3 && 'max-xl:hidden')}
                >
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{ prevEl, nextEl }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className={`${swiperLayout} ${swiperBullets}`}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

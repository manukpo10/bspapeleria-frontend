import { ChevronLeft, ChevronRight } from 'lucide-react';

/*
 * Swiper ships unlayered CSS, which beats Tailwind's utilities layer, so the padding that keeps card
 * shadows from being clipped needs `!`. The CSS variables restyle the pagination bullets (active = iris).
 */
export const swiperLayout = '-mx-2! px-2! pt-2! pb-14!';
export const swiperBullets =
  '[--swiper-pagination-color:var(--color-iris)] [--swiper-pagination-bullet-inactive-color:var(--color-secondary)] [--swiper-pagination-bullet-inactive-opacity:0.6] [--swiper-pagination-bullet-size:10px] [--swiper-pagination-bullet-horizontal-gap:5px]';

interface SliderArrowsProps {
  /** Section title, used to tell the arrows of different sliders apart for screen readers */
  label?: string;
  setPrevEl: (el: HTMLButtonElement | null) => void;
  setNextEl: (el: HTMLButtonElement | null) => void;
}

export function SliderArrows({ label, setPrevEl, setNextEl }: SliderArrowsProps) {
  return (
    <div className="flex gap-2">
      <button
        ref={setPrevEl}
        type="button"
        aria-label={label ? `Anterior: ${label}` : 'Anterior'}
        className="btn btn-secondary size-11 p-0"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        ref={setNextEl}
        type="button"
        aria-label={label ? `Siguiente: ${label}` : 'Siguiente'}
        className="btn btn-secondary size-11 p-0"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}

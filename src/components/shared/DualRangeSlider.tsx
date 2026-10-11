import { useState, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { formatPrice } from '../../lib/utils';

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

/** Two-thumb price range. Same control as the product list filters: mouse, touch and arrow keys */
export function DualRangeSlider({ min, max, value, onChange }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const valueRef = useRef(value);

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawVal = Math.round(min + pct * (max - min));
      const current = valueRef.current;
      if (dragging === 'min') {
        onChange([Math.min(rawVal, current[1] - 1), current[1]]);
      } else {
        onChange([current[0], Math.max(rawVal, current[0] + 1)]);
      }
    };
    const handleUp = () => setDragging(null);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [dragging, min, max, onChange]);

  // Arrow keys move a focused thumb, keeping the same one-unit gap the drag enforces
  const handleKeyDown = (thumb: 'min' | 'max') => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = Math.max(1, Math.round((max - min) / 100));
    let delta: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'PageUp':
        delta = step * 10;
        break;
      case 'PageDown':
        delta = -step * 10;
        break;
      case 'Home':
        delta = -Infinity;
        break;
      case 'End':
        delta = Infinity;
        break;
      default:
        return;
    }
    e.preventDefault();
    const [lo, hi] = value;
    if (thumb === 'min') {
      onChange([Math.max(min, Math.min(lo + delta, hi - 1)), hi]);
    } else {
      onChange([lo, Math.min(max, Math.max(hi + delta, lo + 1))]);
    }
  };

  // The thumb is a 44px hit area around a 24px knob; the knob draws the focus ring
  const thumbClass =
    'thumb group absolute top-1/2 grid size-11 -translate-y-1/2 cursor-grab place-items-center outline-none active:cursor-grabbing';
  const knobClass =
    'size-6 rounded-full border-2 border-iris bg-white shadow-soft transition-shadow group-hover:shadow-lift group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-iris';

  return (
    <div
      ref={trackRef}
      className="relative h-11 touch-none select-none"
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.thumb')) return;
        const rect = trackRef.current!.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
        setDragging(pct < mid ? 'min' : 'max');
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.thumb')) return;
        const rect = trackRef.current!.getBoundingClientRect();
        const pct = (e.touches[0].clientX - rect.left) / rect.width;
        const mid = ((value[0] - min) / (max - min) + (value[1] - min) / (max - min)) / 2;
        setDragging(pct < mid ? 'min' : 'max');
      }}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-sand">
        <div
          className="absolute h-2 rounded-full bg-iris"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Precio mínimo"
        aria-valuemin={min}
        aria-valuemax={value[1] - 1}
        aria-valuenow={value[0]}
        aria-valuetext={formatPrice(value[0])}
        className={thumbClass}
        style={{ left: `calc(${minPercent}% - 22px)` }}
        onMouseDown={(e) => { e.stopPropagation(); setDragging('min'); }}
        onTouchStart={(e) => { e.stopPropagation(); setDragging('min'); }}
        onKeyDown={handleKeyDown('min')}
      >
        <span aria-hidden="true" className={knobClass} />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Precio máximo"
        aria-valuemin={value[0] + 1}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        aria-valuetext={formatPrice(value[1])}
        className={thumbClass}
        style={{ left: `calc(${maxPercent}% - 22px)` }}
        onMouseDown={(e) => { e.stopPropagation(); setDragging('max'); }}
        onTouchStart={(e) => { e.stopPropagation(); setDragging('max'); }}
        onKeyDown={handleKeyDown('max')}
      >
        <span aria-hidden="true" className={knobClass} />
      </div>
    </div>
  );
}

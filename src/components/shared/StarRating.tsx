import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  /** Reviews count; when given it is shown next to the stars */
  count?: number;
  /** Icon size in px */
  size?: number;
  className?: string;
}

export function StarRating({ rating, count, size = 16, className }: StarRatingProps) {
  const label = `Calificación ${rating.toFixed(1)} de 5${count !== undefined ? `, ${count} reseñas` : ''}`;

  return (
    <div role="img" aria-label={label} className={cn('flex items-center gap-2', className)}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : half ? 'fill-amber-400/40 text-amber-400' : 'text-sand'}
            />
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-dark/65" aria-hidden="true">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

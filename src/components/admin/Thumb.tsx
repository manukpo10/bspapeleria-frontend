import { Image as ImageIcon } from 'lucide-react';

/** Square thumbnail of a row. It is decoration (the name sits next to it), so the alt is empty. Without an image, a quiet tile */
export function Thumb({ src }: { src?: string }) {
  if (!src) {
    return (
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mist text-dark/55">
        <ImageIcon className="size-5" aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      className="size-12 shrink-0 rounded-xl bg-sand/40 object-cover"
    />
  );
}

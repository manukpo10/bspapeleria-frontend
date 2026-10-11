import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProductCategory } from '../../types';
import { SectionHeader } from './SectionHeader';

interface Tile {
  label: string;
  /** One short line (the category descriptions in PRODUCT_CATEGORIES, trimmed to fit a tile) */
  description: string;
  to: string;
  image: string;
  width: number;
  height: number;
}

// ProductListPage reads the `categoria` query parameter; the ids are the ones in PRODUCT_CATEGORIES
const byCategory = (id: ProductCategory) => `/productos?categoria=${id}`;

const tiles: Tile[] = [
  {
    label: 'Productos personalizados',
    description: 'Agendas, tazas y llaveros',
    to: byCategory('personalizados'),
    image: '/images/home/cat-personalizados.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Sublimables',
    description: 'Remeras, mates y más',
    to: byCategory('sublimables'),
    image: '/images/home/cat-sublimables.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Detalles para fiestas',
    description: 'Cotillón y decoración',
    to: byCategory('fiestas'),
    image: '/images/home/fiestas.webp',
    width: 1280,
    height: 1024,
  },
  {
    label: 'Cartelería',
    description: 'Carteles e invitaciones',
    to: byCategory('carteleria'),
    image: '/images/home/cat-carteleria.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Archivos digitales',
    description: 'Imprimibles y plantillas',
    to: byCategory('archivos-digitales'),
    image: '/images/home/cat-archivos-digitales.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Cursos y talleres',
    description: 'Online y presenciales',
    to: '/cursos',
    image: '/images/home/cursos.webp',
    width: 1536,
    height: 1024,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Explorá"
          title="Todo lo que podés crear"
          subtitle="Agendas, tazas, tarjetas y mucho más: elegí tu categoría favorita y dale tu toque personal."
        />

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6">
          {tiles.map((tile) => (
            <li key={tile.to}>
              <Link
                to={tile.to}
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-sand/40 shadow-soft"
              >
                <img
                  src={tile.image}
                  alt=""
                  width={tile.width}
                  height={tile.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-dark/85 via-dark/45 via-45% to-transparent"
                />
                {/* The two-column mobile grid has no room for the arrow or the description, so they start at sm */}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-5">
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold leading-snug text-white wrap-break-word sm:text-base lg:text-lg">
                      {tile.label}
                    </span>
                    <span className="mt-0.5 hidden text-xs leading-snug text-white/85 sm:block">{tile.description}</span>
                  </span>
                  <ArrowRight
                    className="mb-0.5 size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 max-sm:hidden"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

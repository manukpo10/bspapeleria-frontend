import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProductCategory } from '../../types';
import { RevealGroup, RevealItem } from '../shared/Reveal';
import { SectionHeader } from './SectionHeader';

interface Tile {
  label: string;
  /** A full sentence: the tile shows it in full at every width */
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
    label: 'Cursos para emprender',
    description: 'Aprendé desde cero y convertí tus ideas en un emprendimiento creativo.',
    to: '/cursos',
    image: '/images/home/cursos.webp',
    width: 1536,
    height: 1024,
  },
  {
    label: 'Recursos digitales',
    description: 'Encontrá herramientas y archivos para dar vida a tus ideas.',
    to: byCategory('archivos-digitales'),
    image: '/images/home/cat-archivos-digitales.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Papelería personalizada',
    description: 'Agendas y productos personalizados para acompañar tus días.',
    to: byCategory('personalizados'),
    image: '/images/home/cat-personalizados.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Insumos sublimables',
    description: 'Productos para personalizar y crear piezas únicas.',
    to: byCategory('sublimables'),
    image: '/images/home/cat-sublimables.webp',
    width: 1280,
    height: 960,
  },
  {
    label: 'Decoración para eventos',
    description: 'Detalles creativos para cumpleaños y ocasiones especiales.',
    to: byCategory('fiestas'),
    image: '/images/home/fiestas.webp',
    width: 1280,
    height: 1024,
  },
  {
    label: 'Cartelería e invitaciones',
    description: 'Diseños personalizados para comunicar y celebrar.',
    to: byCategory('carteleria'),
    image: '/images/home/cat-carteleria.webp',
    width: 1280,
    height: 960,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          script="Aprendé y crecé"
          title="Tu próximo paso empieza acá"
          subtitle="Aprendé a crear, convertí tus ideas en proyectos y animate a construir tu propio emprendimiento creativo."
        />

        {/* The text lives beside or below the photo, never over it, so the full sentences stay readable at any width:
            compact rows on phones, cards with the photo on top from sm */}
        <RevealGroup as="ul" stagger={0.08} className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {tiles.map((tile) => (
            <RevealItem key={tile.to} as="li" className="flex">
              <Link
                to={tile.to}
                className="group card flex min-w-0 flex-1 items-center gap-4 overflow-hidden p-3 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0"
              >
                <span className="block aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-sand/40 sm:aspect-[4/3] sm:w-full sm:rounded-none">
                  <img
                    src={tile.image}
                    alt=""
                    width={tile.width}
                    height={tile.height}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </span>
                <span className="flex min-w-0 flex-1 items-start justify-between gap-3 sm:p-5">
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold leading-snug text-dark sm:text-lg">
                      {tile.label}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-dark/70 sm:text-sm sm:leading-relaxed">
                      {tile.description}
                    </span>
                  </span>
                  {/* Decorative, and no hover on touch screens, so it starts at sm */}
                  <ArrowRight
                    className="mt-1 size-5 shrink-0 text-iris transition-transform duration-300 group-hover:translate-x-1 max-sm:hidden"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../../types';
import { cn, formatPrice } from '../../lib/utils';
import { PRODUCT_CATEGORIES } from '../../lib/constants';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { StarRating } from './StarRating';

const NEW_PRODUCT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Round buttons over the image: always visible on touch, revealed on hover/focus with a mouse
const overlayButton =
  'grid size-11 place-items-center rounded-full bg-white/90 text-dark/70 opacity-100 shadow-soft backdrop-blur-sm transition-all hover:bg-white focus-visible:opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100';

interface ProductCardProps {
  product: Product;
  /** 'list' puts the image beside the text from the sm breakpoint up */
  layout?: 'grid' | 'list';
  /** Adds category, rating and status flags. The home slider keeps the minimal body */
  detailed?: boolean;
  /** When given, a quick view button is added over the image */
  onQuickView?: (product: Product) => void;
}

/*
 * The card answers to its own width, not the viewport's: the root is a size container and below 16rem (`@3xs`)
 * it turns compact (two per row on phones, the peeking home carousel). From 16rem up every `@3xs:` class puts
 * back the original value, so wider cards render as they always did.
 */
export function ProductCard({ product, layout = 'grid', detailed = false, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [wished, setWished] = useState(false);
  // The clock is read once when the card mounts, so rendering stays pure
  const [mountedAt] = useState(() => Date.now());

  const isList = layout === 'list';
  const href = `/productos/${product.slug}`;
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const isNew = mountedAt - new Date(product.createdAt).getTime() < NEW_PRODUCT_WINDOW_MS;
  const lowStock = product.stock > 0 && product.stock < 5;
  const categoryLabel = PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.name ?? product.category;
  // "Digital" owns the corner of the image, so a featured flag that loses it is shown in the text instead
  const featuredOnImage = detailed && product.featured && !product.isDigital;
  const featuredInText = detailed && product.featured && product.isDigital;

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}`,
      type: 'product',
      itemId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      isDigital: product.isDigital,
    });
    toast.success('Producto agregado al carrito', {
      action: { label: 'Ver carrito', onClick: () => useUIStore.getState().setCartDrawerOpen(true) },
    });
  };

  const priceRow = (
    <div className="flex flex-wrap items-baseline gap-x-1.5 @3xs:gap-x-2">
      <span className="font-display text-base font-bold text-dark @3xs:text-lg">{formatPrice(product.price)}</span>
      {product.comparePrice != null && product.comparePrice > product.price ? (
        <del className="text-xs text-dark/65 @3xs:text-sm">
          <span className="sr-only">Precio anterior: </span>
          {formatPrice(product.comparePrice)}
        </del>
      ) : null}
    </div>
  );

  // Compact: "Agregar" on screen, the full label for assistive technology, and a 44px tall target
  const addButton = (
    <button
      type="button"
      onClick={handleAddToCart}
      className={cn('btn btn-soft min-h-11 px-3 py-2.5 @3xs:px-6 @3xs:py-3', !isList && 'w-full')}
    >
      <ShoppingCart className="size-4" aria-hidden="true" />
      <span className="@max-3xs:sr-only">Agregar al carrito</span>
      <span aria-hidden="true" className="@3xs:hidden">Agregar</span>
      <span className="sr-only">: {product.name}</span>
    </button>
  );

  return (
    <article
      className={cn('card card-hover group @container flex overflow-hidden', isList ? 'flex-col sm:flex-row' : 'h-full flex-col')}
    >
      <div className={cn('relative', isList && 'sm:w-56 sm:shrink-0')}>
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className={cn('relative block aspect-square overflow-hidden bg-sand/40', isList && 'sm:aspect-auto sm:h-full sm:min-h-56')}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && (
          <span className="chip absolute left-2 top-2 bg-dark px-2 text-2xs text-white shadow-soft @3xs:left-3 @3xs:top-3 @3xs:px-3 @3xs:text-[0.8125rem]/[1.125rem]">
            -{discount}%
          </span>
        )}
        {product.isDigital && (
          <span className="chip absolute right-2 top-2 bg-white/90 px-2 text-2xs text-iris shadow-soft @3xs:right-3 @3xs:top-3 @3xs:px-3 @3xs:text-[0.8125rem]/[1.125rem]">
            Digital
          </span>
        )}
        {featuredOnImage && (
          <span className="chip absolute right-2 top-2 bg-white/90 p-1.5 text-iris shadow-soft @3xs:right-3 @3xs:top-3 @3xs:px-3 @3xs:py-1">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span className="@max-3xs:sr-only">Destacado</span>
          </span>
        )}

        <div className="absolute bottom-2 right-2 flex gap-2 @3xs:bottom-3 @3xs:right-3">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className={cn(overlayButton, '@max-3xs:hidden hover:text-iris')}
              aria-label={`Vista rápida de ${product.name}`}
            >
              <Eye className="size-5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setWished((w) => !w)}
            aria-pressed={wished}
            className={cn(overlayButton, wished ? 'text-rose-600' : 'hover:text-rose-600')}
            aria-label={`Agregar ${product.name} a la wishlist`}
          >
            <Heart className={cn('size-5', wished && 'fill-current')} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col', isList ? 'p-5 sm:p-6' : 'p-3 @3xs:p-5')}>
        {detailed && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <p className="text-xs text-dark/65 @max-3xs:hidden">{categoryLabel}</p>
            {isNew && <span className="chip bg-mist text-iris">Nuevo</span>}
            {featuredInText && (
              <span className="chip bg-mist p-1.5 text-iris @3xs:px-3 @3xs:py-1">
                <Sparkles className="size-3.5" aria-hidden="true" />
                <span className="@max-3xs:sr-only">Destacado</span>
              </span>
            )}
            {lowStock && <span className="chip bg-rose-50 text-rose-700">Últimas unidades</span>}
          </div>
        )}

        <h3
          className={cn(
            'font-display font-semibold text-dark line-clamp-2',
            detailed && 'mt-1.5',
            // leading-snug has to come after the grid sizes: tailwind-merge drops a leading-* that precedes a text size
            isList ? 'text-lg' : 'text-xs @3xs:text-sm leading-snug',
          )}
        >
          <Link to={href} className="transition-colors hover:text-iris">
            {product.name}
          </Link>
        </h3>

        {/* No stars until a product has real reviews: an empty rating reads as a bad one */}
        {detailed && product.reviewsCount > 0 && (
          <StarRating
            className="mt-1.5 flex-wrap @3xs:mt-2 [&_svg]:size-3.5 @3xs:[&_svg]:size-4"
            rating={product.rating}
            count={product.reviewsCount}
          />
        )}
        {detailed && isList && product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-dark/75">{product.shortDescription}</p>
        )}

        {isList ? (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-4">
            {priceRow}
            {addButton}
          </div>
        ) : (
          <>
            <div className="mt-2">{priceRow}</div>
            <div className="mt-auto pt-3 @3xs:pt-4">{addButton}</div>
          </>
        )}
      </div>
    </article>
  );
}

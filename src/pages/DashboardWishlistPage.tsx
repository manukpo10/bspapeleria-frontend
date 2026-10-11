import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { EmptyState } from '../components/shared/EmptyState';
import { SectionHeading } from '../components/shared/SectionHeading';
import { products, courses } from '../data/mocks';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import { cn, formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

export default function DashboardWishlistPage() {
  const { user, updateUser } = useAuthStore();
  const { addItem } = useCartStore();

  const wishlistItems = user?.wishlist?.map((id) => {
    return products.find((p) => p.id === id) ?? courses.find((c) => c.id === id);
  }).filter(Boolean) ?? [];

  const removeFromWishlist = (id: string) => {
    if (!user) return;
    const updated = user.wishlist.filter((w) => w !== id);
    updateUser({ wishlist: updated });
    toast.success('Eliminado de wishlist');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeading title="Wishlist" />

      {wishlistItems.length === 0 ? (
        <EmptyState
          className="card"
          icon={Heart}
          title="Tu wishlist está vacía."
          action={<Link to="/productos" className="btn btn-secondary">Ver productos</Link>}
        >
          Guardá lo que te guste y lo vas a encontrar acá.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((item) => {
            if (!item) return null;
            const isProduct = 'category' in item;
            const name = isProduct ? item.name : item.title;
            const image = isProduct ? item.images[0] : item.coverImage;
            const href = isProduct ? `/productos/${item.slug}` : `/cursos/${item.slug}`;
            const kind = isProduct
              ? PRODUCT_CATEGORIES.find((c) => c.id === item.category)?.name ?? item.category
              : 'Curso';
            return (
              <li key={item.id}>
                <article className="card card-hover group flex h-full flex-col overflow-hidden">
                  <div className="relative">
                    <Link
                      to={href}
                      tabIndex={-1}
                      aria-hidden="true"
                      className={cn('relative block overflow-hidden bg-sand/40', isProduct ? 'aspect-square' : 'aspect-[16/10]')}
                    >
                      <img
                        src={image}
                        alt=""
                        width={isProduct ? 600 : 640}
                        height={isProduct ? 600 : 400}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label={`Quitar ${name} de la wishlist`}
                      className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/90 text-dark/70 shadow-soft backdrop-blur-sm transition-colors hover:bg-white hover:text-rose-700"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-dark/65">{kind}</p>
                    <h3 className="mt-1 font-display font-semibold leading-snug text-dark line-clamp-2">
                      <Link to={href} className="transition-colors hover:text-iris">
                        {name}
                      </Link>
                    </h3>
                    <p className="mt-2 font-display text-lg font-bold text-dark">{formatPrice(item.price)}</p>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            id: `cart-${item.id}`,
                            type: isProduct ? 'product' : 'course',
                            itemId: item.id,
                            name: isProduct ? item.name : item.title,
                            image: isProduct ? item.images[0] : item.coverImage,
                            price: item.price,
                            quantity: 1,
                            isDigital: isProduct ? item.isDigital : true,
                          });
                          toast.success('Agregado al carrito');
                        }}
                        className="btn btn-soft w-full"
                      >
                        <ShoppingCart className="size-4" aria-hidden="true" /> Mover al carrito
                        <span className="sr-only">: {name}</span>
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

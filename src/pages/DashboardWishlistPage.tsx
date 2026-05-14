import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { products, courses } from '../data/mocks';
import { formatPrice } from '../lib/utils';
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
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-dark">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-sand/20 border border-sand/50">
          <Heart className="w-12 h-12 text-dark/20 mx-auto mb-3" />
          <p className="text-dark/60 mb-4">Tu wishlist está vacía.</p>
          <Link to="/productos" className="text-primary hover:underline text-sm">Ver productos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistItems.map((item) => {
            if (!item) return null;
            const isProduct = 'category' in item;
            return (
              <div key={item.id} className="rounded-2xl bg-white border border-sand/50 overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={isProduct ? item.images[0] : item.coverImage}
                    alt={isProduct ? item.name : item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 text-error hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-display font-medium text-dark text-sm">{isProduct ? item.name : item.title}</p>
                  <p className="text-primary font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
                  <button
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
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-sand/50 py-2 text-sm font-medium text-dark hover:bg-primary hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" /> Mover al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

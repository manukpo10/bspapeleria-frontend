import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu, X, Search, User, Heart, BookOpen, LayoutDashboard,
  LogOut, ChevronDown, GraduationCap, Store
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { formatPrice } from '../../lib/utils';
import { useDeliveredNotifications } from '../../hooks/useDeliveredNotifications';

export function Header() {
  const { user, isAuthenticated, isAdminView, toggleAdminView, logout } = useAuthStore();
  const { items, getItemCount, getTotal } = useCartStore();
  const { cartDrawerOpen, setCartDrawerOpen, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { items: notifications, dismissAll } = useDeliveredNotifications();
  const hasNotifications = notifications.length > 0;
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = getItemCount();
  const cartTotal = getTotal();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'FAQ', href: '/preguntas-frecuentes' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-sand/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="BS Papelería" className="h-10 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-dark/70 hover:text-dark transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-sand/50 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 text-dark/70" />
              </button>

              {isAuthenticated && (
                <Link to="/mi-cuenta/wishlist" className="hidden sm:flex p-2 rounded-full hover:bg-sand/50 transition-colors" aria-label="Wishlist">
                  <Heart className="w-5 h-5 text-dark/70" />
                </Link>
              )}

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 rounded-full hover:bg-sand/50 transition-colors"
                aria-label="Carrito"
              >
                <ShoppingCart className="w-5 h-5 text-dark/70" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); if (!profileOpen && hasNotifications) dismissAll(); }}
                    className="flex items-center gap-2 rounded-full hover:bg-sand/50 transition-colors p-1 pr-3"
                  >
                    <div className="relative">
                      <img
                        src={user?.avatar ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name ?? 'U')}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      {hasNotifications && (
                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-error border-2 border-white" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-dark/50" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-soft border border-sand/50 py-2"
                      >
                        <div className="px-4 py-2 border-b border-sand/30">
                          <p className="text-sm font-semibold text-dark">{user?.name}</p>
                          <p className="text-xs text-dark/50">{user?.email}</p>
                        </div>

                        <Link to="/mi-cuenta/overview" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:bg-sand/30 transition-colors">
                          <User className="w-4 h-4" />
                          Mi cuenta
                          {hasNotifications && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-error" />
                          )}
                        </Link>
                        <Link to="/mi-cuenta/mis-cursos" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:bg-sand/30 transition-colors">
                          <BookOpen className="w-4 h-4" /> Mis cursos
                        </Link>

                        {user?.role === 'admin' && (
                          <>
                            <Link to={isAdminView ? '/' : '/admin/overview'} onClick={() => { toggleAdminView(); setProfileOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:bg-sand/30 transition-colors">
                              {isAdminView ? <Store className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                              {isAdminView ? 'Vista Cliente' : 'Panel Admin'}
                            </Link>
                            {!isAdminView && (
                              <Link to="/admin/overview" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark/70 hover:bg-sand/30 transition-colors">
                                <GraduationCap className="w-4 h-4" /> Modo Instructor
                              </Link>
                            )}
                          </>
                        )}

                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Cerrar sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-glow hover:bg-secondary hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Ingresar
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-sand/50 transition-colors"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-sand/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-dark/70 hover:bg-sand/30 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white text-center mt-4"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-dark/40 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar productos, cursos..."
                  className="w-full rounded-3xl bg-white py-4 pl-12 pr-4 text-lg shadow-soft border border-sand/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-sand/50">
                  <X className="w-5 h-5 text-dark/40" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-dark/40 backdrop-blur-sm"
              onClick={() => setCartDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-sand/50">
                <h2 className="font-display text-xl">Tu carrito</h2>
                <button onClick={() => setCartDrawerOpen(false)} className="p-2 rounded-full hover:bg-sand/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto text-dark/20 mb-4" />
                    <p className="text-dark/60">Tu carrito está vacío</p>
                    <Link to="/productos" onClick={() => setCartDrawerOpen(false)} className="inline-block mt-4 text-primary hover:underline text-sm">
                      Ver productos
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl bg-sand/20 p-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                        <p className="text-sm text-primary font-semibold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs hover:bg-sand transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs hover:bg-sand transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => useCartStore.getState().removeItem(item.id)}
                            className="ml-auto text-xs text-error hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-sand/50 px-6 py-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60">Subtotal</span>
                    <span className="font-medium">{formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-display font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="block w-full rounded-2xl bg-primary py-3 text-center text-sm font-medium text-white shadow-glow hover:bg-secondary transition-colors active:scale-[0.98]"
                  >
                    Finalizar compra
                  </Link>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="block w-full text-center text-sm text-dark/60 hover:text-dark transition-colors"
                  >
                    Seguir comprando
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

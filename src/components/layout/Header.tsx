import { useCallback, useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu, X, Search, User, Heart, BookOpen, LayoutDashboard,
  LogOut, ChevronDown, GraduationCap, Store, Minus, Plus
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { cn, formatPrice } from '../../lib/utils';
import { useDeliveredNotifications } from '../../hooks/useDeliveredNotifications';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'FAQ', href: '/preguntas-frecuentes' },
];

const iconButton =
  'grid size-11 shrink-0 place-items-center rounded-full text-dark/75 transition-colors hover:bg-sand/40 hover:text-dark';

const menuItem =
  'flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-dark/75 transition-colors hover:bg-mist hover:text-dark';

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-sand/50 text-dark' : 'text-dark/65 hover:bg-sand/30 hover:text-dark',
  );

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors',
    isActive ? 'bg-sand/50 text-dark' : 'text-dark/75 hover:bg-mist hover:text-dark',
  );

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
 * The cart drawer declares aria-modal, so it has to behave like a modal: focus moves into it when it opens,
 * Tab cycles inside it, Escape closes it, and focus goes back to whatever opened it (or to the fallback).
 * `onClose` must be stable, otherwise the effect would re-run, and steal focus, on every render.
 */
function useDrawerFocus(
  open: boolean,
  drawerRef: RefObject<HTMLElement | null>,
  fallbackRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const drawer = drawerRef.current;
    const fallback = fallbackRef.current;
    if (!open || !drawer) return;

    // Safari does not focus a button on click, so fall back to the cart button when nothing meaningful has focus
    const active = document.activeElement;
    const opener = active instanceof HTMLElement && active !== document.body ? active : fallback;
    drawer.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = drawer.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!drawer.contains(current) || (e.shiftKey && current === first)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // The opener can be gone by now (e.g. a toast action button), so check before using it
      (opener?.isConnected ? opener : fallback)?.focus({ preventScroll: true });
    };
  }, [open, drawerRef, fallbackRef, onClose]);
}

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
  const { pathname } = useLocation();

  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const cartDrawerRef = useRef<HTMLElement>(null);

  const cartCount = getItemCount();
  const cartTotal = getTotal();

  const closeCart = useCallback(() => setCartDrawerOpen(false), [setCartDrawerOpen]);
  useDrawerFocus(cartDrawerOpen, cartDrawerRef, cartButtonRef, closeCart);

  // Any navigation (a link, the back button, code) leaves the mobile menu closed. Do not add the menu's
  // own state to these dependencies: the effect would close the menu right after it opens
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Escape closes the profile dropdown, then the mobile menu, and hands focus back to the button that opened
  // it. While the cart drawer is open it owns Escape (see useDrawerFocus)
  useEffect(() => {
    if (cartDrawerOpen || (!profileOpen && !mobileMenuOpen)) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (profileOpen) {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      } else {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [cartDrawerOpen, profileOpen, mobileMenuOpen, setMobileMenuOpen]);

  // A press anywhere outside the profile dropdown (and its button) closes it
  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-sand/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            aria-label="BS Papelería, ir al inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="flex shrink-0 items-center rounded-xl"
          >
            <img src="/brand/logo.webp" alt="BS Papelería" width={1000} height={674} className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} to={link.href} end={link.href === '/'} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconButton}
              aria-label="Buscar"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            {isAuthenticated && (
              <Link to="/mi-cuenta/wishlist" className={cn(iconButton, 'max-sm:hidden')} aria-label="Wishlist">
                <Heart className="size-5" aria-hidden="true" />
              </Link>
            )}

            <button
              ref={cartButtonRef}
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className={cn(iconButton, 'relative')}
              aria-label={cartCount > 0 ? `Carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}` : 'Carrito'}
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-dark px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  ref={profileButtonRef}
                  type="button"
                  onClick={() => { setProfileOpen(!profileOpen); if (!profileOpen && hasNotifications) dismissAll(); }}
                  aria-expanded={profileOpen}
                  aria-label={hasNotifications ? 'Menú de cuenta, hay novedades' : 'Menú de cuenta'}
                  className="flex h-11 items-center gap-1 rounded-full p-1 transition-colors hover:bg-sand/40 sm:pr-2.5"
                >
                  <span className="relative">
                    <img
                      src={user?.avatar ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name ?? 'U')}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover ring-2 ring-sand"
                    />
                    {hasNotifications && (
                      <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-rose-500" />
                    )}
                  </span>
                  <ChevronDown
                    className={cn('size-4 text-dark/60 transition-transform max-sm:hidden', profileOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-64 rounded-3xl border border-sand/60 bg-white p-2 shadow-lift"
                    >
                      <div className="border-b border-sand/60 px-3 pb-3 pt-2">
                        <p className="truncate font-display text-sm font-semibold text-dark">{user?.name}</p>
                        <p className="truncate text-xs text-dark/65">{user?.email}</p>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <Link to="/mi-cuenta/overview" onClick={() => setProfileOpen(false)} className={menuItem}>
                          <User className="size-4" aria-hidden="true" />
                          Mi cuenta
                          {hasNotifications && (
                            <>
                              <span className="ml-auto size-2 rounded-full bg-rose-500" aria-hidden="true" />
                              <span className="sr-only">Tenés novedades</span>
                            </>
                          )}
                        </Link>
                        <Link to="/mi-cuenta/mis-cursos" onClick={() => setProfileOpen(false)} className={menuItem}>
                          <BookOpen className="size-4" aria-hidden="true" /> Mis cursos
                        </Link>

                        {user?.role === 'admin' && (
                          <>
                            <Link to={isAdminView ? '/' : '/admin/overview'} onClick={() => { toggleAdminView(); setProfileOpen(false); }} className={menuItem}>
                              {isAdminView ? <Store className="size-4" aria-hidden="true" /> : <LayoutDashboard className="size-4" aria-hidden="true" />}
                              {isAdminView ? 'Vista Cliente' : 'Panel Admin'}
                            </Link>
                            {!isAdminView && (
                              <Link to="/admin/overview" onClick={() => setProfileOpen(false)} className={menuItem}>
                                <GraduationCap className="size-4" aria-hidden="true" /> Modo Instructor
                              </Link>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mt-2 border-t border-sand/60 pt-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
                        >
                          <LogOut className="size-4" aria-hidden="true" /> Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm min-h-11 max-sm:hidden">
                Ingresar
              </Link>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(iconButton, 'lg:hidden')}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu: floats over the page under the sticky header, so it is visible at any scroll position */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full px-4 pt-2 sm:px-6 lg:hidden"
            >
              <nav
                aria-label="Menú móvil"
                className="mx-auto max-h-[calc(100dvh-6rem)] max-w-7xl overflow-y-auto rounded-3xl border border-sand/60 bg-white p-3 shadow-lift"
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-lg mt-3 w-full"
                  >
                    Ingresar
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu scrim (sits under the header so the menu stays on top) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-dark/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-dark/45 px-4 pt-24 backdrop-blur-sm sm:pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} role="search" className="relative rounded-3xl shadow-lift">
                <label htmlFor="header-search" className="sr-only">
                  Buscar productos y cursos
                </label>
                <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-dark/55" aria-hidden="true" />
                <input
                  id="header-search"
                  autoFocus
                  type="text"
                  enterKeyHint="search"
                  autoComplete="off"
                  placeholder="Buscar productos, cursos..."
                  className="field h-16 rounded-3xl border-sand/60 pl-14 pr-16 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Cerrar búsqueda"
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-dark/60 transition-colors hover:bg-sand/40 hover:text-dark"
                >
                  <X className="size-5" aria-hidden="true" />
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
              className="fixed inset-0 z-[60] bg-dark/45 backdrop-blur-sm"
              onClick={() => setCartDrawerOpen(false)}
            />
            <motion.aside
              ref={cartDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-drawer-title"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-lift sm:rounded-l-3xl"
            >
              <div className="flex items-center justify-between border-b border-sand/60 px-6 py-4">
                <h2 id="cart-drawer-title" className="font-display text-xl font-semibold text-dark">Tu carrito</h2>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className={iconButton}
                  aria-label="Cerrar carrito"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <span className="grid size-20 place-items-center rounded-full bg-mist text-iris">
                      <ShoppingCart className="size-9" aria-hidden="true" />
                    </span>
                    <p className="mt-5 font-display text-lg font-semibold text-dark">Tu carrito está vacío</p>
                    <Link to="/productos" onClick={() => setCartDrawerOpen(false)} className="btn btn-soft mt-6">
                      Ver productos
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-4 rounded-2xl bg-mist p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="size-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-dark">{item.name}</p>
                          <p className="mt-0.5 font-display text-sm font-bold text-dark">{formatPrice(item.price)}</p>
                          <div className="mt-1 flex items-center">
                            <button
                              type="button"
                              onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Quitar una unidad de ${item.name}`}
                              className="group grid size-11 place-items-center rounded-full"
                            >
                              <span className="grid size-8 place-items-center rounded-full bg-white text-dark ring-1 ring-sand transition-colors group-hover:bg-sand/50">
                                <Minus className="size-4" aria-hidden="true" />
                              </span>
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-dark">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Agregar una unidad de ${item.name}`}
                              className="group grid size-11 place-items-center rounded-full"
                            >
                              <span className="grid size-8 place-items-center rounded-full bg-white text-dark ring-1 ring-sand transition-colors group-hover:bg-sand/50">
                                <Plus className="size-4" aria-hidden="true" />
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => useCartStore.getState().removeItem(item.id)}
                              aria-label={`Eliminar ${item.name} del carrito`}
                              className="ml-auto inline-flex min-h-11 items-center px-2 text-xs font-medium text-rose-700 hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="space-y-4 border-t border-sand/60 px-6 py-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/65">Subtotal</span>
                    <span className="font-medium text-dark">{formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg font-semibold text-dark">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn btn-primary btn-lg w-full"
                  >
                    Finalizar compra
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn btn-ghost w-full"
                  >
                    Seguir comprando
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

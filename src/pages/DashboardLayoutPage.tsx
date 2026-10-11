import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Package, ShoppingBag, Heart,
  User, MapPin, Bell, LogOut, type LucideIcon
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { PageHeader, type Crumb } from '../components/shared/PageHeader';
import { DeliveredOrdersBanner } from '../components/shared/DeliveredOrdersBanner';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

const OVERVIEW_PATH = '/mi-cuenta/overview';

const navItems: { to: string; label: string; icon: LucideIcon; description: string }[] = [
  { to: OVERVIEW_PATH, label: 'Resumen', icon: LayoutDashboard, description: 'Este es tu resumen de actividad' },
  { to: '/mi-cuenta/mis-cursos', label: 'Mis cursos', icon: BookOpen, description: 'Retomá tus cursos donde los dejaste' },
  { to: '/mi-cuenta/mis-productos', label: 'Mis productos', icon: Package, description: 'Tus descargables y productos físicos' },
  { to: '/mi-cuenta/pedidos', label: 'Pedidos', icon: ShoppingBag, description: 'El historial de tus compras' },
  { to: '/mi-cuenta/wishlist', label: 'Wishlist', icon: Heart, description: 'Lo que guardaste para más adelante' },
  { to: '/mi-cuenta/perfil', label: 'Perfil', icon: User, description: 'Tus datos personales' },
  { to: '/mi-cuenta/direcciones', label: 'Direcciones', icon: MapPin, description: 'Dónde recibís tus pedidos' },
  { to: '/mi-cuenta/notificaciones', label: 'Notificaciones', icon: Bell, description: 'Novedades de tus pedidos y cursos' },
];

// Sidebar rows (from lg): 44px tall, the current page is a sand pill with an iris icon
const sideLinkClass = (active: boolean) =>
  cn(
    'flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors',
    active ? 'bg-sand/50 font-semibold text-dark' : 'text-dark/75 hover:bg-mist hover:text-dark',
  );

// Pill row (below lg): same pill language as the FAQ filters
const pillClass = (active: boolean) =>
  cn(
    'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors',
    active ? 'bg-dark text-white shadow-soft' : 'bg-white text-dark/75 ring-1 ring-sand hover:text-dark hover:ring-secondary',
  );

export default function DashboardLayoutPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const pillListRef = useRef<HTMLUListElement>(null);

  const current = navItems.find((item) => item.to === pathname);
  const firstName = user?.name?.split(' ')[0];

  const crumbs: Crumb[] = [{ label: 'Inicio', to: '/' }];
  if (current && current.to !== OVERVIEW_PATH) {
    crumbs.push({ label: 'Mi cuenta', to: OVERVIEW_PATH }, { label: current.label });
  } else {
    crumbs.push({ label: 'Mi cuenta' });
  }

  // On small screens the pill row scrolls: bring the current page into view, without scrolling the page itself
  useEffect(() => {
    const list = pillListRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SEO title="Mi cuenta" />
      <PageHeader
        title={firstName ? `Hola, ${firstName}` : 'Mi cuenta'}
        crumbs={crumbs}
        description={current?.description ?? 'Gestioná tu cuenta'}
      />

      {/* Below lg: the sections as a pill row that scrolls on its own */}
      <nav aria-label="Secciones de mi cuenta" className="border-b border-sand/60 bg-white lg:hidden">
        <ul
          ref={pillListRef}
          className="relative mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to} className="shrink-0">
                <Link to={item.to} aria-current={active ? 'page' : undefined} className={pillClass(active)}>
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="shrink-0 border-l border-sand pl-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          {/* From lg: sticky sidebar card */}
          <nav aria-label="Mi cuenta" className="hidden lg:block">
            <div className="card p-3 lg:sticky lg:top-24">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link to={item.to} aria-current={active ? 'page' : undefined} className={sideLinkClass(active)}>
                        <item.icon className={cn('size-5 shrink-0', active ? 'text-iris' : 'text-dark/65')} aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 border-t border-sand/60 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="size-5 shrink-0" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </nav>

          <div className="min-w-0">
            <DeliveredOrdersBanner />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

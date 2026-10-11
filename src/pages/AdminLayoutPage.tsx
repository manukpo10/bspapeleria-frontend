import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, BookOpen, ShoppingBag, Users, Tag, Settings,
  LogOut, Store, Menu, X, type LucideIcon
} from 'lucide-react';
import { Dialog } from '../components/shared/Dialog';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

const navItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/admin/overview', label: 'Resumen', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/cupones', label: 'Cupones', icon: Tag },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

// The builders are not in the menu: they take their own title, and the menu keeps their section lit
const builderTitles = [
  { path: '/admin/productos/nuevo', title: 'Nuevo producto' },
  { path: '/admin/productos/:id/builder', title: 'Editar producto' },
  { path: '/admin/cursos/nuevo', title: 'Nuevo curso' },
  { path: '/admin/cursos/:id/builder', title: 'Editar curso' },
];

// Rows of the sidebar and the drawer: 44px tall, the current section is a sand pill with an iris icon
const rowClass = (active: boolean) =>
  cn(
    'flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors',
    active ? 'bg-sand/50 font-semibold text-dark' : 'text-dark/75 hover:bg-mist hover:text-dark',
  );

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/" onClick={onNavigate} aria-label="BS Papelería, ir a la tienda" className="inline-flex rounded-xl">
      <img src="/brand/logo.webp" alt="BS Papelería" width={1000} height={674} className="h-12 w-auto" />
    </Link>
  );
}

function SectionLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const exact = pathname === item.to;
        const active = exact || pathname.startsWith(`${item.to}/`);
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              aria-current={exact ? 'page' : active ? 'true' : undefined}
              className={rowClass(active)}
            >
              <item.icon className={cn('size-5 shrink-0', active ? 'text-iris' : 'text-dark/65')} aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FooterLinks({ onLogout, onNavigate }: { onLogout: () => void; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      <li>
        <Link to="/" onClick={onNavigate} className={rowClass(false)}>
          <Store className="size-5 shrink-0 text-dark/65" aria-hidden="true" />
          Ver tienda
        </Link>
      </li>
      <li>
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
        >
          <LogOut className="size-5 shrink-0" aria-hidden="true" />
          Cerrar sesión
        </button>
      </li>
    </ul>
  );
}

export default function AdminLayoutPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  // The drawer remembers the page it was opened on, so any navigation (a link, the back button) leaves it closed
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;
  // Back/Forward onto the page the drawer was opened on would reopen it, so drop the stale value on any path change
  if (menuOpenOn !== null && menuOpenOn !== pathname) setMenuOpenOn(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const builder = builderTitles.find((b) => matchPath({ path: b.path, end: true }, pathname));
  const title = builder?.title ?? navItems.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))?.label ?? 'Panel';
  const adminName = user?.name ?? 'Admin';

  return (
    <div className="min-h-dvh bg-mist">
      <Helmet>
        <title>{`${title} | Admin BS Papelería`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[100] -translate-y-32 rounded-full bg-dark px-5 py-3 text-sm font-semibold text-white shadow-lift transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      {/* From lg: fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sand/60 bg-white lg:flex">
        <div className="px-5 pb-2 pt-4">
          <Logo />
        </div>
        <nav aria-label="Panel de administración" className="flex-1 overflow-y-auto px-3 py-3">
          <SectionLinks pathname={pathname} />
        </nav>
        <div className="border-t border-sand/60 p-3">
          <FooterLinks onLogout={handleLogout} />
        </div>
      </aside>

      {/* Below lg: the same navigation as a drawer */}
      <Dialog
        open={menuOpen}
        onClose={() => setMenuOpenOn(null)}
        labelledBy="admin-menu-title"
        placement="left"
        scrimClassName="lg:hidden"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <Logo onNavigate={() => setMenuOpenOn(null)} />
          <h2 id="admin-menu-title" className="sr-only">
            Menú del panel
          </h2>
          <button
            type="button"
            onClick={() => setMenuOpenOn(null)}
            aria-label="Cerrar menú"
            className="grid size-11 place-items-center rounded-full text-dark/75 transition-colors hover:bg-sand/40 hover:text-dark"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Panel de administración" className="flex-1 px-3 py-3">
          <SectionLinks pathname={pathname} onNavigate={() => setMenuOpenOn(null)} />
        </nav>
        <div className="border-t border-sand/60 p-3">
          <FooterLinks onLogout={handleLogout} onNavigate={() => setMenuOpenOn(null)} />
        </div>
      </Dialog>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-sand/60 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpenOn(pathname)}
              aria-label="Abrir menú"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-dark/75 transition-colors hover:bg-sand/40 hover:text-dark lg:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>

            <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold tracking-tight text-dark sm:text-2xl">{title}</h1>

            <div className="flex shrink-0 items-center gap-2.5">
              {user?.avatar ? (
                <img src={user.avatar} alt="" width={36} height={36} className="size-9 rounded-full object-cover ring-2 ring-mist" />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-full bg-mist font-display text-sm font-bold text-iris"
                >
                  {adminName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="max-w-40 truncate text-sm font-medium text-dark max-sm:sr-only">{adminName}</span>
            </div>
          </div>
        </header>

        <main id="contenido" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, BookOpen, ShoppingBag, Users, Tag, Settings,
  ChevronRight, LogOut, Store, User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/cupones', label: 'Cupones', icon: Tag },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayoutPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-dark text-white">
      <aside className="w-64 bg-dark border-r border-white/10 p-4 hidden lg:flex flex-col">
        <div className="mb-6 px-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl font-semibold text-white group-hover:text-primary transition-colors">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-error/10 hover:text-error transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-lg font-semibold text-white">
            Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors">
              <Store className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-white/60 hover:bg-error/10 hover:text-error transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <nav className="flex gap-1 p-2">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'text-white/60 hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 p-4 lg:p-8 lg:pt-4 pt-28">
        {/* Desktop header bar */}
        <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              {navItems.find((i) => i.to === pathname)?.label ?? 'Panel'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <User className="w-4 h-4" />
              <span>{user?.name ?? 'Admin'}</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Store className="w-3 h-3" /> Tienda
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:bg-error/10 hover:text-error transition-colors"
            >
              <LogOut className="w-3 h-3" /> Salir
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

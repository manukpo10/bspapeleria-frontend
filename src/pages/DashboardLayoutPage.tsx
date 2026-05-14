import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Package, ShoppingBag, Heart,
  User, MapPin, Bell, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/mi-cuenta/overview', label: 'Resumen', icon: LayoutDashboard },
  { to: '/mi-cuenta/mis-cursos', label: 'Mis Cursos', icon: BookOpen },
  { to: '/mi-cuenta/mis-productos', label: 'Mis Productos', icon: Package },
  { to: '/mi-cuenta/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/mi-cuenta/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/mi-cuenta/perfil', label: 'Perfil', icon: User },
  { to: '/mi-cuenta/direcciones', label: 'Direcciones', icon: MapPin },
  { to: '/mi-cuenta/notificaciones', label: 'Notificaciones', icon: Bell },
];

export default function DashboardLayoutPage() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-sand/20 border-r border-sand/50 p-4 hidden lg:block">
        <nav className="space-y-1 sticky top-24">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-dark/70 hover:bg-sand/50 hover:text-dark'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden w-full border-b border-sand/50 bg-white overflow-x-auto">
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
                    : 'text-dark/70 hover:bg-sand/50'
                )}
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 p-4 lg:p-8 bg-white">
        <Outlet />
      </main>
    </div>
  );
}

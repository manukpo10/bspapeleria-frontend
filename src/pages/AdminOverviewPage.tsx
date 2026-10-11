import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ShoppingBag, DollarSign, Package, Plus, type LucideIcon } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';

const quickLinks: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/admin/productos/nuevo', label: 'Nuevo producto', icon: Plus },
  { to: '/admin/cursos/nuevo', label: 'Nuevo curso', icon: Plus },
  { to: '/admin/pedidos', label: 'Revisar pedidos', icon: ShoppingBag },
  { to: '/admin/productos', label: 'Ver productos', icon: Package },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalSales: 0, newStudents: 0, activeCourses: 0, productsSold: 0 });

  useEffect(() => {
    api.getAdminStats().then(setStats);
  }, []);

  const tiles: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: 'Ventas totales', value: formatPrice(stats.totalSales), icon: DollarSign },
    { label: 'Nuevos estudiantes', value: stats.newStudents, icon: Users },
    { label: 'Cursos activos', value: stats.activeCourses, icon: BookOpen },
    { label: 'Productos vendidos', value: stats.productsSold, icon: ShoppingBag },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <section aria-labelledby="overview-kpis">
        <h2 id="overview-kpis" className="sr-only">
          Números de la tienda
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile) => (
            <li key={tile.label} className="card p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-mist text-iris">
                <tile.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-2xl font-bold text-dark">{tile.value}</p>
              <p className="mt-0.5 text-sm text-dark/65">{tile.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="overview-shortcuts" className="card p-6 sm:p-8">
        <h2 id="overview-shortcuts" className="font-display text-xl font-semibold text-dark">
          Accesos rápidos
        </h2>
        <p className="mt-1 text-sm text-dark/65">Lo que más se usa en el día a día de la tienda.</p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <li key={link.to + link.label}>
              <Link to={link.to} className="btn btn-soft w-full justify-start">
                <link.icon className="size-5 shrink-0 text-iris" aria-hidden="true" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

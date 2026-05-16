import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice } from '../lib/utils';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalSales: 0, newStudents: 0, activeCourses: 0, productsSold: 0 });

  useEffect(() => {
    api.getAdminStats().then(setStats);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas totales', value: formatPrice(stats.totalSales), icon: DollarSign, color: 'bg-primary/20 text-primary' },
          { label: 'Nuevos estudiantes', value: stats.newStudents, icon: Users, color: 'bg-secondary/20 text-secondary' },
          { label: 'Cursos activos', value: stats.activeCourses, icon: BookOpen, color: 'bg-accent/20 text-accent' },
          { label: 'Productos vendidos', value: stats.productsSold, icon: ShoppingBag, color: 'bg-success/20 text-success' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-display font-semibold text-white">{stat.value}</p>
            <p className="text-xs text-white/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

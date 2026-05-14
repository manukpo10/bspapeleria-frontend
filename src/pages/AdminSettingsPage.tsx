import { motion } from 'framer-motion';
import { Palette, Globe, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-white">Configuración</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-display font-medium text-white">Apariencia</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">Configuración de marca y colores.</p>
          <button onClick={() => toast.info('Configuración guardada')} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors">
            Guardar
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-medium text-white">General</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">Nombre de la tienda, contacto y más.</p>
          <button onClick={() => toast.info('Configuración guardada')} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors">
            Guardar
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="font-display font-medium text-white">Notificaciones</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">Configuración de emails y alertas.</p>
          <button onClick={() => toast.info('Configuración guardada')} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary transition-colors">
            Guardar
          </button>
        </motion.div>
      </div>
    </div>
  );
}

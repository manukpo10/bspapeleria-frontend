import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, HeadphonesIcon, Star, Award } from 'lucide-react';

const trusts = [
  { icon: Truck, label: 'Envío gratis', sublabel: 'En compras +$15.000' },
  { icon: ShieldCheck, label: 'Pagos seguros', sublabel: 'Mercado Pago' },
  { icon: RotateCcw, label: 'Devolución', sublabel: 'Hasta 30 días' },
  { icon: HeadphonesIcon, label: 'Soporte', sublabel: 'Lun a Vie 9-18hs' },
  { icon: Star, label: '4.9/5', sublabel: '200+ reseñas' },
  { icon: Award, label: 'Calidad', sublabel: 'Materiales premium' },
];

export function TrustStrip() {
  return (
    <section className="py-8 bg-white border-y border-sand/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {trusts.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <t.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark leading-tight">{t.label}</p>
                <p className="text-xs text-dark/50 leading-tight">{t.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

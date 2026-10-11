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
    <section aria-label="Por qué comprar en BS Papelería" className="border-y border-sand/60 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {trusts.map((t) => (
            <li key={t.label} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mist text-iris">
                <t.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-dark">{t.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-dark/65">{t.sublabel}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

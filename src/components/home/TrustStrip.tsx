import { Sprout, InfinityIcon, HeartHandshake, Users, MonitorPlay, RefreshCw } from 'lucide-react';
import { RevealGroup, RevealItem } from '../shared/Reveal';

const trusts = [
  { icon: Sprout, label: 'Aprendé desde cero' },
  { icon: InfinityIcon, label: 'Acceso de por vida' },
  { icon: HeartHandshake, label: 'Acompañamiento' },
  { icon: Users, label: 'Comunidad de alumnas' },
  { icon: MonitorPlay, label: 'Clases grabadas' },
  { icon: RefreshCw, label: 'Actualizaciones gratuitas' },
];

export function TrustStrip() {
  return (
    <section aria-label="Beneficios de aprender con BS Papelería" className="border-y border-sand/60 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          Titles only, and "Actualizaciones" is a long word, so each width has its own arrangement: two compact
          icon-beside-text columns on phones, three from sm, six with the icon above the text from lg (the 6
          columns are too narrow for an icon beside the text)
        */}
        <RevealGroup
          as="ul"
          stagger={0.07}
          className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 lg:grid-cols-6 lg:gap-x-6"
        >
          {trusts.map((t) => (
            <RevealItem
              key={t.label}
              as="li"
              variant="pop"
              className="flex items-center gap-2 sm:gap-3 lg:flex-col lg:gap-2.5 lg:text-center"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist text-iris sm:size-11 sm:rounded-2xl">
                <t.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-xs font-semibold leading-tight text-dark wrap-break-word text-balance sm:text-sm">
                {t.label}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

import { useMemo } from 'react';
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL } from '../../lib/constants';

const COORDS: [number, number] = [-34.8500, -58.0833];

const contactItems = [
  {
    icon: MapPin,
    label: 'Dirección',
    lines: ['Bosques, La Plata, Buenos Aires', '(a 10 minutos de Villa Elisa)'],
    href: null,
  },
  {
    icon: Clock,
    label: 'Horarios',
    lines: ['Lunes a Viernes: 9:00 a 18:00hs', 'Sábados: 10:00 a 14:00hs', 'Domingos: Cerrado'],
    href: null,
  },
  {
    icon: Phone,
    label: 'Teléfono',
    lines: [PHONE_DISPLAY],
    href: PHONE_HREF,
  },
  {
    icon: Mail,
    label: 'Email',
    lines: ['hola@bspapeleria.com'],
    href: 'mailto:hola@bspapeleria.com',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    lines: ['Escribinos por WhatsApp'],
    href: WHATSAPP_URL,
  },
];

export function VisitUsSection() {
  const directionsUrl = useMemo(() => {
    return `https://www.google.com/maps/dir/?api=1&destination=${COORDS[0]},${COORDS[1]}`;
  }, []);

  const staticMapUrl = `https://maps.google.com/maps?q=${COORDS[0]},${COORDS[1]}&z=14&output=embed`;

  return (
    <section aria-labelledby="visit-heading" className="bg-mist py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Encontranos</p>
          <h2 id="visit-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Visitanos en nuestro local
          </h2>
          <p className="mt-4 text-dark/75">
            Te esperamos en nuestro local de Bosques para que conozcas nuestros productos de cerca,
            retires tus pedidos o nos consultes lo que necesites.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Contact info */}
          <div className="card p-6 sm:p-8">
            <ul className="space-y-6">
              {contactItems.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mist text-iris">
                    <item.icon className="size-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark">{item.label}</p>
                    {item.lines.map((line, j) => {
                      const external = item.href?.startsWith('http');
                      return (
                        <p key={j} className="text-sm text-dark/75">
                          {item.href ? (
                            <a
                              href={item.href}
                              target={external ? '_blank' : undefined}
                              rel={external ? 'noopener noreferrer' : undefined}
                              className="inline-flex min-h-11 items-center font-medium text-iris hover:underline"
                            >
                              {line}
                              {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-sand/60 pt-6">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MapPin className="size-4" aria-hidden="true" /> Cómo llegar
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <a href={PHONE_HREF} className="btn btn-secondary">
                <Phone className="size-4" aria-hidden="true" /> Llamanos
              </a>
            </div>
          </div>

          {/* Google Maps embed (no dependency) */}
          <div className="relative h-[22rem] overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-sand/70 sm:h-[32rem] lg:h-auto lg:min-h-[32rem]">
            <iframe
              src={staticMapUrl}
              className="absolute inset-0 size-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación BS Papelería"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

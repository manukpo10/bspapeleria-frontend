import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';

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
    lines: ['+54 11 1234-5678'],
    href: 'tel:+541112345678',
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
    href: 'https://wa.me/5491112345678',
  },
];

export function VisitUsSection() {
  const directionsUrl = useMemo(() => {
    return `https://www.google.com/maps/dir/?api=1&destination=${COORDS[0]},${COORDS[1]}`;
  }, []);

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${COORDS[0]},${COORDS[1]}&zoom=14`;
  const staticMapUrl = `https://maps.google.com/maps?q=${COORDS[0]},${COORDS[1]}&z=14&output=embed`;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="block font-script text-2xl text-secondary mb-2">encontranos</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark mb-4">
            Visitanos en nuestro local
          </h2>
          <p className="text-dark/60 max-w-xl">
            Te esperamos en nuestro local de Bosques para que conozcas nuestros productos de cerca,
            retires tus pedidos o nos consultes lo que necesites.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left column — Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark mb-0.5">{item.label}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm text-dark/60">
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="hover:text-primary transition-colors"
                        >
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary hover:shadow-glow transition-all active:scale-[0.98]"
              >
                <MapPin className="w-4 h-4" /> Cómo llegar
              </a>
              <a
                href="tel:+541112345678"
                className="inline-flex items-center gap-2 rounded-2xl border border-sand px-6 py-3 text-sm font-medium text-dark hover:bg-sand/30 transition-colors"
              >
                <Phone className="w-4 h-4" /> Llamanos
              </a>
            </motion.div>
          </motion.div>

          {/* Right column — Google Maps embed (no dependency) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl overflow-hidden border border-sand shadow-[0_20px_60px_rgba(152,172,248,0.15)] h-[350px] sm:h-[500px]"
          >
            <iframe
              src={staticMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación BS Papelería"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

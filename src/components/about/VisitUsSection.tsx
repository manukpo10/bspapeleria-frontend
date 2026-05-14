import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const COORDS: [number, number] = [-34.8500, -58.0833];

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative;">
      <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
        <path d="M24 0C10.745 0 0 10.745 0 24c0 16 24 36 24 36s24-20 24-36C48 10.745 37.255 0 24 0z" 
              fill="#98acf8" 
              filter="drop-shadow(0 4px 8px rgba(152,172,248,0.4))"/>
        <circle cx="24" cy="22" r="8" fill="#da9ff9"/>
        <circle cx="24" cy="22" r="4" fill="white"/>
      </svg>
      <div class="marker-pulse"></div>
    </div>
  `,
  iconSize: [48, 60],
  iconAnchor: [24, 60],
  popupAnchor: [0, -60],
});

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
  const mapRef = useRef<any>(null);

  const directionsUrl = useMemo(() => {
    return `https://www.google.com/maps/dir/?api=1&destination=${COORDS[0]},${COORDS[1]}`;
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative blob */}
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

            {/* CTAs */}
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

          {/* Right column — Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl overflow-hidden border border-sand shadow-[0_20px_60px_rgba(152,172,248,0.15)] h-[350px] sm:h-[500px]"
          >
            <MapContainer
              center={COORDS}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={COORDS} icon={customIcon}>
                <Popup>
                  <div className="text-center py-2">
                    <p className="font-display font-bold text-dark text-sm mb-1">BS Papelería</p>
                    <p className="text-dark/60 text-xs mb-2">Bosques, La Plata</p>
                    <p className="text-dark/40 text-[11px] mb-3">Lun a Vie: 9-18hs · Sáb: 10-14hs</p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-secondary transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Cómo llegar
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </div>

      {/* Leaflet CSS pulse animation */}
      <style>{`
        .custom-marker .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 48px;
          height: 48px;
          border: 2px solid #98acf8;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: markerPulse 2s infinite;
          pointer-events: none;
        }
        @keyframes markerPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

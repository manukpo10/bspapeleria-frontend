import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PHONE_DISPLAY } from '../../lib/constants';

// lucide-react 1.x dropped brand icons, so these two glyphs are drawn here in the same stroke style
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const shopLinks = [
  { label: 'Productos', to: '/productos' },
  { label: 'Personalizados', to: '/productos?categoria=personalizados' },
  { label: 'Sublimables', to: '/productos?categoria=sublimables' },
  { label: 'Archivos Digitales', to: '/productos?categoria=archivos-digitales' },
];

const learnLinks = [
  { label: 'Todos los cursos', to: '/cursos' },
  { label: 'Para principiantes', to: '/cursos?level=principiante' },
  { label: 'Intermedio', to: '/cursos?level=intermedio' },
  { label: 'Avanzado', to: '/cursos?level=avanzado' },
];

const columnTitle = 'font-display text-sm font-semibold text-dark';
const footerLink =
  'flex min-h-11 w-fit items-center text-sm text-dark/65 transition-colors hover:text-iris lg:min-h-9';
const socialButton =
  'grid size-11 place-items-center rounded-full bg-white text-dark ring-1 ring-sand transition-colors hover:bg-sand/40 hover:text-iris';

export function Footer() {
  return (
    <footer className="bg-mist">
      <div aria-hidden="true" className="h-1.5 w-full bg-ribbon" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" aria-label="BS Papelería, ir al inicio" className="inline-block rounded-xl">
              <img src="/brand/logo.webp" alt="BS Papelería" width={1000} height={674} className="h-20 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-dark/65">
              Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos.
            </p>
            <div className="flex gap-3">
              <a href="#" className={socialButton} aria-label="Instagram">
                <InstagramIcon className="size-5" />
              </a>
              <a href="#" className={socialButton} aria-label="Facebook">
                <FacebookIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop" className={columnTitle}>Tienda</h2>
            <ul className="mt-3">
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-learn">
            <h2 id="footer-learn" className={columnTitle}>Aprendé</h2>
            <ul className="mt-3">
              {learnLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className={columnTitle}>Contacto</h2>
            <ul className="mt-4 space-y-4 text-sm text-dark/65">
              <li className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-iris ring-1 ring-sand">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 pt-1.5">La Plata, Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-iris ring-1 ring-sand">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <a href="mailto:hola@bspapeleria.com" className="min-w-0 break-words transition-colors hover:text-iris">hola@bspapeleria.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-iris ring-1 ring-sand">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <span>{PHONE_DISPLAY}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-sand/70 pt-6 text-xs text-dark/65 sm:flex-row sm:gap-4">
          <p>&copy; {new Date().getFullYear()} BS Papelería. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/" className="inline-flex min-h-11 items-center transition-colors hover:text-iris">Términos</Link>
            <Link to="/" className="inline-flex min-h-11 items-center transition-colors hover:text-iris">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

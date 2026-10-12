import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_URL } from '../../lib/constants';

// lucide-react 1.x dropped brand icons, so this glyph is drawn here in the same stroke style
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

const trainingLinks = [
  { label: 'Todos los cursos', to: '/cursos' },
  // These three are the courses published today
  { label: 'Agendas en PowerPoint', to: '/cursos/agendas-en-powerpoint' },
  { label: 'Etiquetas Escolares', to: '/cursos/etiquetas-escolares-en-powerpoint' },
  { label: 'Candy Bar', to: '/cursos/candy-bar-powerpoint' },
];

const brandLinks = [
  { label: 'Nuestra historia', to: '/nosotros' },
  { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
  { label: 'Productos personalizados', to: '/productos?categoria=personalizados' },
  { label: 'Recursos digitales', to: '/productos?categoria=archivos-digitales' },
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
        {/* Phones: the brand and contact span both columns, the two link lists sit side by side */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Brand */}
          <div className="col-span-2 space-y-5 md:col-span-1">
            <Link to="/" aria-label="BS Papelería, ir al inicio" className="inline-block rounded-xl">
              <img src="/brand/logo.webp" alt="BS Papelería" width={1000} height={674} className="h-20 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-dark/65">
              Creemos que toda gran idea merece una oportunidad. Por eso enseñamos, compartimos nuestra experiencia y acompañamos a quienes sueñan con crear su propio emprendimiento.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={socialButton}
              aria-label="Instagram (se abre en una pestaña nueva)"
            >
              <InstagramIcon className="size-5" />
            </a>
          </div>

          {/* Links */}
          <nav aria-labelledby="footer-training">
            <h2 id="footer-training" className={columnTitle}>Formación</h2>
            <ul className="mt-3">
              {trainingLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-brand">
            <h2 id="footer-brand" className={columnTitle}>BS Papelería</h2>
            <ul className="mt-3">
              {brandLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <nav aria-labelledby="footer-contact" className="col-span-2 md:col-span-1">
            <h2 id="footer-contact" className={columnTitle}>Contacto</h2>
            <ul className="mt-3">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={footerLink}>
                  WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={footerLink}>Correo electrónico</a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={footerLink}>
                  Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
              {/* TODO: add TikTok once its real URL is confirmed */}
            </ul>
          </nav>
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

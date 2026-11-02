import { MessageCircle } from 'lucide-react';
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL } from '../../lib/constants';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-8">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-8">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-8">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.3 0 .6.05.88.13v-3.5a6.37 6.37 0 0 0-.88-.06A6.34 6.34 0 0 0 2.75 15.5a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.02a8.16 8.16 0 0 0 4.78 1.53V7.11a4.85 4.85 0 0 1-.62-.42z"/>
  </svg>
);

// No follower counts: they were typed here by hand, so they would go stale. `note` is a second line under the handle
const networks = [
  {
    name: 'Instagram',
    handle: '@bspapeleria',
    note: null,
    url: INSTAGRAM_URL,
    color: '#E1306C',
    Icon: InstagramIcon,
  },
  {
    name: 'Facebook',
    handle: '/bspapeleria',
    note: null,
    url: 'https://facebook.com/bspapeleria',
    color: '#1877F2',
    Icon: FacebookIcon,
  },
  {
    name: 'TikTok',
    handle: '@bspapeleria',
    note: null,
    url: TIKTOK_URL,
    color: '#000000',
    Icon: TikTokIcon,
  },
  {
    name: 'WhatsApp',
    handle: 'Escribinos directo',
    note: 'Respondemos al toque',
    url: WHATSAPP_URL,
    color: '#25D366',
    Icon: () => <MessageCircle className="size-8" aria-hidden="true" />,
  },
];

export function SocialMediaSection() {
  return (
    <section aria-labelledby="social-heading" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Mantenete cerca</p>
          <h2 id="social-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Seguinos en nuestras redes
          </h2>
          <p className="mt-4 text-dark/75">
            Compartimos novedades, tips creativos, descuentos exclusivos y mucha inspiración. ¡Sumate a la comunidad!
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {networks.map((net) => {
            const Icon = net.Icon;
            return (
              <li key={net.name}>
                <a
                  href={net.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-hover group flex h-full flex-col items-center px-4 py-6 text-center"
                >
                  <span className="grid size-16 place-items-center rounded-2xl bg-mist text-iris transition-colors group-hover:bg-ribbon group-hover:text-dark">
                    <Icon />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-dark">{net.name}</span>
                  <span className="mt-1 text-xs text-dark/65">{net.handle}</span>
                  {net.note && <span className="mt-0.5 text-xs text-dark/65">{net.note}</span>}
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

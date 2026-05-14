import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.3 0 .6.05.88.13v-3.5a6.37 6.37 0 0 0-.88-.06A6.34 6.34 0 0 0 2.75 15.5a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.02a8.16 8.16 0 0 0 4.78 1.53V7.11a4.85 4.85 0 0 1-.62-.42z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
);

const networks = [
  {
    name: 'Instagram',
    handle: '@bspapeleria',
    followers: '12.5k seguidores',
    url: 'https://instagram.com/bspapeleria',
    color: '#E1306C',
    Icon: InstagramIcon,
  },
  {
    name: 'Facebook',
    handle: '/bspapeleria',
    followers: '8.2k me gusta',
    url: 'https://facebook.com/bspapeleria',
    color: '#1877F2',
    Icon: FacebookIcon,
  },
  {
    name: 'TikTok',
    handle: '@bspapeleria',
    followers: '5.8k seguidores',
    url: 'https://tiktok.com/@bspapeleria',
    color: '#000000',
    Icon: TikTokIcon,
  },
  {
    name: 'Pinterest',
    handle: '/bspapeleria',
    followers: '3.4k seguidores',
    url: 'https://pinterest.com/bspapeleria',
    color: '#E60023',
    Icon: PinterestIcon,
  },
  {
    name: 'WhatsApp',
    handle: 'Escribinos directo',
    followers: 'Respondemos al toque',
    url: 'https://wa.me/5491112345678',
    color: '#25D366',
    Icon: () => <MessageCircle className="w-10 h-10" />,
  },
];

export function SocialMediaSection() {
  return (
    <section className="py-20 bg-cream/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="block font-script text-2xl text-secondary mb-2">mantenete cerca</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark mb-4">
            Seguinos en nuestras redes
          </h2>
          <p className="text-dark/60 max-w-xl mx-auto">
            Compartimos novedades, tips creativos, descuentos exclusivos y mucha inspiración. ¡Sumate a la comunidad!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {networks.map((net, i) => {
            const Icon = net.Icon;
            return (
              <motion.a
                key={net.name}
                href={net.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white border border-sand p-5 sm:p-6 shadow-[0_4px_20px_rgba(152,172,248,0.08)] hover:shadow-[0_16px_40px_rgba(152,172,248,0.2)] hover:-translate-y-1.5 transition-all duration-300 aspect-square"
                style={{ '--hover-color': net.color } as React.CSSProperties}
              >
                <div className="text-dark/40 group-hover:text-[var(--hover-color)] transition-colors duration-250 mb-3">
                  <Icon />
                </div>
                <p className="text-sm font-semibold text-dark group-hover:text-[var(--hover-color)] transition-colors duration-250">
                  {net.name}
                </p>
                <p className="text-xs text-dark/50 mt-1">{net.handle}</p>
                <p className="text-[11px] text-dark/40 mt-0.5">{net.followers}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Outlet, useMatch } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  // The classroom sizes itself to the viewport below the header, so the promo bar would push it off screen
  const isClassroom = useMatch('/cursos/:slug/aprender') !== null;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[100] -translate-y-32 rounded-full bg-dark px-5 py-3 text-sm font-semibold text-white shadow-lift transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      {!isClassroom && <AnnouncementBar />}
      <Header />
      <main id="contenido" className="flex-1 scroll-mt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

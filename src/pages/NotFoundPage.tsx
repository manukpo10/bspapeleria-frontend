import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-dark/60 mb-8">Página no encontrada</p>
      <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white font-medium hover:bg-secondary transition-colors">
        <Home className="w-4 h-4" /> Volver al inicio
      </Link>
    </div>
  );
}

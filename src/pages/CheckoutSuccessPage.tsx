import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, BookOpen, ArrowRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';

export default function CheckoutSuccessPage() {
  return (
    <>
      <SEO title="Compra Exitosa" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-dark mb-3">¡Gracias por tu compra!</h1>
          <p className="text-dark/60 mb-8">
            Tu orden fue procesada correctamente. Encontrarás todos los detalles en tu cuenta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/mi-cuenta/pedidos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-glow hover:bg-secondary transition-colors"
            >
              <Package className="w-4 h-4" /> Ver pedidos
            </Link>
            <Link
              to="/mi-cuenta/mis-cursos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sand/50 px-6 py-3 text-sm font-medium text-dark hover:bg-sand transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Mis cursos
            </Link>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:underline">
            <ArrowRight className="w-4 h-4" /> Volver al inicio
          </Link>
        </motion.div>
      </div>
    </>
  );
}

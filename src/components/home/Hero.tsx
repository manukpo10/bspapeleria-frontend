import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1920&q=80"
          alt="Papelería creativa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/50 to-transparent" />
        <div className="absolute inset-0 grain" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm mb-2">
              <Sparkles className="w-4 h-4" />
              BS Papelería
            </span>
            <p className="text-sm text-white/60 mb-6 tracking-wide uppercase">Papelería boutique moderna</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6"
          >
            Creá con <span className="text-primary">estilo</span>,<br />
            <span className="font-script text-accent">aprendé con pasión</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed"
          >
            Productos personalizados, sublimables y cursos creativos para quienes buscan algo más que lo ordinario.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-white shadow-glow hover:bg-secondary hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Ver productos <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]"
            >
              Ver cursos
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

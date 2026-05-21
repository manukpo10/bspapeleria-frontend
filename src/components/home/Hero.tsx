import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
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

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[80px] pointer-events-none" />
      <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] rounded-full bg-secondary/10 blur-[60px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="max-w-xl">
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

          {/* Right visual — floating image collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Main image */}
              <div className="absolute top-[5%] left-[10%] w-[65%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://kpnukedjelyfoewpqwpr.supabase.co/storage/v1/object/public/product-images/home1.webp"
                  alt="Productos BS Papeleria"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Secondary image */}
              <div className="absolute bottom-[10%] right-[5%] w-[50%] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-[8deg] hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://kpnukedjelyfoewpqwpr.supabase.co/storage/v1/object/public/product-images/home2.webp"
                  alt="Productos BS Papeleria"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute top-[40%] right-[0%] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg rotate-[4deg]">
                <p className="text-xs text-dark/60 font-medium">Más de</p>
                <p className="text-2xl font-display font-bold text-primary">2.500</p>
                <p className="text-xs text-dark/60 font-medium">clientes felices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#cursos"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}

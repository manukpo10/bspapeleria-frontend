import { motion } from 'framer-motion';
import { Palette, Truck, Award, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Diseño Único',
    description: 'Cada producto es pensado con amor y diseñado para destacar. Nada de lo genérico.',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo el País',
    description: 'Llegamos a cada rincón de Argentina. Envío gratis en compras mayores a $15.000.',
  },
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Materiales de primera, impresión de alta definición y acabados impecables.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención Personalizada',
    description: 'Estamos para ayudarte en cada paso. Tu satisfacción es nuestra prioridad.',
  },
];

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="block font-script text-2xl text-secondary mb-2">¿Por qué elegirnos?</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark mb-4">
            Hecho a mano, pensado para vos
          </h2>
          <p className="text-dark/60 max-w-xl mx-auto">
            Cada detalle cuenta. Por eso nos enfocamos en ofrecerte la mejor experiencia de compra y aprendizaje.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="font-display font-medium text-dark text-xl mb-3">{feature.title}</h3>
              <p className="text-sm text-dark/60 leading-relaxed max-w-[260px] mx-auto">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

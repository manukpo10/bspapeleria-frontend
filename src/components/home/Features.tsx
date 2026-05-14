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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="block font-script text-2xl text-secondary mb-2">¿Por qué elegirnos?</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">
            Hecho a mano, pensado para vos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display font-medium text-dark text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-dark/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

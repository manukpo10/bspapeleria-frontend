import { motion } from 'framer-motion';
import { Store, Heart, BookOpen } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { VisitUsSection } from '../components/about/VisitUsSection';
import { SocialMediaSection } from '../components/about/SocialMediaSection';
import { InstagramFeedSection } from '../components/about/InstagramFeedSection';

export default function AboutPage() {
  return (
    <>
      <SEO title="Nosotros" />

      {/* Hero */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="block font-script text-2xl text-secondary mb-2">Conocenos</span>
          <h1 className="font-display text-4xl font-semibold text-dark mb-4">Sobre BS Papelería</h1>
          <p className="text-dark/60 max-w-xl mx-auto">
            Somos un estudio de papelería boutique que combina diseño, artesanía y tecnología para crear productos únicos y experiencias de aprendizaje inolvidables.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Store, title: 'Nuestra Tienda', desc: 'Productos personalizados, sublimables y archivos digitales de alta calidad.' },
            { icon: Heart, title: 'Nuestra Pasión', desc: 'Cada pieza está pensada con amor y atención al detalle.' },
            { icon: BookOpen, title: 'Nuestros Cursos', desc: 'Formación creativa para quienes quieren aprender y emprender.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-medium text-dark text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-dark/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-sand/20 border border-sand/50 p-10 text-center"
        >
          <h2 className="font-display text-2xl font-semibold text-dark mb-4">¿Querés colaborar con nosotros?</h2>
          <p className="text-dark/60 mb-6">Estamos siempre abiertos a nuevas ideas y proyectos creativos.</p>
          <a href="mailto:hola@bspapeleria.com" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-secondary transition-colors">
            Contactanos
          </a>
        </motion.div>
      </div>

      {/* Visitanos — Mapa + info */}
      <VisitUsSection />

      {/* Seguinos en redes */}
      <SocialMediaSection />

      {/* Instagram Feed */}
      <InstagramFeedSection />
    </>
  );
}

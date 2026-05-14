import { SEO } from '../components/shared/SEO';
import { Hero } from '../components/home/Hero';
import { CourseSlider } from '../components/home/CourseSlider';
import { ProductSlider } from '../components/home/ProductSlider';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import { products, courses } from '../data/mocks';

export default function HomePage() {
  const featuredCourses = courses.filter((c) => c.featured);
  const digitalProducts = products.filter((p) => p.category === 'archivos-digitales');
  const personalizedProducts = products.filter((p) => p.category === 'personalizados');
  const sublimationProducts = products.filter((p) => p.category === 'sublimables');
  const partyProducts = products.filter((p) => p.category === 'fiestas');
  const signageProducts = products.filter((p) => p.category === 'carteleria');

  return (
    <>
      <SEO title="Inicio" description="BS Papelería - Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos." />
      <Hero />
      <CourseSlider
        title="Talleres y Cursos"
        subtitle="Aprendé de la mano de profesionales y transformá tu creatividad en habilidades."
        script="Aprendé con nosotros"
        courses={featuredCourses}
      />
      <ProductSlider
        title="Archivos Digitales"
        subtitle="Plantillas, planners y recursos descargables para tu creatividad."
        script="Descargá y creá"
        products={digitalProducts}
      />
      <ProductSlider
        title="Productos Personalizados"
        subtitle="Agendas, tazas, llaveros y más con tu toque único."
        script="Hecho para vos"
        products={personalizedProducts}
      />
      <ProductSlider
        title="Productos Sublimables"
        subtitle="Remeras, mates y accesorios con sublimación de calidad."
        script="Colores vibrantes"
        products={sublimationProducts}
      />
      <ProductSlider
        title="Detalles para Fiestas"
        subtitle="Cotillón, decoración y todo lo que necesitás para tu evento."
        script="Celebrá con estilo"
        products={partyProducts}
      />
      <ProductSlider
        title="Cartelería"
        subtitle="Carteles, invitaciones y papelería para eventos especiales."
        script="Comunicá con elegancia"
        products={signageProducts}
      />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  );
}

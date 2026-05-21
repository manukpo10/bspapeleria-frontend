import { useState, useEffect } from 'react';
import { SEO } from '../components/shared/SEO';
import { Hero } from '../components/home/Hero';
import { CourseSlider } from '../components/home/CourseSlider';
import { ProductSlider } from '../components/home/ProductSlider';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import { TrustStrip } from '../components/home/TrustStrip';
import { SectionDivider } from '../components/home/SectionDivider';
import { products } from '../data/mocks';
import { api } from '../services/api';
import type { Course } from '../types';

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.getCourses().then(setFeaturedCourses).catch(() => {});
  }, []);

  const digitalProducts = products.filter((p) => p.category === 'archivos-digitales');
  const personalizedProducts = products.filter((p) => p.category === 'personalizados');
  const sublimationProducts = products.filter((p) => p.category === 'sublimables');
  const partyProducts = products.filter((p) => p.category === 'fiestas');
  const signageProducts = products.filter((p) => p.category === 'carteleria');

  return (
    <>
      <SEO title="Inicio" description="BS Papelería - Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos." />
      <Hero />
      <TrustStrip />

      <div id="cursos">
        <CourseSlider
          title="Talleres y Cursos"
          subtitle="Aprendé de la mano de profesionales y transformá tu creatividad en habilidades."
          script="Aprendé con nosotros"
          courses={featuredCourses}
        />
      </div>

      <SectionDivider variant="wave" />

      <div className="bg-sand/10">
        <ProductSlider
          title="Archivos Digitales"
          subtitle="Plantillas, planners y recursos descargables para tu creatividad."
          script="Descargá y creá"
          products={digitalProducts}
        />
      </div>

      <SectionDivider variant="wave" flip />

      <ProductSlider
        title="Productos Personalizados"
        subtitle="Agendas, tazas, llaveros y más con tu toque único."
        script="Hecho para vos"
        products={personalizedProducts}
      />

      <SectionDivider variant="curve" />

      <div className="bg-gradient-to-b from-sand/10 to-transparent">
        <ProductSlider
          title="Productos Sublimables"
          subtitle="Remeras, mates y accesorios con sublimación de calidad."
          script="Colores vibrantes"
          products={sublimationProducts}
        />
      </div>

      <SectionDivider variant="curve" flip />

      <ProductSlider
        title="Detalles para Fiestas"
        subtitle="Cotillón, decoración y todo lo que necesitás para tu evento."
        script="Celebrá con estilo"
        products={partyProducts}
      />

      <SectionDivider variant="wave" />

      <div className="bg-sand/10">
        <ProductSlider
          title="Cartelería"
          subtitle="Carteles, invitaciones y papelería para eventos especiales."
          script="Comunicá con elegancia"
          products={signageProducts}
        />
      </div>

      <SectionDivider variant="wave" flip />

      <Features />
      <Testimonials />
      <Newsletter />
    </>
  );
}

import { useState, useEffect } from 'react';
import { SEO } from '../components/shared/SEO';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { CourseSlider } from '../components/home/CourseSlider';
import { ProductSlider } from '../components/home/ProductSlider';
import { HowToOrder } from '../components/home/HowToOrder';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import { api } from '../services/api';
import { cachedFetch } from '../lib/apiCache';
import type { Course, Product, ProductCategory } from '../types';

const PRODUCT_SECTIONS: { category: ProductCategory; title: string; subtitle: string; script: string }[] = [
  {
    category: 'archivos-digitales',
    title: 'Archivos Digitales',
    subtitle: 'Plantillas, planners y recursos descargables para tu creatividad.',
    script: 'Descargá y creá',
  },
  {
    category: 'personalizados',
    title: 'Productos Personalizados',
    subtitle: 'Agendas, tazas, llaveros y más con tu toque único.',
    script: 'Hecho para vos',
  },
  {
    category: 'sublimables',
    title: 'Productos Sublimables',
    subtitle: 'Remeras, mates y accesorios con sublimación de calidad.',
    script: 'Colores vibrantes',
  },
  {
    category: 'fiestas',
    title: 'Detalles para Fiestas',
    subtitle: 'Cotillón, decoración y todo lo que necesitás para tu evento.',
    script: 'Celebrá con estilo',
  },
  {
    category: 'carteleria',
    title: 'Cartelería',
    subtitle: 'Carteles, invitaciones y papelería para eventos especiales.',
    script: 'Comunicá con elegancia',
  },
];

// Sections after the trust strip alternate tinted / white by their position among the sections that
// actually render, so the rhythm holds even when a category has no products
const band = (position: number) => (position % 2 === 0 ? 'bg-mist' : 'bg-white');

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    cachedFetch('home:cursos', () => api.getCourses())
      .then(setFeaturedCourses)
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
    cachedFetch('home:productos', () => api.getProducts())
      .then(setAllProducts)
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  const showCourses = loadingCourses || featuredCourses.length > 0;
  const productSections = PRODUCT_SECTIONS
    .map((section) => ({ ...section, products: allProducts.filter((p) => p.category === section.category) }))
    .filter((section) => loadingProducts || section.products.length > 0);

  // Position 0 is the category grid
  const firstProductPosition = showCourses ? 2 : 1;
  const howToOrderPosition = firstProductPosition + productSections.length;

  return (
    <>
      <SEO title="Inicio" description="BS Papelería - Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos." />
      <Hero />
      <TrustStrip />

      <div className={band(0)}>
        <CategoryGrid />
      </div>

      {showCourses && (
        <div className={band(1)}>
          <CourseSlider
            title="Talleres y Cursos"
            subtitle="Aprendé de la mano de profesionales y transformá tu creatividad en habilidades."
            script="Aprendé con nosotros"
            courses={featuredCourses}
            loading={loadingCourses}
          />
        </div>
      )}

      {productSections.map((section, i) => (
        <div key={section.category} className={band(firstProductPosition + i)}>
          <ProductSlider
            title={section.title}
            subtitle={section.subtitle}
            script={section.script}
            products={section.products}
            loading={loadingProducts}
          />
        </div>
      ))}

      <div className={band(howToOrderPosition)}>
        <HowToOrder />
      </div>
      <div className={band(howToOrderPosition + 1)}>
        <Features />
      </div>
      <div className={band(howToOrderPosition + 2)}>
        <Testimonials />
      </div>
      <div className={band(howToOrderPosition + 3)}>
        <Newsletter />
      </div>
    </>
  );
}

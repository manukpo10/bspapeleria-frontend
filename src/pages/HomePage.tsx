import { useState, useEffect } from 'react';
import { SEO } from '../components/shared/SEO';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { CourseSlider } from '../components/home/CourseSlider';
import { ProductSlider } from '../components/home/ProductSlider';
import { HowToStart } from '../components/home/HowToStart';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { StartCta } from '../components/home/StartCta';
import { api } from '../services/api';
import { cachedFetch } from '../lib/apiCache';
import { isDigitalResource } from '../lib/storefront';
import type { Course, Product } from '../types';

// The only product section left on the home: the shop sells courses and digital resources
const DIGITAL_SECTION = {
  title: 'Recursos digitales para tus proyectos',
  subtitle: 'Archivos y plantillas listas para usar, personalizar y darle vida a tus ideas, sin empezar todo desde cero.',
  script: 'Descargá y creá',
};

// Sections after the trust strip alternate tinted / white by their position among the sections that
// actually render, so the rhythm holds even when a section has nothing to show
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
  const digitalResources = allProducts.filter(isDigitalResource);
  const showResources = loadingProducts || digitalResources.length > 0;

  // Position 0 is the category grid
  const resourcesPosition = showCourses ? 2 : 1;
  const howToStartPosition = resourcesPosition + (showResources ? 1 : 0);

  return (
    <>
      <SEO title="Inicio" description="BS Papelería: cursos online y recursos digitales para aprender papelería creativa y emprender." />
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

      {showResources && (
        <div className={band(resourcesPosition)}>
          <ProductSlider
            title={DIGITAL_SECTION.title}
            subtitle={DIGITAL_SECTION.subtitle}
            script={DIGITAL_SECTION.script}
            products={digitalResources}
            loading={loadingProducts}
          />
        </div>
      )}

      <div className={band(howToStartPosition)}>
        <HowToStart />
      </div>
      <div className={band(howToStartPosition + 1)}>
        <Features />
      </div>
      <div className={band(howToStartPosition + 2)}>
        <Testimonials />
      </div>
      <div className={band(howToStartPosition + 3)}>
        <StartCta />
      </div>
    </>
  );
}

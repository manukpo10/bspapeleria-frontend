import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Quote } from 'lucide-react'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ProductoCard from '../components/productos/ProductoCard'
import CursoCard from '../components/cursos/CursoCard'
import BannerSlider from '../components/ui/BannerSlider'
import { BannerGrid } from '../components/ui/BannerSlider'
import { useProductos } from '../hooks/useProductos'
import { useCursos } from '../hooks/useCursos'
import {
  slidesCursos,
  bannersCursos,
  bannersDigitales,
  bannersPersonalizados,
  bannersPersonalizados2,
  bannersSublimables,
  bannersSublimables2,
  bannersFiestas,
  bannersFiestas2,
  bannersFiestas3,
  bannersCarteleria,
  productosFisicos,
  categorias,
} from '../data/mockData'

const stats = [
  { label: 'Productos', value: '200+', emoji: '📦' },
  { label: 'Cursos',    value: '15+',  emoji: '🎓' },
  { label: 'Alumnos',   value: '500+', emoji: '⭐' },
  { label: 'Envios',    value: '100%', emoji: '✈️' },
]

const testimonios = [
  {
    nombre: 'Lucía Fernández',
    texto: 'Los productos son de calidad increíble. La agenda personalizada que pedí quedó最美的. ¡Super recomendada!',
    avatar: 'https://picsum.photos/seed/lucia/100/100',
    estrellas: 5,
    ciudad: 'La Plata',
  },
  {
    nombre: 'Martín Gómez',
    texto: 'Hice el curso de lettering y fue transformador. La profe explica super bien y el material de apoyo está buenísimo.',
    avatar: 'https://picsum.photos/seed/martin/100/100',
    estrellas: 5,
    ciudad: 'Buenos Aires',
  },
  {
    nombre: 'Sofía Reyes',
    texto: 'El set de acuarelas es profesional pero acessível para principiantes. Llegaron rápido y muy bien empaquetados.',
    avatar: 'https://picsum.photos/seed/sofia/100/100',
    estrellas: 5,
    ciudad: 'Rosario',
  },
]

const beneficios = [
  { emoji: '🚀', titulo: 'Envío rápido', desc: 'Despachamos en 24/48hs a todo el país' },
  { emoji: '💎', titulo: 'Calidad garantizada', desc: 'Todos nuestros productos son seleccionados a mano' },
  { emoji: '💬', titulo: 'Soporte personalizado', desc: 'Respondemos en menos de 2 horas' },
  { emoji: '🔄', titulo: 'Devoluciones sin drama', desc: '15 días para cambios y devoluciones' },
]

function Stars({ count = 8, className = '' }) {
  const positions = [
    { top: '15%', left: '10%', delay: '0s',   size: 10 },
    { top: '30%', left: '25%', delay: '0.4s', size: 7  },
    { top: '60%', left: '8%',  delay: '0.8s', size: 12 },
    { top: '80%', left: '20%', delay: '0.2s', size: 8  },
    { top: '20%', left: '80%', delay: '0.6s', size: 9  },
    { top: '50%', left: '90%', delay: '1s',   size: 6  },
    { top: '70%', left: '75%', delay: '0.3s', size: 11 },
    { top: '40%', left: '60%', delay: '0.7s', size: 7  },
  ].slice(0, count)

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {positions.map((p, i) => (
        <svg
          key={i}
          style={{ top: p.top, left: p.left, animationDelay: p.delay, width: p.size, height: p.size }}
          className="absolute animate-twinkle"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ))}
    </div>
  )
}

export default function Home() {
  const { productos, loading: loadingP } = useProductos()
  const { cursos, loading: loadingC } = useCursos()

  return (
    <div className="overflow-x-hidden">

      {/* ─── TALLERES Y CURSOS ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="c1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#98acf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b088f9" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="c2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#da9ff9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#da9ff9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90%" cy="10%" rx="50%" ry="40%" fill="url(#c1)" className="animate-float" />
          <ellipse cx="5%" cy="90%" rx="40%" ry="35%" fill="url(#c2)" className="animate-float" style={{animationDelay: '1s'}} />
          <path d="M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,0 L0,0 Z" fill="white" fillOpacity="0.3" />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={8} className="text-white/20" />
          <svg style={{top: '12%', left: '8%', width: 28, height: 28, animationDelay: '0.3s'}} className="absolute text-white/40 animate-float">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
          </svg>
          {[15, 35, 55, 75, 88].map((x, i) => (
            <div key={i} style={{top: `${10 + i*15}%`, left: `${x}%`}} className="absolute w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              ✨ Aprendé creando
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Talleres y Cursos
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Aprendé técnicas creativas de la mano de profes apasionadas. Cursos presenciales y online para todos los niveles.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <BannerSlider slides={slidesCursos} />
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex overflow-x-auto scroll-hide gap-4 pb-4 md:grid md:grid-cols-4 md:pb-0">
              {[
                { nombre: 'El Mundo de las Agendas', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=300&fit=crop', precio: '$15.000', likes: 245, link: '/cursos?categoria=agendas' },
                { nombre: 'La Magia del Candybar', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=300&fit=crop', precio: '$12.000', likes: 532, link: '/cursos?categoria=candybar' },
                { nombre: 'Etiquetas Escolares', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=300&fit=crop', precio: '$8.500', likes: 189, link: '/cursos?categoria=etiquetas' },
                { nombre: 'Piñatas', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop', proximamente: true },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to={item.link || '/cursos'}
                  className={`group relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-white to-sand/30 border border-sand/30 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {item.proximamente && (
                      <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Próximamente</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-sm block">{item.nombre}</span>
                    {item.precio && (
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-primary font-heading font-bold text-sm">{item.precio}</span>
                        <span className="text-pink-400 text-xs">♥ {item.likes}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/cursos">
              <Button size="lg" className="shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300">
                Ver todos los cursos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Consultá por privado
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ARCHIVOS DIGITALES ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-accent/15 via-white to-primary/10">
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="digital1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="digital2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="85%" cy="15%" rx="40%" ry="35%" fill="url(#digital1)" className="animate-float" />
          <ellipse cx="15%" cy="85%" rx="35%" ry="40%" fill="url(#digital2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={6} className="text-accent/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-accent text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              📥 Descargá ya
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Archivos Digitales
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Descargá instantáneamente tus archivos. Imprimí las veces que quieras y creá proyectos únicos.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex overflow-x-auto scroll-hide gap-4 pb-4 md:grid md:grid-cols-4 md:pb-0">
              {[
                { nombre: 'Kit de Agendas', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=300&fit=crop' },
                { nombre: 'San Valentin', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=300&fit=crop' },
                { nombre: 'Candybar', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=300&fit=crop' },
                { nombre: 'Fechas Especiales', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop', proximamente: true },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to={item.link || '/tienda'}
                  className={`group relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-white to-sand/30 border border-sand/30 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {item.proximamente && (
                      <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                        <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Próximamente</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-sm">{item.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/tienda">
              <Button size="lg" variant="secondary" className="shadow-xl shadow-accent/30 hover:scale-105 transition-all duration-300">
                Ver archivos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Consultar personalizada
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-dark py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-3xl font-heading font-black text-primary mb-1">{s.value}</div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTOS PERSONALIZADOS ──────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/15 via-cream to-accent/10">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="personal1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#98acf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#98acf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="personal2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90%" cy="10%" rx="40%" ry="35%" fill="url(#personal1)" className="animate-float" />
          <ellipse cx="10%" cy="85%" rx="35%" ry="40%" fill="url(#personal2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={6} className="text-primary/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              ✨ Hechos a medida
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Productos Personalizados
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Cada producto pensado y diseñado especialmente para vos. Agenda tu próximo pedido personalizado.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex overflow-x-auto scroll-hide gap-4 pb-4 md:grid md:grid-cols-4 md:pb-0">
              {[
                { nombre: 'Agendas', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', color: 'from-pink-400/20 to-pink-400/5' },
                { nombre: 'Cuadernos', img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', color: 'from-purple-400/20 to-purple-400/5' },
                { nombre: 'Libretas', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop', color: 'from-blue-400/20 to-blue-400/5' },
                { nombre: 'Blocks', img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop', color: 'from-green-400/20 to-green-400/5' },
                { nombre: 'Cuaderno Pediátrico', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop', color: 'from-amber-400/20 to-amber-400/5' },
                { nombre: 'Álbum de Fotos', img: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=400&h=400&fit=crop', color: 'from-rose-400/20 to-rose-400/5' },
                { nombre: 'Tarjetas Personales', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop', color: 'from-indigo-400/20 to-indigo-400/5' },
                { nombre: 'Almanaques', img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=400&fit=crop', color: 'from-teal-400/20 to-teal-400/5' },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to="/tienda"
                  className={`group relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br ${item.color} border border-sand/30 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-sm">{item.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/tienda">
              <Button size="lg" className="shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300">
                Ver todos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Pedir personalizado
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTOS SUBLIMABLES ──────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-secondary/15 via-cream to-primary/10">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="sublim1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sublim2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90%" cy="10%" rx="40%" ry="35%" fill="url(#sublim1)" className="animate-float" />
          <ellipse cx="10%" cy="85%" rx="35%" ry="40%" fill="url(#sublim2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={6} className="text-secondary/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-secondary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              🎨 Impresión propia
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Productos Sublimables
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Llevá tu diseño a cualquier superficie. Productos listos para sublimar con tu creatividad.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { nombre: 'Remeras', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
                { nombre: 'Bolsas de Griselina', img: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=300&h=300&fit=crop' },
                { nombre: 'Placas de Aluminio', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
                { nombre: 'Tazas Cerámica', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop' },
                { nombre: 'Tazas Plástico', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop' },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to="/tienda"
                  className={`group relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-white to-sand/30 border border-sand/30 hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-sm">{item.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/tienda">
              <Button size="lg" variant="secondary" className="shadow-xl shadow-secondary/30 hover:scale-105 transition-all duration-300">
                Ver todos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Cotizar pedido
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DETALLES PARA FIESTAS ──────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-accent/15 via-white to-pink-100/30">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="fiestas1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fiestas2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90%" cy="10%" rx="40%" ry="35%" fill="url(#fiestas1)" className="animate-float" />
          <ellipse cx="10%" cy="85%" rx="35%" ry="40%" fill="url(#fiestas2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={6} className="text-accent/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-accent text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              🎉 Celebrá con estilo
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Detalles para Fiestas
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Todo lo que necesitás para tu celebración perfecta. Desde invitaciones hasta los últimos detalles.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {[
                { nombre: 'Invitaciones Digitales', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop' },
                { nombre: 'Pulseras', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&h=300&fit=crop' },
                { nombre: 'Bolsitas', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
                { nombre: 'Banderines', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=300&fit=crop' },
                { nombre: 'Piñatas', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' },
                { nombre: 'Tatuajes Temporales', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=300&h=300&fit=crop' },
                { nombre: 'Toppers de Torta', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop' },
                { nombre: 'Trípticos', img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=300&fit=crop' },
                { nombre: 'Pulseras VIP', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&h=300&fit=crop' },
                { nombre: 'Invitación en Papel', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop' },
                { nombre: 'Bautismo / Comunión', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=300&fit=crop' },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to="/tienda"
                  className={`group relative overflow-hidden rounded-2xl p-2 bg-gradient-to-br from-white to-sand/30 border border-sand/30 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-xs">{item.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/tienda">
              <Button size="lg" variant="secondary" className="shadow-xl shadow-accent/30 hover:scale-105 transition-all duration-300">
                Ver todos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Consultar disponibilidad
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CARTELERÍA ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/15 via-white to-secondary/10">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="cartel1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cartel2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90%" cy="10%" rx="40%" ry="35%" fill="url(#cartel1)" className="animate-float" />
          <ellipse cx="10%" cy="85%" rx="35%" ry="40%" fill="url(#cartel2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={6} className="text-primary/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 animate-fade-in shadow-lg">
              📢 Hacé-visible tu marca
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mt-2 mb-3 animate-fade-in drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
              Cartelería
            </h2>
            <p className="text-dark/60 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Presencia profesional para tu negocio o evento. Soluciones de cartelería adaptadas a vos.
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { nombre: 'Banners', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=300&fit=crop' },
                { nombre: 'Vinilos', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
                { nombre: 'Vinilos Microperforados', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop' },
                { nombre: 'Agendas', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=300&fit=crop' },
                { nombre: 'Tarjetas Personales', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=300&fit=crop' },
                { nombre: 'Tazas', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop' },
              ].map((item) => (
                <Link
                  key={item.nombre}
                  to="/tienda"
                  className={`group relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-white to-sand/30 border border-sand/30 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-0`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center">
                    <span className="text-dark font-bold text-sm">{item.nombre}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Link to="/tienda">
              <Button size="lg" className="shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300">
                Ver todos <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Cotizar pedido
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BENEFICIOS ────────────────────────────────────────── */}
      <section className="py-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 text-white/5">
          <Stars count={8} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((b) => (
              <div key={b.titulo} className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{b.emoji}</span>
                <div>
                  <h3 className="text-white font-bold mb-1">{b.titulo}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS ───────────────────────────────────────── */}
      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 text-primary/10">
          <Stars count={6} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Testimonios</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-dark mt-2">
              Lo que dicen nuestras clientas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <div key={t.nombre} className="bg-white rounded-3xl p-7 border border-sand shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
                <Quote size={28} className="text-primary/30 mb-4" />
                <p className="text-dark/70 leading-relaxed mb-6 italic">"{t.texto}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.nombre} className="w-12 h-12 rounded-full object-cover border-2 border-sand" />
                  <div>
                    <p className="font-bold text-dark">{t.nombre}</p>
                    <p className="text-sm text-dark/40">{t.ciudad}</p>
                  </div>
                  <div className="ml-auto flex text-primary text-sm">{'★'.repeat(t.estrellas)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REDES SOCIALES ─────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-dark via-dark to-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Conectate con nosotros</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-white mt-2">
              Seguinos en nuestras redes
            </h2>
            <p className="text-white/50 mt-3">Enterate de todas las novedades, promociones y creaciones ✨</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/bspapeleria/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-dark/90 rounded-2xl p-6 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-white font-heading text-xl font-bold mb-2">Instagram</h3>
                <p className="text-white/60 text-sm text-center mb-4">Tips, reel y contenido diario</p>
                <span className="text-white/80 text-sm font-medium">@bspapeleria</span>
              </div>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@bspapeleria" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600 p-1 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-dark/90 rounded-2xl p-6 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </div>
                <h3 className="text-white font-heading text-xl font-bold mb-2">TikTok</h3>
                <p className="text-white/60 text-sm text-center mb-4">Videos cortos y tendencias</p>
                <span className="text-white/80 text-sm font-medium">@bspapeleria</span>
              </div>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/bspapeleria" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-1 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-dark/90 rounded-2xl p-6 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-white font-heading text-xl font-bold mb-2">Facebook</h3>
                <p className="text-white/60 text-sm text-center mb-4">Novedades y eventos</p>
                <span className="text-white/80 text-sm font-medium">@bspapeleria</span>
              </div>
            </a>
          </div>

          {/* Stats de redes */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">5K+</div>
              <div className="text-white/50 text-sm">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">500+</div>
              <div className="text-white/50 text-sm">Publicaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">1K+</div>
              <div className="text-white/50 text-sm">Videos</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DONDE ENCONTRARNOS ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Visítanos</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-dark mt-2">
              ¿Dónde encontrarnos?
            </h2>
            <p className="text-dark/50 mt-3">
              Estamos en Villa Bosch, Buenos Aires, Argentina
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 h-[400px] md:h-[500px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104973.11854243884!2d-58.56038182109322!3d-34.61115691749934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbf4521252263%3A0x307af1d2f2f2f2f2!2sVilla%20Bosch%2C%20Provincia%20de%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1ses-419!2s!4v1700000000000!5m2!1ses-419!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4 bg-white rounded-xl p-4 shadow-lg">
              <p className="font-bold text-dark text-sm">📍 Villa Bosch</p>
              <p className="text-dark/60 text-xs">Buenos Aires, Argentina</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-dark/60 mb-4">
              ¿Necesitás ayuda para llegar? Contactanos y te guiamos
            </p>
            <a 
              href="https://wa.me/549221xxxxxxx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.174-.149.371-.347.557-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.148-.671-1.641-.92-2.207-.24-.549-.48-.463-.67-.463-.149-.001-.371-.001-.57-.001-.249-.001-.642-.001-.98-.001-.296-.001-.617-.002-.927-.003l-.03-.007c-.074-.014-.181-.029-.298-.05-.296-.051-.653-.103-1.146-.149-.148-.015-.296-.03-.445-.045l-.045-.007c-.197-.016-.443-.016-.642-.016-.199.001-.443.016-.642.016-.199-.001-.443-.016-.642-.016l-.045-.001c-.098-.005-.221-.01-.348-.015-.347-.014-.74-.028-1.17-.028-.43 0-.86.014-1.29.043-.621.044-1.23.128-1.81.254-.296.064-.542.128-.768.173-.099.02-.223.04-.372.064-.148.025-.37.05-.665.098-.296.049-.642.123-1.075.222-.433.099-.92.247-1.47.444-.549.197-1.123.469-1.694.838-.571.369-1.074.839-1.444 1.32-.37.481-.617.938-.765 1.28-.148.342-.197.617-.172.814.025.198.173.395.493.642.32.247.691.524 1.06.839.37.315.79.665 1.245 1.048.456.383.987.814 1.642 1.29.655.476 1.41.998 2.275 1.566.865.568 1.839 1.197 2.93 1.887 1.091.69 2.275 1.395 3.57 2.115 1.295.72 2.642 1.395 4.125 2.027 1.482.632 3.07 1.197 4.52 1.694 1.45.497 2.87.938 4.025 1.32 1.155.382 2.075.697 2.67.948.595.251 1.048.444 1.37.567.322.123.546.198.668.235.122.037.198.05.249.062.051.012.098.02.123.022.025.002.05.005.074.007l.02.003.017.002c.123.012.37.035.642.064.272.029.617.064 1.02.098.403.034.86.064 1.32.098.46.034.965.049 1.44.049.475 0 .925-.015 1.32-.049.395-.034.795-.064 1.17-.098.375-.034.72-.064.995-.098.275-.034.49-.064.617-.089.127-.025.222-.052.272-.079.05-.027.098-.054.148-.084.05-.03.123-.074.247-.132.124-.058.295-.139.493-.247.198-.108.443-.24.716-.395.273-.155.593-.34.928-.567.335-.227.741-.495 1.197-.816.456-.321.974-.691 1.517-1.116.543-.425 1.14-.919 1.74-1.493.6-.574 1.272-1.23 1.94-1.973.668-.743 1.395-1.573 2.045-2.498.65-.925 1.32-1.978 1.717-3.167.397-1.189.49-2.378.172-3.567-.318-1.189-.92-2.377-1.717-3.567-.797-1.19-1.843-2.378-3.074-3.567-1.231-1.189-2.607-2.378-4.1-3.567-1.493-1.189-3.116-2.378-4.832-3.567-1.716-1.189-3.538-2.378-5.444-3.567-1.906-1.189-3.888-2.378-5.938-3.567-2.05-1.189-4.173-2.378-6.364-3.567-2.191-1.189-4.444-2.378-6.755-3.567l-.074-.015Z"/>
              </svg>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-cream to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 text-primary/15">
          <Stars count={8} />
        </div>
        <div className="max-w-2xl mx-auto px-4 text-center relative">
          <img src="/LOGO.png" alt="BS Papelería" className="h-20 w-auto object-contain mx-auto mb-6" />
          <h2 className="font-heading text-3xl lg:text-4xl font-black text-dark mb-4">
            Novedades y ofertas exclusivas
          </h2>
          <p className="text-dark/60 text-lg mb-8">
            Suscribite y recibe descuentos, lanzamientos de cursos y tips creativos directo en tu inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email" placeholder="tu@email.com"
              className="flex-1 px-5 py-3.5 rounded-xl border border-sand bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-dark"
            />
            <Button type="submit" size="lg">Suscribirme</Button>
          </form>
          <p className="text-dark/30 text-xs mt-4">Sin spam. Podes darte de baja cuando quieras.</p>
        </div>
      </section>

    </div>
  )
}

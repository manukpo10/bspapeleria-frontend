import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

function Stars({ count = 6, className = '' }) {
  const positions = [
    { top: '10%', left: '5%', delay: '0s', size: 8 },
    { top: '25%', left: '15%', delay: '0.3s', size: 6 },
    { top: '40%', left: '8%', delay: '0.6s', size: 10 },
    { top: '15%', left: '85%', delay: '0.2s', size: 7 },
    { top: '30%', left: '90%', delay: '0.5s', size: 9 },
    { top: '50%', left: '75%', delay: '0.8s', size: 6 },
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

export default function Nosotros() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/20 via-cream to-accent/10">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <radialGradient id="nos1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#98acf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#98acf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nos2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="85%" cy="20%" rx="45%" ry="40%" fill="url(#nos1)" className="animate-float" />
          <ellipse cx="10%" cy="80%" rx="35%" ry="45%" fill="url(#nos2)" className="animate-float" style={{animationDelay: '1s'}} />
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Stars count={8} className="text-primary/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Heart size={14} className="text-secondary" />
                Conoce nuestra historia
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-dark mb-6">
                Somos <span className="text-primary">BS</span> Papelería
              </h1>
              <p className="text-dark/60 text-lg mb-8 max-w-xl">
                Un espacio creado con amor para dar vida a tus ideas. Nos especializamos en materiales de papelería artística, productos personalizados y cursos creativos.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/productos">
                  <Button size="lg" className="shadow-lg shadow-primary/30">
                    Ver productos <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/cursos">
                  <Button size="lg" variant="outline">
                    Ver cursos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop" alt="" className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500" />
                  <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=200&fit=crop" alt="" className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=200&fit=crop" alt="" className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500" />
                  <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" alt="" className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-dark mb-4">
              ¿Qué nos diferencia?
            </h2>
            <p className="text-dark/50 max-w-2xl mx-auto">
              Creemos en la creatividad sin límites y en cada detalle hecho con amor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '💝', titulo: 'Hecho con amor', desc: 'Cada producto y curso está pensado para inspirar tu creatividad' },
              { emoji: '🎨', titulo: 'Creatividad sin límites', desc: 'Diseños únicos y personalizados para cada cliente' },
              { emoji: '⭐', titulo: 'Calidad garantizada', desc: 'Materiales seleccionados y atención personalizada' },
            ].map((item) => (
              <div key={item.titulo} className="bg-cream rounded-3xl p-8 text-center hover:shadow-xl hover:shadow-primary/10 transition-shadow">
                <span className="text-5xl mb-4 block">{item.emoji}</span>
                <h3 className="font-heading text-xl font-bold text-dark mb-2">{item.titulo}</h3>
                <p className="text-dark/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 text-white/5">
          <Stars count={6} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-3xl lg:text-4xl font-black text-white mb-4">
            ¿ готовы para crear algo increíble?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Sumate a nuestra comunidad de creadores y descubrí un mundo de posibilidades
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/productos">
              <Button size="lg">Explorar productos</Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dark">
                Contactanos
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
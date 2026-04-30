import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Heart, ArrowRight, Send } from 'lucide-react'

const navLinks = [
  { to: '/',         label: 'Inicio'   },
  { to: '/tienda',   label: 'Tienda'   },
  { to: '/cursos',   label: 'Cursos'   },
  { to: '/contacto', label: 'Contacto' },
]

const accountLinks = [
  { to: '/login',      label: 'Iniciar sesion' },
  { to: '/registro',   label: 'Crear cuenta'   },
  { to: '/dashboard',  label: 'Mi dashboard'   },
  { to: '/carrito',    label: 'Mi carrito'      },
]

const contactInfo = [
  { icon: Mail,   text: 'hola@bspapeleria.com'  },
  { icon: Phone,  text: '+54 221 123-4567'      },
  { icon: MapPin, text: 'La Plata, Buenos Aires' },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60">

      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">
                Suscribite a nuestras novedades
              </h3>
              <p className="text-white/40 text-sm">Ofertas, nuevos productos y tips creativos en tu inbox.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:bg-white/15 transition text-sm"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 whitespace-nowrap"
              >
                <Send size={14} className="rotate-45" />
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Cuerpo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + descripcion */}
          <div className="md:col-span-1">
            {/* Logo real en el footer */}
            <Link to="/" className="inline-block mb-4 group">
              <img
                src="/LOGO.png"
                alt="BS Papelería"
                className="h-20 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition"
              />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Tu espacio creativo favorito. Materiales de calidad y cursos para potenciar tu arte. Creatividad que vuela.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:hola@bspapeleria.com"
                aria-label="Email"
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navegacion */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Navegacion</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-primary transition-colors hover:translate-x-1 inline-flex items-center gap-1 duration-200 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-primary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mi cuenta */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Mi cuenta</h3>
            <ul className="space-y-3">
              {accountLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-primary transition-colors hover:translate-x-1 inline-flex items-center gap-1 duration-200 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-primary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contacto</h3>
            <ul className="space-y-4">
              {contactInfo.map((c) => (
                <li key={c.text} className="flex items-start gap-3">
                  <c.icon size={15} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{c.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/50 text-xs leading-relaxed">
                <span className="text-accent font-medium block mb-1">Horario de atencion</span>
                Lun–Vie 9:00–18:00<br />Sab 10:00–14:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} BS Papelería · Todos los derechos reservados</p>
          <p className="flex items-center gap-1.5">
            Hecho con <Heart size={12} className="text-primary fill-primary" /> en La Plata, Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'

const links = [
  { to: '/',             label: 'Inicio' },
  { to: '/nosotros',     label: 'Nosotros' },
  { to: '/productos',    label: 'Productos' },
  { to: '/cursos',       label: 'Cursos' },
  { to: '/preguntas',    label: 'Preguntas Frecuentes' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/98 backdrop-blur-md shadow-lg shadow-primary/10'
        : 'bg-white border-b border-sand/40'
    }`}>

      {/* Anuncio top strip — violeta oscuro del logo */}
      <div className="bg-dark text-white/80 text-xs text-center py-1.5 flex items-center justify-center gap-2">
        <Send size={11} className="text-accent rotate-45" />
        <span>Envio gratis en compras mayores a $10.000 · Nuevos cursos disponibles</span>
        <Send size={11} className="text-accent rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo real */}
          <Link to="/" className="flex items-center group">
            <img
              src="/LOGO.png"
              alt="BS Papelería"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(l.to)
                    ? 'text-primary bg-primary/10'
                    : 'text-dark/60 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1.5">

            {/* Carrito */}
            <Link
              to="/carrito"
              aria-label="Ver carrito"
              className="relative p-2.5 hover:bg-primary/10 rounded-xl transition group"
            >
              <ShoppingCart size={20} className="text-dark/70 group-hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Usuario desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded-xl transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {user.nombre?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-dark/70 group-hover:text-primary transition hidden lg:block font-medium">
                    {user.nombre?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-dark/40 hover:text-error transition px-2 py-1.5 rounded-lg hover:bg-error-bg"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-dark/60 hover:text-primary px-3 py-2 rounded-xl hover:bg-primary/5 transition"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary transition shadow-sm shadow-primary/30"
                >
                  Registrarme
                </Link>
              </div>
            )}

            {/* Hamburguesa */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-primary/10 transition"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} className="text-dark" /> : <Menu size={20} className="text-dark" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden py-4 border-t border-sand/40 animate-fade-in">
            <div className="flex justify-center mb-4">
              <img src="/LOGO.png" alt="BS Papelería" className="h-16 object-contain" />
            </div>
            <div className="space-y-1 mb-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center px-3 py-2.5 rounded-xl font-semibold transition ${
                    isActive(l.to)
                      ? 'text-primary bg-primary/10'
                      : 'text-dark hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-sand/30 pt-4 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 text-dark hover:text-primary hover:bg-primary/5 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{user.nombre?.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{user.nombre?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2.5 text-error hover:bg-error-bg rounded-xl text-sm"
                  >
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2.5 text-dark hover:text-primary hover:bg-primary/5 rounded-xl font-medium">
                    Iniciar sesion
                  </Link>
                  <Link to="/registro" className="block px-3 py-2.5 bg-primary text-white rounded-xl text-center font-semibold">
                    Crear cuenta gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

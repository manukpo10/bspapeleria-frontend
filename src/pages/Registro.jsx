import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { register as registerApi } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'

const beneficios = [
  { icon: '🎁', title: 'Descuento del 10%', desc: 'En tu primera compra' },
  { icon: '📚', title: 'Cursos exclusivos', desc: 'Acceso prioritario a nuevos talleres' },
  { icon: '📦', title: 'Historial de compras', desc: 'Reordenar es más fácil' },
  { icon: '⭐', title: 'Ofertas members', desc: 'Solo para usuarios registrados' },
]

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmarPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errores[name]) {
      setErrores({ ...errores, [name]: null })
    }
  }

  const validar = () => {
    const newErrores = {}
    
    if (!form.nombre.trim()) {
      newErrores.nombre = 'El nombre es obligatorio'
    }
    
    if (!form.email.trim()) {
      newErrores.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrores.email = 'Ingresa un email válido'
    }
    
    if (!form.password) {
      newErrores.password = 'La contraseña es obligatoria'
    } else if (form.password.length < 8) {
      newErrores.password = 'Mínimo 8 caracteres'
    }
    
    if (form.password !== form.confirmarPassword) {
      newErrores.confirmarPassword = 'Las contraseñas no coinciden'
    }
    
    setErrores(newErrores)
    return Object.keys(newErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return
    
    setError(null)
    setLoading(true)
    try {
      const { data } = await registerApi({ nombre: form.nombre, email: form.email, password: form.password })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      const apiError = err.response?.data
      if (typeof apiError === 'object' && !apiError.error) {
        setError(Object.values(apiError).join(' · '))
      } else {
        setError(apiError?.error || 'Error al registrarse')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-cream px-6 py-32 lg:py-40 order-2 lg:order-1">
        <div className="w-full max-w-md mx-auto">
          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">BS</span>
            </div>
            <span className="font-heading text-xl font-bold text-dark">BS Papelería</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-dark mb-2">Crear cuenta</h1>
            <p className="text-dark/50">Completá tus datos para unirte a BS Papelería</p>
          </div>

          {/* Error general */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3">
              <span className="text-error">⚠️</span>
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition text-dark placeholder:text-dark/30 ${
                    errores.nombre 
                      ? 'border-error focus:border-error focus:ring-error/10' 
                      : 'border-sand/50 focus:border-primary focus:ring-primary/10'
                  }`}
                  placeholder="Ana García"
                />
              </div>
              {errores.nombre && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <span>⚠️</span> {errores.nombre}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition text-dark placeholder:text-dark/30 ${
                    errores.email 
                      ? 'border-error focus:border-error focus:ring-error/10' 
                      : 'border-sand/50 focus:border-primary focus:ring-primary/10'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errores.email && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <span>⚠️</span> {errores.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Contraseña <span className="text-dark/40 font-normal">(mínimo 8 caracteres)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-14 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition text-dark placeholder:text-dark/30 ${
                    errores.password 
                      ? 'border-error focus:border-error focus:ring-error/10' 
                      : 'border-sand/50 focus:border-primary focus:ring-primary/10'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errores.password && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <span>⚠️</span> {errores.password}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmarPassword"
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-4 transition text-dark placeholder:text-dark/30 ${
                    errores.confirmarPassword 
                      ? 'border-error focus:border-error focus:ring-error/10' 
                      : 'border-sand/50 focus:border-primary focus:ring-primary/10'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errores.confirmarPassword && (
                <p className="mt-1.5 text-sm text-error flex items-center gap-1">
                  <span>⚠️</span> {errores.confirmarPassword}
                </p>
              )}
            </div>

            {/* Botón */}
            <Button type="submit" className="w-full py-3.5 text-base font-semibold" size="lg" loading={loading}>
              Crear mi cuenta
            </Button>
          </form>

          {/* Términos */}
          <p className="text-center text-dark/40 text-xs mt-6 leading-relaxed">
            Al registrarte aceptas nuestros{' '}
            <a href="/terminos" className="underline hover:text-dark/60">Términos y Condiciones</a>
            {' '}y{' '}
            <a href="/privacidad" className="underline hover:text-dark/60">Política de Privacidad</a>
          </p>

          {/* Link a login */}
          <p className="text-center text-dark/50 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-secondary transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Panel derecho - Imagen y beneficios */}
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-primary px-8 py-32 lg:py-40 order-1 lg:order-2">
        {/* Elementos decorativos */}
        <div className="absolute top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
        />
        
        {/* Contenido alineado con el panel izquierdo */}
        <div className="max-w-md mx-auto">
          <Link to="/" className="group mb-8 block">
            <img 
              src="/LOGO.png" 
              alt="BS Papelería" 
              className="w-40 h-40 object-contain mx-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="text-accent" size={28} />
              <h2 className="font-heading text-xl font-bold text-white">¡Únete a la comunidad!</h2>
            </div>
            
            <p className="text-white/70 text-sm mb-6">
              Obtené beneficios exclusivos al registrarte
            </p>

            <div className="space-y-3">
              {beneficios.map((b) => (
                <div key={b.title} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <span className="text-xl">{b.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-sm">{b.title}</h3>
                    <p className="text-white/60 text-xs">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { login as loginApi } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-cream px-6 py-32 lg:py-40">
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
            <h1 className="font-heading text-3xl font-bold text-dark mb-2">¡Bienvenido/a!</h1>
            <p className="text-dark/50">Ingresá a tu cuenta para continuar</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3">
              <span className="text-error">⚠️</span>
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-sand/50 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition text-dark placeholder:text-dark/30"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-dark">Contraseña</label>
                <Link to="/recuperar" className="text-sm text-primary hover:text-secondary transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-14 py-3.5 rounded-xl border border-sand/50 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition text-dark placeholder:text-dark/30"
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
            </div>

            {/* Recordarme */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-sand/50 text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember" className="text-sm text-dark/60 cursor-pointer">
                Recordarme
              </label>
            </div>

            {/* Botón */}
            <Button type="submit" className="w-full py-3.5 text-base font-semibold" size="lg" loading={loading}>
              Iniciar sesión
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cream px-4 text-dark/30 text-sm">o</span>
            </div>
          </div>

          {/* Link a registro */}
          <p className="text-center text-dark/50">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-primary font-semibold hover:text-secondary transition-colors">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Panel derecho - Imagen y branding */}
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary px-8 py-32 lg:py-40">
        {/* Elementos decorativos */}
        <div className="absolute top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl" />
        
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
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <blockquote className="text-xl font-heading font-medium leading-relaxed text-white mb-4">
              "Creá, organizá y personalizá tu mundo"
            </blockquote>
            <p className="text-white/70 text-sm">
              Encontrá todo lo que necesitás para dar vida a tus ideas creativas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
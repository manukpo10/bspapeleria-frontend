import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { register as registerApi } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'

const perks = [
  'Acceso a ofertas exclusivas para miembros',
  'Historial de compras y reordenes faciles',
  'Inscripcion prioritaria a cursos nuevos',
  'Descuento del 10% en tu primera compra',
]

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
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
      const { data } = await registerApi(form)
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
      {/* Panel izquierdo formulario */}
      <div className="flex items-center justify-center bg-cream px-6 py-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">BS</span>
            </div>
            <span className="font-heading text-xl font-bold text-dark">BSPapeleria</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-dark mb-2">Crear cuenta</h1>
          <p className="text-dark/50 mb-8">Unite a la comunidad BSPapeleria</p>

          {error && <div className="mb-5"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Nombre completo</label>
              <input
                type="text" name="nombre" required
                value={form.nombre} onChange={handleChange}
                className="input-base" placeholder="Ana Garcia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                className="input-base" placeholder="hola@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Contrasena <span className="text-dark/30 font-normal">(min. 8 caracteres)</span>
              </label>
              <input
                type="password" name="password" required minLength={8}
                value={form.password} onChange={handleChange}
                className="input-base" placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Crear mi cuenta gratis
            </Button>
          </form>

          <p className="text-center text-dark/40 text-xs mt-5 leading-relaxed">
            Al registrarte aceptas nuestros terminos y condiciones y politica de privacidad.
          </p>

          <p className="text-center text-dark/50 text-sm mt-6">
            Ya tenes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-secondary">
              Iniciar sesion
            </Link>
          </p>
        </div>
      </div>

      {/* Panel derecho con imagen y beneficios */}
      <div className="hidden lg:block relative overflow-hidden order-1 lg:order-2">
        <img
          src="https://picsum.photos/seed/registro-bg/800/1000"
          alt="Papeleria"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/80 via-dark/70 to-dark/90" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">BS</span>
            </div>
            <span className="font-heading text-xl font-bold text-white">BSPapeleria</span>
          </Link>
          <div>
            <h2 className="font-heading text-2xl font-bold text-white mb-6">
              Beneficios de ser miembro
            </h2>
            <ul className="space-y-4">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

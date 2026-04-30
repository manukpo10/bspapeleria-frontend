import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
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
      setError(err.response?.data?.error || 'Email o contrasena incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo con imagen */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://picsum.photos/seed/login-bg/800/1000"
          alt="Papeleria"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/60 to-primary/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">BS</span>
            </div>
            <span className="font-heading text-xl font-bold text-white">BSPapeleria</span>
          </Link>
          <div>
            <blockquote className="text-white/90 text-xl font-heading italic mb-4 leading-relaxed">
              "La creatividad no espera. Tus materiales, tampoco."
            </blockquote>
            <div className="flex items-center gap-3">
              <img src="https://picsum.photos/seed/testimonial-login/48/48" alt="Cliente" className="w-10 h-10 rounded-full border-2 border-white/30" />
              <div>
                <p className="text-white font-medium text-sm">Ana Garcia</p>
                <p className="text-white/50 text-xs">Alumna del taller de lettering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="flex items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">BS</span>
            </div>
            <span className="font-heading text-xl font-bold text-dark">BSPapeleria</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-dark mb-2">Bienvenida/o</h1>
          <p className="text-dark/50 mb-8">Ingresa a tu cuenta para continuar</p>

          {error && <div className="mb-5"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                className="input-base"
                placeholder="hola@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-dark">Contrasena</label>
              </div>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                className="input-base"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Iniciar sesion
            </Button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sand/50" /></div>
            <div className="relative flex justify-center"><span className="bg-cream px-3 text-dark/30 text-xs">o</span></div>
          </div>

          <p className="text-center text-dark/50 text-sm">
            No tenes cuenta?{' '}
            <Link to="/registro" className="text-primary font-semibold hover:text-secondary">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

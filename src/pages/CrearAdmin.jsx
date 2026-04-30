import { useState } from 'react'
import { crearAdmin } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function CrearAdmin() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await crearAdmin(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear admin')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-black text-dark">Crear Admin</h1>
          <p className="text-dark/50 mt-2">Página temporal - solo para desarrollo</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-600 font-medium">Admin creado exitosamente!</p>
            <p className="text-dark/40 text-sm mt-2">Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-sand/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-sand/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-sand/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition"
            >
              Crear Admin
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
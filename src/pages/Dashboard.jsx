import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, BookOpen, Clock, CheckCircle, XCircle, Truck, ShoppingBag, ArrowRight, Play } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { getMisOrdenes } from '../api/ordenes'
import { cursos } from '../data/cursosData'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import Button from '../components/ui/Button'

const estadoConfig = {
  PENDIENTE:  { label: 'Pendiente',  color: 'bg-warning-bg text-warning',  icon: Clock       },
  PAGADA:     { label: 'Pagada',     color: 'bg-success-bg text-success',  icon: CheckCircle },
  CANCELADA:  { label: 'Cancelada',  color: 'bg-error-bg text-error',       icon: XCircle     },
  ENVIADA:    { label: 'Enviada',    color: 'bg-accent/20 text-secondary', icon: Truck       },
}

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.rol === 'ADMIN') { navigate('/admin'); return }
    getMisOrdenes()
      .then((res) => setOrdenes(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar ordenes'))
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (!user) return null

  const totalGastado = ordenes.reduce((s, o) => s + Number(o.total), 0)

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero del dashboard */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark via-secondary/80 to-dark py-14">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/dashboard-bg/1400/400" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <span className="font-heading text-2xl font-bold text-white">
                  {user.nombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-0.5">Bienvenida/o de vuelta</p>
                <h1 className="font-heading text-2xl font-bold text-white">{user.nombre}</h1>
                <p className="text-white/40 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="text-sm text-white/40 hover:text-error transition border border-white/10 hover:border-error/30 px-4 py-2 rounded-xl"
            >
              Cerrar sesion
            </button>
          </div>

          {/* Stats del usuario */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-white/40 text-xs mb-1">Ordenes realizadas</p>
              <p className="font-heading text-2xl font-bold text-white">{ordenes.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <p className="text-white/40 text-xs mb-1">Total invertido</p>
              <p className="font-heading text-2xl font-bold text-primary">
                ${totalGastado.toLocaleString('es-AR')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hidden sm:block">
              <p className="text-white/40 text-xs mb-1">Rol</p>
              <p className="font-heading text-xl font-bold text-white capitalize">
                {user.rol === 'ADMIN' ? '⚡ Admin' : '⭐ Cliente'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rapidas */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { to: '/productos', icon: ShoppingBag, label: 'Ir a la tienda', color: 'bg-primary/10 text-primary' },
            { to: '/cursos',  icon: BookOpen,   label: 'Ver cursos',     color: 'bg-accent/10 text-accent'   },
            { to: '/carrito', icon: Package,    label: 'Mi carrito',     color: 'bg-sand/50 text-dark'       },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={`flex items-center gap-3 p-4 rounded-2xl border border-sand/30 bg-white hover:shadow-md transition-shadow group`}
            >
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
                <a.icon size={18} />
              </div>
              <span className="font-medium text-dark text-sm">{a.label}</span>
              <ArrowRight size={14} className="ml-auto text-dark/20 group-hover:text-dark/50 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Historial de ordenes */}
        <h2 className="font-heading text-xl font-bold text-dark mb-5">Mis ordenes</h2>

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : ordenes.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-sand/30 shadow-sm">
            <div className="w-20 h-20 bg-sand/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={36} className="text-primary/50" />
            </div>
            <h3 className="font-heading text-xl font-bold text-dark mb-2">
              Todavia no realizaste compras
            </h3>
            <p className="text-dark/40 mb-6">Explora nuestra tienda y encontra tus productos favoritos</p>
            <Button onClick={() => navigate('/productos')}>Ir a la tienda</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map((orden) => {
              const cfg = estadoConfig[orden.estado] || estadoConfig.PENDIENTE
              const Icon = cfg.icon
              return (
                <div key={orden.id} className="bg-white rounded-2xl border border-sand/30 shadow-sm overflow-hidden">
                  {/* Header de orden */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-sand/20">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-dark/30">Orden</p>
                        <p className="font-bold text-dark text-lg">#{orden.id}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-sand/30" />
                      <div className="hidden sm:block">
                        <p className="text-xs text-dark/30">Fecha</p>
                        <p className="text-dark text-sm font-medium">
                          {new Date(orden.fechaCreacion).toLocaleDateString('es-AR', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                        <Icon size={11} />
                        {cfg.label}
                      </span>
                      <span className="font-heading font-bold text-primary text-xl">
                        ${Number(orden.total).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  {/* Items de la orden */}
                  <div className="px-5 py-4 space-y-2">
                    {orden.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.tipoItem === 'CURSO' ? 'bg-accent/10' : 'bg-primary/10'
                        }`}>
                          {item.tipoItem === 'CURSO'
                            ? <BookOpen size={14} className="text-accent" />
                            : <Package size={14} className="text-primary" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-dark/70 text-sm font-medium truncate">{item.nombreSnapshot}</p>
                          <p className="text-dark/30 text-xs">{item.tipoItem} · x{item.cantidad}</p>
                          {item.tipoItem === 'CURSO' && orden.estado === 'PAGADA' && (
                            (() => {
                              const refId = item.referenciaId
                              const curso = cursos.find(c => 
                                c.id === refId || 
                                c.id === Number(refId) || 
                                c.id.toString() === String(refId) ||
                                c.slug === refId
                              )
                              return curso ? (
                                <Link 
                                  to={`/cursos/${curso.slug}/aula`}
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline"
                                >
                                  <Play size={12} />
                                  Ir al aula
                                </Link>
                              ) : (
                                <span className="inline-flex items-center gap-1 mt-1 text-xs text-dark/30">
                                  (curso no encontrado)
                                </span>
                              )
                            })()
                          )}
                        </div>
                        <p className="text-dark/60 text-sm font-medium flex-shrink-0">
                          ${(Number(item.precioUnitario) * item.cantidad).toLocaleString('es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

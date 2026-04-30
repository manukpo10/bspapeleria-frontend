import { useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { Package, BookOpen, ShoppingBag, LogOut, Home, Settings } from 'lucide-react'

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
    }
  }, [isAdmin, navigate])

  if (!isAdmin()) return null

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
    { path: '/admin/productos', icon: Package, label: 'Productos' },
  ]

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-sand/30 flex flex-col">
        <div className="p-6 border-b border-sand/30">
          <h1 className="font-heading text-xl font-black text-primary">BS Admin</h1>
          <p className="text-xs text-dark/40">Panel de gestión</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-dark/60 hover:bg-sand/30'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sand/30">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{user?.nombre?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">{user?.nombre || 'Admin'}</p>
              <p className="text-xs text-dark/40">Administrador</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
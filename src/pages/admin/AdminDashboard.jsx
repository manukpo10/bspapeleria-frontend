import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Package, ShoppingBag, Users } from 'lucide-react'
import { getMisOrdenes } from '../../api/ordenes'
import useAuthStore from '../../store/useAuthStore'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    cursos: 8,
    productos: 12,
    ordenes: 0,
    usuarios: 0,
  })

  return (
    <div>
      <h1 className="font-heading text-3xl font-black text-dark mb-2">
        Bienvenido, {user?.nombre}
      </h1>
      <p className="text-dark/50 mb-8">Panel de administración de BS Papelería</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/cursos"
          className="bg-white rounded-2xl p-6 border border-sand/30 hover:shadow-lg hover:border-primary/30 transition"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-heading font-black text-dark">{stats.cursos}</p>
          <p className="text-dark/50 text-sm">Cursos</p>
        </Link>

        <Link
          to="/admin/productos"
          className="bg-white rounded-2xl p-6 border border-sand/30 hover:shadow-lg hover:border-primary/30 transition"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
            <Package className="text-accent" size={24} />
          </div>
          <p className="text-3xl font-heading font-black text-dark">{stats.productos}</p>
          <p className="text-dark/50 text-sm">Productos</p>
        </Link>

        <div className="bg-white rounded-2xl p-6 border border-sand/30">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-heading font-black text-dark">{stats.ordenes}</p>
          <p className="text-dark/50 text-sm">Órdenes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand/30">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
            <Users className="text-secondary" size={24} />
          </div>
          <p className="text-3xl font-heading font-black text-dark">{stats.usuarios}</p>
          <p className="text-dark/50 text-sm">Usuarios</p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <h2 className="font-heading text-xl font-bold text-dark mb-4">Accesos rápidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/cursos"
          className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 hover:from-primary/10 hover:to-accent/10 transition"
        >
          <BookOpen className="text-primary mb-2" size={24} />
          <p className="font-bold text-dark">Gestionar Cursos</p>
          <p className="text-sm text-dark/50">Agregar, editar o eliminar cursos</p>
        </Link>

        <Link
          to="/admin/productos"
          className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 hover:from-primary/10 hover:to-accent/10 transition"
        >
          <Package className="text-accent mb-2" size={24} />
          <p className="font-bold text-dark">Gestionar Productos</p>
          <p className="text-sm text-dark/50">Agregar, editar o eliminar productos</p>
        </Link>
      </div>
    </div>
  )
}
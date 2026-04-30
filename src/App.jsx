import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import Cursos from './pages/Cursos'
import CursoDetalle from './pages/CursoDetalle'
import CursoAula from './pages/CursoAula'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Preguntas from './pages/Preguntas'
import CrearAdmin from './pages/CrearAdmin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCursos from './pages/admin/AdminCursos'
import AdminProductos from './pages/admin/AdminProductos'

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-cream font-body text-dark">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/nosotros"  element={<Nosotros />} />
          <Route path="/productos" element={<Tienda />} />
          <Route path="/cursos"    element={<Cursos />} />
          <Route path="/cursos/:slug" element={<CursoDetalle />} />
          <Route path="/cursos/:slug/aula" element={<CursoAula />} />
          <Route path="/preguntas" element={<Preguntas />} />
          <Route path="/carrito"   element={<Carrito />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/registro"  element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacto"  element={<Contacto />} />
          <Route path="/crear-admin" element={<CrearAdmin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cursos" element={<AdminCursos />} />
            <Route path="productos" element={<AdminProductos />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

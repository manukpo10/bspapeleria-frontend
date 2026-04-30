import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, BookOpen, Loader2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import { getCursosAdmin, crearCurso, actualizarCurso, eliminarCurso } from '../../api/admin'

export default function AdminCursos() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'agendas',
    nivel: 'intermedio',
    duracion: '',
    clases: 0,
    precio: 0,
    precioOriginal: 0,
    instructor: '',
    imagen: '',
    disponible: true,
  })

  useEffect(() => {
    loadCursos()
  }, [])

  const loadCursos = async () => {
    try {
      const res = await getCursosAdmin()
      const data = (res.data || []).map(c => ({
        ...c,
        slug: c.slug || c.titulo?.toLowerCase().replace(/\s+/g, '-'),
      }))
      setCursos(data)
    } catch (err) {
      setError('Error al cargar cursos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: form.precio,
        precioOriginal: form.precioOriginal || null,
        categoria: form.categoria,
        nivel: form.nivel,
        duracion: form.duracion,
        clases: form.clases,
        instructor: form.instructor,
        imagen: form.imagen,
        disponible: form.disponible,
      }

      if (editando) {
        await actualizarCurso(editando, data)
      } else {
        await crearCurso(data)
      }
      setShowForm(false)
      setEditando(null)
      setForm({ titulo: '', descripcion: '', categoria: 'agendas', nivel: 'intermedio', duracion: '', clases: 0, precio: 0, precioOriginal: 0, instructor: '', imagen: '', disponible: true })
      loadCursos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar curso')
    }
  }

  const handleEdit = (curso) => {
    setEditando(curso.id)
    setForm({
      titulo: curso.titulo || '',
      descripcion: curso.descripcion || '',
      categoria: curso.categoria || 'agendas',
      nivel: curso.nivel || 'intermedio',
      duracion: curso.duracion || '',
      clases: curso.clases || 0,
      precio: curso.precio || 0,
      precioOriginal: curso.precioOriginal || 0,
      instructor: curso.instructor || '',
      imagen: curso.imagen || '',
      disponible: curso.disponible !== false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      try {
        await eliminarCurso(id)
        loadCursos()
      } catch (err) {
        alert('Error al eliminar curso')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-black text-dark">Gestión de Cursos</h1>
          <p className="text-dark/50">Administra los cursos del catálogo</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditando(null); setForm({ titulo: '', descripcion: '', categoria: 'agendas', nivel: 'intermedio', duracion: '', clases: 0, precio: 0, precioOriginal: 0, instructor: '', imagen: '', disponible: true }) }}>
          <Plus size={18} className="mr-2" />
          Nuevo Curso
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold">{editando ? 'Editar' : 'Nuevo'} Curso</h2>
              <button onClick={() => { setShowForm(false); setEditando(null) }} className="text-dark/40 hover:text-dark">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.titulo}
                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Instructor</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.instructor}
                    onChange={e => setForm({ ...form, instructor: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Descripción</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Categoría</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="agendas">Agendas</option>
                    <option value="fiestas">Fiestas</option>
                    <option value="escolar">Escolar</option>
                    <option value="digital">Digital</option>
                    <option value="arte">Arte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Nivel</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.nivel}
                    onChange={e => setForm({ ...form, nivel: e.target.value })}
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Duración</label>
                  <input
                    type="text"
                    placeholder="ej: 8 horas"
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.duracion}
                    onChange={e => setForm({ ...form, duracion: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Precio ($) *</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.precio}
                    onChange={e => setForm({ ...form, precio: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Precio Original ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.precioOriginal}
                    onChange={e => setForm({ ...form, precioOriginal: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Clases</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.clases}
                    onChange={e => setForm({ ...form, clases: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">URL de Imagen</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                  value={form.imagen}
                  onChange={e => setForm({ ...form, imagen: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="disponible"
                  checked={form.disponible}
                  onChange={e => setForm({ ...form, disponible: e.target.checked })}
                />
                <label htmlFor="disponible" className="text-sm text-dark">Curso disponible</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editando ? 'Guardar Cambios' : 'Crear Curso'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditando(null) }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de cursos */}
      <div className="bg-white rounded-2xl border border-sand/30 overflow-hidden">
        {cursos.length === 0 ? (
          <div className="p-8 text-center text-dark/50">
            No hay cursos. Crea el primero.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-cream/50 border-b border-sand/30">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Curso</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Categoría</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Precio</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Estado</th>
                <th className="text-right px-6 py-4 font-medium text-dark/60">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((curso) => (
                <tr key={curso.id} className="border-b border-sand/20 hover:bg-cream/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <span className="font-medium text-dark">{curso.titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark/60 capitalize">{curso.categoria || '-'}</td>
                  <td className="px-6 py-4 font-medium text-dark">${Number(curso.precio || 0).toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      curso.disponible ? 'bg-green-100 text-green-700' : 'bg-sand text-dark/50'
                    }`}>
                      {curso.disponible ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/cursos/${curso.slug || curso.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-secondary hover:bg-secondary/10 rounded-lg mr-2"
                    >
                      <Eye size={16} />
                      Ver
                    </Link>
                    <button
                      onClick={() => handleEdit(curso)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg mr-2"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(curso.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Package, Loader2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import { getProductosAdmin, crearProducto, actualizarProducto, eliminarProducto } from '../../api/admin'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'agendas',
    precio: 0,
    precioOriginal: 0,
    stock: 0,
    imagen: '',
    disponible: true,
  })

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try {
      const res = await getProductosAdmin()
      setProductos(res.data || res.data.content || [])
    } catch (err) {
      setError('Error al cargar productos')
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
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        precioOriginal: form.precioOriginal || null,
        stock: form.stock,
        categoria: form.categoria,
        imagen: form.imagen,
        disponible: form.disponible,
      }

      if (editando) {
        await actualizarProducto(editando, data)
      } else {
        await crearProducto(data)
      }
      setShowForm(false)
      setEditando(null)
      setForm({ nombre: '', descripcion: '', categoria: 'agendas', precio: 0, precioOriginal: 0, stock: 0, imagen: '', disponible: true })
      loadProductos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto')
    }
  }

  const handleEdit = (producto) => {
    setEditando(producto.id)
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || 'agendas',
      precio: producto.precio || 0,
      precioOriginal: producto.precioOriginal || 0,
      stock: producto.stock || 0,
      imagen: producto.imagen || '',
      disponible: producto.disponible !== false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await eliminarProducto(id)
        loadProductos()
      } catch (err) {
        alert('Error al eliminar producto')
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
          <h1 className="font-heading text-2xl font-black text-dark">Gestión de Productos</h1>
          <p className="text-dark/50">Administra los productos de la tienda</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditando(null); setForm({ nombre: '', descripcion: '', categoria: 'agendas', precio: 0, precioOriginal: 0, stock: 0, imagen: '', disponible: true }) }}>
          <Plus size={18} className="mr-2" />
          Nuevo Producto
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
              <h2 className="font-heading text-xl font-bold">{editando ? 'Editar' : 'Nuevo'} Producto</h2>
              <button onClick={() => { setShowForm(false); setEditando(null) }} className="text-dark/40 hover:text-dark">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                />
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
                    <option value="ofi">Oficina</option>
                  </select>
                </div>
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
                  <label className="block text-sm font-medium text-dark mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sand/30 focus:border-primary outline-none"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
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
                  id="disponibleProd"
                  checked={form.disponible}
                  onChange={e => setForm({ ...form, disponible: e.target.checked })}
                />
                <label htmlFor="disponibleProd" className="text-sm text-dark">Producto disponible</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editando ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditando(null) }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="bg-white rounded-2xl border border-sand/30 overflow-hidden">
        {productos.length === 0 ? (
          <div className="p-8 text-center text-dark/50">
            No hay productos. Crea el primero.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-cream/50 border-b border-sand/30">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Producto</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Categoría</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Precio</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Stock</th>
                <th className="text-left px-6 py-4 font-medium text-dark/60">Estado</th>
                <th className="text-right px-6 py-4 font-medium text-dark/60">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-sand/20 hover:bg-cream/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Package size={18} className="text-accent" />
                      </div>
                      <span className="font-medium text-dark">{producto.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark/60 capitalize">{producto.categoria || '-'}</td>
                  <td className="px-6 py-4 font-medium text-dark">${Number(producto.precio || 0).toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4 text-dark/60">{producto.stock} unidades</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      producto.disponible ? 'bg-green-100 text-green-700' : 'bg-sand text-dark/50'
                    }`}>
                      {producto.disponible ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg mr-2"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
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
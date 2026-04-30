import api from './axios'

// Cursos
export const getCursosAdmin = () => api.get('/admin/cursos')
export const getCursoAdmin = (id) => api.get(`/admin/cursos/${id}`)
export const crearCurso = (data) => api.post('/admin/cursos', data)
export const actualizarCurso = (id, data) => api.put(`/admin/cursos/${id}`, data)
export const eliminarCurso = (id) => api.delete(`/admin/cursos/${id}`)

// Productos
export const getProductosAdmin = () => api.get('/admin/productos')
export const getProductoAdmin = (id) => api.get(`/admin/productos/${id}`)
export const crearProducto = (data) => api.post('/admin/productos', data)
export const actualizarProducto = (id, data) => api.put(`/admin/productos/${id}`, data)
export const eliminarProducto = (id) => api.delete(`/admin/productos/${id}`)
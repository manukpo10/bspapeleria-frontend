import api from './axios'

export const getProductos = (categoria) =>
  api.get('/productos', { params: categoria ? { categoria } : {} })

export const getProducto = (id) => api.get(`/productos/${id}`)
export const createProducto = (data) => api.post('/productos', data)
export const updateProducto = (id, data) => api.put(`/productos/${id}`, data)
export const deleteProducto = (id) => api.delete(`/productos/${id}`)

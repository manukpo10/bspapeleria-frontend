import api from './axios'

export const crearOrden = (data) => api.post('/ordenes', data)
export const getMisOrdenes = () => api.get('/ordenes/mis-ordenes')
export const getTodasOrdenes = () => api.get('/ordenes')
